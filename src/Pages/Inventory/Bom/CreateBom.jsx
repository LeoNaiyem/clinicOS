import axios from "axios";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Spinner,
  Table
} from "react-bootstrap";

const CreateBom = () => {
  // Main form state
  const [formData, setFormData] = useState({
    code: "",
    bom_name: "",
    mfg_product_id: "",
    qty: "",
    labor_cost: "",
    date: new Date().toISOString().split("T")[0],
    remark: "",
    raw_items: [],
  });

  // Additional state
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Current raw material being added
  const [currentRawItem, setCurrentRawItem] = useState({
    product_id: "",
    uom_id: "",
    qty: "",
    cost: "",
  });

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, uomsRes] = await Promise.all([
          axios.get("/api/product"),
          axios.get("/api/uom"),
        ]);

        setProducts(productsRes.data.products);
        setUoms(uomsRes.data.uoms);
        setProductLoading(false);
      } catch (err) {
        setError("Failed to load dropdown data");
        setProductLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle main form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle raw material form changes
  const handleRawItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentRawItem((prev) => ({ ...prev, [name]: value }));
  };

  // Add raw material to the list
  const addRawItem = () => {
    if (!currentRawItem.product_id || !currentRawItem.qty) return;

    setFormData((prev) => ({
      ...prev,
      raw_items: [...prev.raw_items, currentRawItem],
    }));

    setCurrentRawItem({
      product_id: "",
      uom_id: "",
      qty: "",
      cost: "",
    });
  };

  // Remove raw material from list
  const removeRawItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      raw_items: prev.raw_items.filter((_, i) => i !== index),
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Prepare payload with proper data types
      const payload = {
        ...formData,
        qty: parseFloat(formData.qty),
        labor_cost: parseFloat(formData.labor_cost),
        raw_items: formData.raw_items?.map((item) => ({
          ...item,
          qty: parseFloat(item.qty),
          cost: parseFloat(item.cost) || 0,
        })),
      };

      console.log("Submitting:", payload); // Debug log

      const response = await axios.post("/api/mfgbom/save", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success === "yes") {
        setSuccess(true);
        // Reset form
        setFormData({
          code: "",
          bom_name: "",
          mfg_product_id: "",
          qty: "",
          labor_cost: "",
          date: new Date().toISOString().split("T")[0],
          remark: "",
          raw_items: [],
        });
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.response?.data?.message || "Failed to save BOM");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Create Manufacturing BOM</h4>
              <Button variant="light" size="sm" href="/mfgbom">
                <i className="bi bi-list me-2"></i>
                View All BOMs
              </Button>
            </Card.Header>

            <Card.Body>
              {success && (
                <Alert
                  variant="success"
                  dismissible
                  onClose={() => setSuccess(false)}
                >
                  BOM created successfully!
                </Alert>
              )}

              {error && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <FloatingLabel label="BOM Code" className="mb-3">
                      <Form.Control
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="BOM-001"
                        required
                      />
                    </FloatingLabel>
                  </Col>

                  <Col md={6}>
                    <FloatingLabel label="BOM Name" className="mb-3">
                      <Form.Control
                        type="text"
                        name="bom_name"
                        value={formData.bom_name}
                        onChange={handleChange}
                        placeholder="Main Product BOM"
                        required
                      />
                    </FloatingLabel>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <FloatingLabel label="Product">
                      <Form.Select
                        name="mfg_product_id"
                        value={formData.mfg_product_id}
                        onChange={handleChange}
                        required
                        disabled={productLoading}
                      >
                        <option value="">Select Product</option>
                        {products?.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.code})
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </Col>

                  <Col md={3}>
                    <FloatingLabel label="Quantity">
                      <Form.Control
                        type="number"
                        name="qty"
                        value={formData.qty}
                        onChange={handleChange}
                        min="0.01"
                        step="0.01"
                        required
                      />
                    </FloatingLabel>
                  </Col>

                  <Col md={3}>
                    <FloatingLabel label="Labor Cost">
                      <Form.Control
                        type="number"
                        name="labor_cost"
                        value={formData.labor_cost}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                      />
                    </FloatingLabel>
                  </Col>
                </Row>

                {/* Raw Materials Section */}
                <Card className="mb-4 border-primary">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">Raw Materials</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-2 mb-3">
                      <Col md={5}>
                        <Form.Select
                          name="product_id"
                          value={currentRawItem.product_id}
                          onChange={handleRawItemChange}
                        >
                          <option value="">Select Material</option>
                          {products?.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>

                      <Col md={2}>
                        <Form.Select
                          name="uom_id"
                          value={currentRawItem.uom_id}
                          onChange={handleRawItemChange}
                        >
                          <option value="">UOM</option>
                          {uoms?.map((uom) => (
                            <option key={uom.id} value={uom.id}>
                              {uom.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>

                      <Col md={2}>
                        <Form.Control
                          type="number"
                          name="qty"
                          value={currentRawItem.qty}
                          onChange={handleRawItemChange}
                          placeholder="Qty"
                          min="0.01"
                          step="0.01"
                        />
                      </Col>

                      <Col md={2}>
                        <Form.Control
                          type="number"
                          name="cost"
                          value={currentRawItem.cost}
                          onChange={handleRawItemChange}
                          placeholder="Cost"
                          min="0"
                          step="0.01"
                        />
                      </Col>

                      <Col md={1}>
                        <Button
                          variant="outline-primary"
                          onClick={addRawItem}
                          disabled={
                            !currentRawItem.product_id || !currentRawItem.qty
                          }
                        >
                          <i className="bi bi-plus-lg"></i>
                        </Button>
                      </Col>
                    </Row>

                    {formData.raw_items.length > 0 && (
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>Material</th>
                            <th>UOM</th>
                            <th>Qty</th>
                            <th>Cost</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.raw_items?.map((item, index) => {
                            const product = products.find(
                              (p) => p.id == item.product_id
                            );
                            const uom = uoms.find((u) => u.id == item.uom_id);

                            return (
                              <tr key={index}>
                                <td>{product?.name || "N/A"}</td>
                                <td>{uom?.name || "N/A"}</td>
                                <td>{item.qty}</td>
                                <td>{item.cost || "0.00"}</td>
                                <td>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeRawItem(index)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    )}
                  </Card.Body>
                </Card>

                <FloatingLabel label="Remarks" className="mb-4">
                  <Form.Control
                    as="textarea"
                    name="remark"
                    value={formData.remark}
                    onChange={handleChange}
                    style={{ height: "80px" }}
                  />
                </FloatingLabel>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={loading || formData.raw_items.length === 0}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Saving...
                      </>
                    ) : (
                      "Save Manufacturing BOM"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateBom;
