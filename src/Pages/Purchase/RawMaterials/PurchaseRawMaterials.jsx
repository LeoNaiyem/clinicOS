import axios from "axios";
import { format } from "date-fns";
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
import { toast } from "react-toastify";

const PurchaseRawMaterials = () => {
  // Main form state
  const [formData, setFormData] = useState({
    supplier_id: "",
    purchase_date: format(new Date(), "yyyy-MM-dd"),
    delivery_date: format(new Date(), "yyyy-MM-dd"),
    shipping_address: "",
    purchase_total: 0,
    remark: "",
    discount: 0,
    vat: 0,
    warehouse_id: "",
    products: [],
  });

  // Current product being added
  const [currentProduct, setCurrentProduct] = useState({
    item_id: "",
    qty: "",
    price: "",
    discount: 0,
  });

  // Dropdown data
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [suppliersRes, productsRes, warehousesRes] = await Promise.all([
          axios.get("/api/supplier"),
          axios.get("/api/product"),
          axios.get("/api/warehouse"),
        ]);

        setSuppliers(suppliersRes.data.suppliers || []);
        setProducts(productsRes.data.products || []);
        setWarehouses(warehousesRes.data.warehouses || []);
        setDropdownLoading(false);
      } catch (err) {
        setError("Failed to load dropdown data");
        toast.error("Failed to load dropdown data")
        setDropdownLoading(false);
        console.log(err)
      }
    };

    fetchDropdownData();
  }, []);

  // Handle main form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle product form changes
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Add product to the purchase
  const addProduct = () => {
    if (!currentProduct.item_id || !currentProduct.qty || !currentProduct.price)
      return;

    const newProduct = {
      item_id: currentProduct.item_id,
      qty: parseFloat(currentProduct.qty),
      price: parseFloat(currentProduct.price),
      discount: parseFloat(currentProduct.discount) || 0,
    };

    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, newProduct],
      purchase_total: prev.purchase_total + newProduct.qty * newProduct.price,
    }));

    // Reset current product
    setCurrentProduct({
      item_id: "",
      qty: "",
      price: "",
      discount: 0,
    });
  };

  // Remove product from purchase
  const removeProduct = (index) => {
    const removed = formData.products[index];
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
      purchase_total: prev.purchase_total - removed.qty * removed.price,
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
        purchase_date: formData.purchase_date,
        delivery_date: formData.delivery_date,
        purchase_total: parseFloat(formData.purchase_total),
        discount: parseFloat(formData.discount) || 0,
        vat: parseFloat(formData.vat) || 0,
        products: formData.products.map((product) => ({
          item_id: product.item_id,
          qty: product.qty,
          price: product.price,
          discount: product.discount,
        })),
      };

      console.log("Submitting:", payload); // For debugging

      const response = await axios.post("/api/purchase/save", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "success") {
        setSuccess(true);
        toast.success("Purchase saved successfully!");
        // Reset form
        setFormData({
          supplier_id: "",
          purchase_date: format(new Date(), "yyyy-MM-dd"),
          delivery_date: format(new Date(), "yyyy-MM-dd"),
          shipping_address: "",
          purchase_total: 0,
          remark: "",
          discount: 0,
          vat: 0,
          warehouse_id: "",
          products: [],
        });
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.response?.data?.message || "Failed to save purchase");
      toast.error("Submission Error", err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col lg={12}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4>Purchase Raw Materials</h4>
            </Card.Header>

            <Card.Body>
              {success && (
                <Alert
                  variant="success"
                  onClose={() => setSuccess(false)}
                  dismissible
                >
                  Purchase saved successfully!
                </Alert>
              )}

              {error && (
                <Alert
                  variant="danger"
                  onClose={() => setError("")}
                  dismissible
                >
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={4}>
                    <FloatingLabel label="Supplier" className="mb-3">
                      <Form.Select
                        name="supplier_id"
                        value={formData.supplier_id}
                        onChange={handleChange}
                        required
                        disabled={dropdownLoading}
                      >
                        <option value="">Select Supplier</option>
                        {suppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </Col>

                  <Col md={4}>
                    <FloatingLabel label="Warehouse" className="mb-3">
                      <Form.Select
                        name="warehouse_id"
                        value={formData.warehouse_id}
                        onChange={handleChange}
                        required
                        disabled={dropdownLoading}
                      >
                        <option value="">Select Warehouse</option>
                        {warehouses.map((warehouse) => (
                          <option key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </Col>

                  <Col md={2}>
                    <FloatingLabel label="Purchase Date">
                      <Form.Control
                        type="date"
                        name="purchase_date"
                        value={formData.purchase_date}
                        onChange={handleChange}
                        required
                      />
                    </FloatingLabel>
                  </Col>

                  <Col md={2}>
                    <FloatingLabel label="Delivery Date">
                      <Form.Control
                        type="date"
                        name="delivery_date"
                        value={formData.delivery_date}
                        onChange={handleChange}
                        required
                      />
                    </FloatingLabel>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={8}>
                    <FloatingLabel label="Shipping Address" className="mb-3">
                      <Form.Control
                        as="textarea"
                        name="shipping_address"
                        value={formData.shipping_address}
                        onChange={handleChange}
                        style={{ height: "80px" }}
                      />
                    </FloatingLabel>
                  </Col>

                  <Col md={4}>
                    <Row>
                      <Col md={6}>
                        <FloatingLabel label="Discount (%)">
                          <Form.Control
                            type="number"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            step="0.01"
                          />
                        </FloatingLabel>
                      </Col>
                      <Col md={6}>
                        <FloatingLabel label="VAT (%)">
                          <Form.Control
                            type="number"
                            name="vat"
                            value={formData.vat}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            step="0.01"
                          />
                        </FloatingLabel>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {/* Products Section */}
                <Card className="mb-4 border-primary">
                  <Card.Header className="bg-light">
                    <h5>Products</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-2 mb-3">
                      <Col md={5}>
                        <Form.Select
                          name="item_id"
                          value={currentProduct.item_id}
                          onChange={handleProductChange}
                          disabled={dropdownLoading}
                        >
                          <option value="">Select Product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} ({product.code})
                            </option>
                          ))}
                        </Form.Select>
                      </Col>

                      <Col md={2}>
                        <Form.Control
                          type="number"
                          name="qty"
                          value={currentProduct.qty}
                          onChange={handleProductChange}
                          placeholder="Quantity"
                          min="0.01"
                          step="0.01"
                        />
                      </Col>

                      <Col md={2}>
                        <Form.Control
                          type="number"
                          name="price"
                          value={currentProduct.price}
                          onChange={handleProductChange}
                          placeholder="Price"
                          min="0"
                          step="0.01"
                        />
                      </Col>

                      <Col md={2}>
                        <Form.Control
                          type="number"
                          name="discount"
                          value={currentProduct.discount}
                          onChange={handleProductChange}
                          placeholder="Discount"
                          min="0"
                          step="0.01"
                        />
                      </Col>

                      <Col md={1}>
                        <Button
                          variant="outline-primary"
                          onClick={addProduct}
                          disabled={
                            !currentProduct.item_id ||
                            !currentProduct.qty ||
                            !currentProduct.price
                          }
                        >
                          Add
                        </Button>
                      </Col>
                    </Row>

                    {formData.products.length > 0 && (
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Total</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.products.map((product, index) => {
                            const productInfo = products.find(
                              (p) => p.id == product.item_id
                            );
                            const total =
                              product.qty *
                              product.price *
                              (1 - product.discount / 100);

                            return (
                              <tr key={index}>
                                <td>{productInfo?.name || "N/A"}</td>
                                <td>{product.qty}</td>
                                <td>{product.price.toFixed(2)}</td>
                                <td>{product.discount}%</td>
                                <td>{total.toFixed(2)}</td>
                                <td>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeProduct(index)}
                                  >
                                    Remove
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

                <Row className="mb-3">
                  <Col md={{ span: 4, offset: 8 }}>
                    <Card>
                      <Card.Body>
                        <div className="d-flex justify-content-between">
                          <strong>Subtotal:</strong>
                          <span>{formData.purchase_total.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <strong>Discount:</strong>
                          <span>
                            {(
                              formData.purchase_total *
                              (formData.discount / 100)
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <strong>VAT:</strong>
                          <span>
                            {(
                              formData.purchase_total *
                              (formData.vat / 100)
                            ).toFixed(2)}
                          </span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                          <strong>Total:</strong>
                          <span>
                            {(
                              formData.purchase_total -
                              formData.purchase_total *
                                (formData.discount / 100) +
                              formData.purchase_total * (formData.vat / 100)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

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
                    disabled={
                      loading ||
                      formData.products.length === 0 ||
                      !formData.supplier_id ||
                      !formData.warehouse_id
                    }
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
                      "Save Purchase"
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

export default PurchaseRawMaterials;
