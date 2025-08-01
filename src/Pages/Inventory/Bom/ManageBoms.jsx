import axios from "axios";
import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import { TbEdit, TbEye, TbTrash } from "react-icons/tb";

const ManageBoms = () => {
  const [boms, setBoms] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({
    search: "",
    product_id: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBom, setSelectedBom] = useState(null);
  const [editFormData, setEditFormData] = useState({
    code: "",
    name: "",
    product_id: "",
    qty: "",
    labour_cost: "",
    date: "",
  });

  // Fetch BOMs and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bomsRes, productsRes] = await Promise.all([
          axios.get(
            "/.netlify/functions/api-proxy/mfgbom"
          ),
          axios.get(
            "/.netlify/functions/api-proxy/product"
          ),
        ]);

        setBoms(bomsRes.data.mfg_boms);
        setProducts(productsRes.data.products);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter BOMs
  const filteredBoms = boms.filter((bom) => {
    const matchesSearch =
      bom.code.toLowerCase().includes(filter.search.toLowerCase()) ||
      bom.name.toLowerCase().includes(filter.search.toLowerCase());
    const matchesProduct = filter.product_id
      ? bom.product_id === filter.product_id
      : true;
    return matchesSearch && matchesProduct;
  });

  // Handle view
  const handleView = (bom) => {
    setSelectedBom(bom);
    setShowViewModal(true);
  };

  // Handle edit
  const handleEdit = (bom) => {
    setSelectedBom(bom);
    setEditFormData({
      code: bom.code,
      name: bom.name,
      product_id: bom.product_id,
      qty: bom.qty,
      labour_cost: bom.labour_cost,
      date: bom.date ? bom.date.split("T")[0] : "",
    });
    setShowEditModal(true);
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Update BOM
  const handleUpdate = async () => {
    try {
      const updatedBom = await axios.put(
        `http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/api/mfgbom/update/${selectedBom.id}`,
        editFormData
      );
      setBoms(
        boms.map((bom) =>
          bom.id === selectedBom.id ? updatedBom.data.mfg_bom : bom
        )
      );
      setShowEditModal(false);
    } catch (err) {
      setError("Failed to update BOM");
      console.log(err)
    }
  };

  // Handle delete confirmation
  const confirmDelete = (bom) => {
    setSelectedBom(bom);
    setShowDeleteModal(true);
  };

  // Delete BOM
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/api/delete/${selectedBom.id}`
      );
      setBoms(boms.filter((bom) => bom.id !== selectedBom.id));
      setShowDeleteModal(false);
    } catch (err) {
      setError("Failed to delete BOM");
      console.log(err)
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilter({
      search: "",
      product_id: "",
    });
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete BOM{" "}
          <strong>
            {selectedBom?.code} - {selectedBom?.name}
          </strong>
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            BOM Details: {selectedBom?.code} - {selectedBom?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBom && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Code:</strong> {selectedBom.code}
                </Col>
                <Col md={6}>
                  <strong>Name:</strong> {selectedBom.name}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Product:</strong>{" "}
                  {products.find((p) => p.id == selectedBom.product_id)?.name ||
                    "N/A"}
                </Col>
                <Col md={6}>
                  <strong>Quantity:</strong> {selectedBom.qty}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Labor Cost:</strong> {selectedBom.labour_cost}
                </Col>
                <Col md={6}>
                  <strong>Date:</strong>{" "}
                  {selectedBom.date
                    ? new Date(selectedBom.date).toLocaleDateString()
                    : "N/A"}
                </Col>
              </Row>
              {/* Add more details as needed */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Edit BOM: {selectedBom?.code} - {selectedBom?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBom && (
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formCode">
                    <Form.Label>Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="code"
                      value={editFormData.code}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formProduct">
                    <Form.Label>Product</Form.Label>
                    <Form.Select
                      name="product_id"
                      value={editFormData.product_id}
                      onChange={handleEditChange}
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formQty">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      name="qty"
                      value={editFormData.qty}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formLabourCost">
                    <Form.Label>Labor Cost</Form.Label>
                    <Form.Control
                      type="number"
                      name="labour_cost"
                      value={editFormData.labour_cost}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={editFormData.date}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="mb-4">
        <Col>
          <h2>Manage Manufacturing BOMs</h2>
          <Button variant="primary" className="me-2">
            Create New BOM
          </Button>
        </Col>
      </Row>

      {/* Filter Section */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <BiSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by code or name"
                  value={filter.search}
                  onChange={(e) =>
                    setFilter({ ...filter, search: e.target.value })
                  }
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Select
                value={filter.product_id}
                onChange={(e) =>
                  setFilter({ ...filter, product_id: e.target.value })
                }
              >
                <option value="">Filter by Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button variant="outline-secondary" onClick={resetFilters}>
                Reset Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* BOMs Table */}
      <Card>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Labor Cost</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBoms.length > 0 ? (
                filteredBoms.map((bom) => {
                  const product = products.find((p) => p.id == bom.product_id);
                  return (
                    <tr key={bom.id}>
                      <td>{bom.code}</td>
                      <td>{bom.name}</td>
                      <td>
                        {product ? (
                          <Badge bg="info">{product.name}</Badge>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>{bom.qty}</td>
                      <td>{bom.labour_cost}</td>
                      <td>
                        {bom.date
                          ? new Date(bom.date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleView(bom)}
                        >
                          <TbEye />
                        </Button>
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="me-1"
                          onClick={() => handleEdit(bom)}
                        >
                          <TbEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => confirmDelete(bom)}
                        >
                          <TbTrash />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No BOMs found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Summary */}
      <div className="mt-3 text-end">
        <Badge bg="secondary" className="me-2">
          Total BOMs: {boms.length}
        </Badge>
        <Badge bg="info">Filtered: {filteredBoms.length}</Badge>
      </div>
    </Container>
  );
};

export default ManageBoms;
