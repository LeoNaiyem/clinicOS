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
import { BiSearch, BiTrash } from "react-icons/bi";
import { BsEye, BsFunnel, BsPencilSquare } from "react-icons/bs";
import { toast } from "react-toastify";

const ManagePurchase = () => {
  // State for purchases data
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter state
  const [filter, setFilter] = useState({
    search: "",
    supplier_id: "",
    from_date: "",
    to_date: "",
  });

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  // Form state for edit
  const [editForm, setEditForm] = useState({
    purchase_date: "",
    delivery_date: "",
    shipping_address: "",
    remark: "",
    discount: "",
    vat: "",
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchasesRes, suppliersRes] = await Promise.all([
          axios.get("/api/purchase"),
          axios.get("/api/supplier"),
        ]);
        setPurchases(purchasesRes.data.purchase);
        setSuppliers(suppliersRes.data.suppliers);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        toast.error("Failed to load data!")
        console.log(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter purchases
  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      purchase.id.includes(filter.search) ||
      purchase.remark?.toLowerCase().includes(filter.search.toLowerCase());

    const matchesSupplier = filter.supplier_id
      ? purchase.supplier_id === filter.supplier_id
      : true;

    const matchesDate =
      filter.from_date && filter.to_date
        ? purchase.purchase_date >= filter.from_date &&
          purchase.purchase_date <= filter.to_date
        : true;

    return matchesSearch && matchesSupplier && matchesDate;
  });

  // Handle view
  const handleView = (purchase) => {
    setSelectedPurchase(purchase);
    setShowViewModal(true);
  };

  // Handle edit
  const handleEdit = (purchase) => {
    setSelectedPurchase(purchase);
    setEditForm({
      purchase_date: purchase.purchase_date.split(" ")[0],
      delivery_date: purchase.delivery_date.split(" ")[0],
      shipping_address: purchase.shipping_address,
      remark: purchase.remark,
      discount: purchase.discount,
      vat: purchase.vat,
    });
    setShowEditModal(true);
  };

  // Handle edit form change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save edited purchase
  const saveEdit = async () => {
    try {
      const response = await axios.put(
        `/api/purchase/update/${selectedPurchase.id}`,
        editForm
      );

      if (response.data.success) {
        setPurchases(
          purchases.map((p) =>
            p.id === selectedPurchase.id ? { ...p, ...editForm } : p
          )
        );
        setShowEditModal(false);
      }
    } catch (err) {
      setError("Failed to update purchase");
      toast.error("Failed to update purchase");
      console.log(err);
    }
  };

  // Handle delete
  const handleDelete = (purchase) => {
    setSelectedPurchase(purchase);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/purchase/delete/${selectedPurchase.id}`);
      setPurchases(purchases.filter((p) => p.id !== selectedPurchase.id));
      setShowDeleteModal(false);
    } catch (err) {
      setError("Failed to delete purchase");
      console.log(err);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilter({
      search: "",
      supplier_id: "",
      from_date: "",
      to_date: "",
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
      {/* View Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Purchase Details #{selectedPurchase?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPurchase && (
            <Row>
              <Col md={6}>
                <p>
                  <strong>Supplier:</strong>{" "}
                  {suppliers.find((s) => s.id == selectedPurchase.supplier_id)
                    ?.name || "N/A"}
                </p>
                <p>
                  <strong>Purchase Date:</strong>{" "}
                  {selectedPurchase.purchase_date}
                </p>
                <p>
                  <strong>Delivery Date:</strong>{" "}
                  {selectedPurchase.delivery_date}
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <strong>Total Amount:</strong>{" "}
                  {selectedPurchase.purchase_total}
                </p>
                <p>
                  <strong>Discount:</strong> {selectedPurchase.discount}%
                </p>
                <p>
                  <strong>VAT:</strong> {selectedPurchase.vat}%
                </p>
              </Col>
              <Col md={12}>
                <p>
                  <strong>Shipping Address:</strong>{" "}
                  {selectedPurchase.shipping_address || "N/A"}
                </p>
                <p>
                  <strong>Remarks:</strong> {selectedPurchase.remark || "N/A"}
                </p>
              </Col>
            </Row>
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
          <Modal.Title>Edit Purchase #{selectedPurchase?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPurchase && (
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Purchase Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="purchase_date"
                      value={editForm.purchase_date}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Delivery Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="delivery_date"
                      value={editForm.delivery_date}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Shipping Address</Form.Label>
                <Form.Control
                  as="textarea"
                  name="shipping_address"
                  value={editForm.shipping_address}
                  onChange={handleEditChange}
                  rows={3}
                />
              </Form.Group>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Discount (%)</Form.Label>
                    <Form.Control
                      type="number"
                      name="discount"
                      value={editForm.discount}
                      onChange={handleEditChange}
                      min="0"
                      max="100"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>VAT (%)</Form.Label>
                    <Form.Control
                      type="number"
                      name="vat"
                      value={editForm.vat}
                      onChange={handleEditChange}
                      min="0"
                      max="100"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  as="textarea"
                  name="remark"
                  value={editForm.remark}
                  onChange={handleEditChange}
                  rows={2}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete Purchase #{selectedPurchase?.id}?
          <br />
          <strong>Total Amount: {selectedPurchase?.purchase_total}</strong>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="mb-4">
        <Col>
          <Card className=" bg-info d-flex flex-row justify-content-between align-items-center py-3 px-4">
            <h2 className="text-light">Manage Purchases</h2>
            {/* Summary */}
            <div>
              <Badge bg="secondary" className="mr-2">
                Total Purchases: {purchases.length}
              </Badge>
              <Badge bg="dark">Filtered: {filteredPurchases.length}</Badge>
            </div>
            <Button variant="success" href="/purchase/create" className="mr-2">
              Create New Purchase
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Filter Section */}
      <Card className="mb-4">
        <Card.Body className="pr-5">
          <Row className="g-3 d-flex align-items-center">
            <Col md={4}>
              <InputGroup className="d-flex align-items-center">
                <InputGroup.Text>
                  <BiSearch className="mr-2" size={22} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by ID or remarks"
                  value={filter.search}
                  onChange={(e) =>
                    setFilter({ ...filter, search: e.target.value })
                  }
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                className="p-1"
                value={filter.supplier_id}
                onChange={(e) =>
                  setFilter({ ...filter, supplier_id: e.target.value })
                }
              >
                <option value="">All Suppliers</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Control
                type="date"
                placeholder="From Date"
                value={filter.from_date}
                onChange={(e) =>
                  setFilter({ ...filter, from_date: e.target.value })
                }
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="date"
                placeholder="To Date"
                value={filter.to_date}
                onChange={(e) =>
                  setFilter({ ...filter, to_date: e.target.value })
                }
              />
            </Col>
            <Col md={1}>
              <Button variant="outline-danger" onClick={resetFilters}>
                <BsFunnel /> Reset
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Purchases Table */}
      <Card>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Supplier</th>
                <th>Purchase Date</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase) => {
                  const supplier = suppliers.find(
                    (s) => s.id == purchase.supplier_id
                  );
                  return (
                    <tr key={purchase.id}>
                      <td>{purchase.id}</td>
                      <td>{supplier?.name || "N/A"}</td>
                      <td>{purchase.purchase_date.split(" ")[0]}</td>
                      <td>{purchase.purchase_total}</td>
                      <td>
                        <Badge
                          bg={
                            purchase.status_id === "1" ? "success" : "warning"
                          }
                        >
                          {purchase.status_id === "1" ? "Completed" : "Pending"}
                        </Badge>
                      </td>
                      <td>{purchase.remark}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="mr-1"
                          onClick={() => handleView(purchase)}
                        >
                          <BsEye />
                        </Button>
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="mr-1"
                          onClick={() => handleEdit(purchase)}
                        >
                          <BsPencilSquare />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(purchase)}
                        >
                          <BiTrash />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No purchases found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ManagePurchase;
