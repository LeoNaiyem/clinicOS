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
  FormControl,
  InputGroup,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTrash } from "react-icons/fa";

const CreateOrder = () => {
  // State management
  const [company, setCompany] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    orderDate: new Date(),
    dueDate: new Date(),
    shippingAddress: "",
    remark: "",
    discount: 0,
    vat: 0,
    subtotal: 0,
    total: 0,
  });
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({
    id: "",
    price: "",
    quantity: 1,
    discount: 0,
  });
  const [loading, setLoading] = useState({
    company: true,
    customers: true,
    products: true,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch company details
        const companyRes = await axios.get("/api/company/find/2");
        setCompany(companyRes.data.company);
        setLoading((prev) => ({ ...prev, company: false }));

        // Fetch customers
        const customersRes = await axios.get("/api/customer");
        setCustomers(customersRes.data.customers);
        setLoading((prev) => ({ ...prev, customers: false }));

        // Fetch products
        const productsRes = await axios.get("/api/product");
        setProducts(productsRes.data.products);
        setLoading((prev) => ({ ...prev, products: false }));

        // Generate order ID
        // const orderIdRes = await axios.get("/api/orders/last-id");
        // setOrderDetails((prev) => ({
        //   ...prev,
        //   orderId: orderIdRes.data.lastId + 1,
        // }));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load initial data");
      }
    };

    fetchData();
  }, []);

  // Handle customer selection
  const handleCustomerChange = async (e) => {
    const customerId = e.target.value;
    try {
      const res = await axios.get(`/api/customer/find/${customerId}`);
      setSelectedCustomer(res.data.customer);
    } catch (err) {
      setError("Failed to load customer details", err);
    }
  };

  // Handle product selection
  const handleProductChange = async (e) => {
    const productId = e.target.value;
    const product = products.find((p) => p.id == productId);
    if (product) {
      setSelectedProduct((prev) => ({
        ...prev,
        id: productId,
        price: product.offer_price,
        name: product.name,
      }));
    }
  };

  // Add item to cart
  const addToCart = () => {
    if (!selectedProduct.id) {
      setError("Please select a product");
      return;
    }

    const item = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: parseFloat(selectedProduct.price),
      quantity: parseFloat(selectedProduct.quantity),
      discount: parseFloat(selectedProduct.discount),
      totalDiscount:
        parseFloat(selectedProduct.discount) *
        parseFloat(selectedProduct.quantity),
      subtotal:
        parseFloat(selectedProduct.price) *
          parseFloat(selectedProduct.quantity) -
        parseFloat(selectedProduct.discount) *
          parseFloat(selectedProduct.quantity),
    };

    setCartItems([...cartItems, item]);
    updateOrderTotals([...cartItems, item]);
    resetProductForm();
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    updateOrderTotals(updatedCart);
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setOrderDetails((prev) => ({
      ...prev,
      subtotal: 0,
      total: 0,
    }));
  };

  // Update order totals
  const updateOrderTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const vat = subtotal * 0.05; // Assuming 5% VAT
    const total = subtotal + vat;

    setOrderDetails((prev) => ({
      ...prev,
      subtotal,
      vat,
      total,
    }));
  };

  // Reset product form
  const resetProductForm = () => {
    setSelectedProduct({
      id: "",
      price: "",
      quantity: 1,
      discount: 0,
    });
  };

  // Process order
  const processOrder = async () => {
    if (!selectedCustomer) {
      setError("Please select a customer");
      return;
    }

    if (cartItems.length === 0) {
      setError("Please add at least one product to the order");
      return;
    }

    try {
      // Transform cart items to match backend expectations
      const transformedProducts = cartItems.map((item) => ({
        item_id: item.id, // Changed from 'id' to 'item_id'
        qty: item.quantity, // Changed from 'quantity' to 'qty'
        price: item.price,
        discount: item.discount,
        // Add other fields if needed by backend
      }));

      const orderData = {
        customer_id: selectedCustomer.id,
        order_date: orderDetails.orderDate.toISOString().split("T")[0],
        delivery_date: orderDetails.dueDate.toISOString().split("T")[0],
        shipping_address: orderDetails.shippingAddress,
        discount: orderDetails.discount,
        vat: orderDetails.vat,
        remark: orderDetails.remark,
        order_total: orderDetails.total,
        products: transformedProducts, // Use the transformed array
      };

      console.log("Sending order data:", orderData); // Debug log

      const res = await axios.post("/api/order/save", orderData);
      console.log("Order response:", res.data);

      setSuccess("Order processed successfully!");
      clearCart();
      setOrderDetails((prev) => ({
        ...prev,
        remark: "",
        shippingAddress: "",
      }));
    } catch (err) {
      console.error("Order error:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to process order");
    }
  };

  if (loading.company || loading.customers || loading.products) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
          {success}
        </Alert>
      )}

      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <Row className="align-items-center">
            <Col md={6}>
              <div className="d-flex align-items-center">
                <img
                  src={`http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/img/${company.logo}`}
                  alt={company.name}
                  width="80"
                  className="mr-3 rounded-circle"
                />
                <h2 className="mb-0">Create New Order</h2>
              </div>
            </Col>
            <Col md={6} className="text-end">
              <Badge bg="light" text="dark" className="fs-6">
                Date:{" "}
                {new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Badge>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          {/* Company and Customer Info */}
          <Row className="mb-4">
            <Col md={4}>
              <Card>
                <Card.Header>From</Card.Header>
                <Card.Body>
                  <address className="">
                    <strong
                      style={{
                        fontSize: "20px",
                        color: "#3498db",
                        marginBottom: "8px",
                      }}
                    >
                      {company.name}
                    </strong>
                    <br />
                    {company.street_address}, {company.city}
                    <br />
                    <strong>Mobile:</strong> {company.mobile}
                    <br />
                    <strong>Email:</strong> {company.email}
                  </address>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card>
                <Card.Header>Customer</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Select
                      onChange={handleCustomerChange}
                      value={selectedCustomer?.id || ""}
                    >
                      <option value="">Select Customer</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {selectedCustomer && (
                    <div className="customer-info mb-3">
                      <p className="mb-1">
                        <strong>Contact:</strong> {selectedCustomer.mobile}
                      </p>
                      <p className="mb-1">
                        <strong>Email:</strong> {selectedCustomer.email}
                      </p>
                    </div>
                  )}

                  <Form.Group>
                    <Form.Label>Shipping Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={orderDetails.shippingAddress}
                      onChange={(e) =>
                        setOrderDetails((prev) => ({
                          ...prev,
                          shippingAddress: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card>
                <Card.Header>Order Details</Card.Header>
                <Card.Body>
                  <table className="table table-sm">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Order ID:</strong>
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            value={orderDetails.orderId}
                            readOnly
                            size="sm"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Order Date:</strong>
                        </td>
                        <td>
                          <DatePicker
                            selected={orderDetails.orderDate}
                            onChange={(date) =>
                              setOrderDetails((prev) => ({
                                ...prev,
                                orderDate: date,
                              }))
                            }
                            className="form-control form-control-sm"
                            dateFormat="dd-MM-yyyy"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Delivery Date:</strong>
                        </td>
                        <td>
                          <DatePicker
                            selected={orderDetails.dueDate}
                            onChange={(date) =>
                              setOrderDetails((prev) => ({
                                ...prev,
                                dueDate: date,
                              }))
                            }
                            className="form-control form-control-sm"
                            dateFormat="dd-MM-yyyy"
                            minDate={orderDetails.orderDate}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Product Selection and Cart */}
          <Card className="mb-4">
            <Card.Header>Order Items</Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="mr-2">Product</Form.Label>
                    <Form.Select
                      value={selectedProduct.id}
                      onChange={handleProductChange}
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
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>৳</InputGroup.Text>
                      <FormControl
                        type="number"
                        value={selectedProduct.price}
                        onChange={(e) =>
                          setSelectedProduct((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={selectedProduct.quantity}
                      onChange={(e) =>
                        setSelectedProduct((prev) => ({
                          ...prev,
                          quantity: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Discount</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>৳ </InputGroup.Text>
                      <FormControl
                        type="number"
                        min="0"
                        value={selectedProduct.discount}
                        onChange={(e) =>
                          setSelectedProduct((prev) => ({
                            ...prev,
                            discount: e.target.value,
                          }))
                        }
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button
                    variant="primary"
                    onClick={addToCart}
                    disabled={!selectedProduct.id}
                  >
                    Add to Order
                  </Button>
                </Col>
              </Row>

              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th width="5%">#</th>
                      <th>Product</th>
                      <th width="10%">Price</th>
                      <th width="10%">Qty</th>
                      <th width="10%">Discount</th>
                      <th width="15%">Subtotal</th>
                      <th width="5%">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.length > 0 ? (
                      cartItems.map((item, index) => (
                        <tr key={`${item.id}-${index}`}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td className="text-end">
                            ৳ {item.price.toFixed(2)}
                          </td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">
                            ৳ {item.totalDiscount.toFixed(2)}
                          </td>
                          <td className="text-end">
                            ৳ {item.subtotal.toFixed(2)}
                          </td>
                          <td className="text-center">
                            <Button
                              variant="danger"
                              className="d-flex align-items-center"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted py-3">
                          No items added to order
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              <div className="d-flex justify-content-end">
                <Button
                  variant="outline-danger"
                  onClick={clearCart}
                  disabled={cartItems.length === 0}
                >
                  Clear All Items
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Order Summary and Actions */}
          <Row>
            <Col md={6}>
              <Card>
                <Card.Header>Remarks</Card.Header>
                <Card.Body>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={orderDetails.remark}
                    onChange={(e) =>
                      setOrderDetails((prev) => ({
                        ...prev,
                        remark: e.target.value,
                      }))
                    }
                    placeholder="Any special instructions or notes..."
                  />
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card>
                <Card.Header>Order Summary</Card.Header>
                <Card.Body>
                  <Table borderless className="mb-0">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Subtotal:</strong>
                        </td>
                        <td className="text-end">
                          ৳{orderDetails.subtotal.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>VAT (5%):</strong>
                        </td>
                        <td className="text-end">
                          ৳{orderDetails.vat.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="table-active">
                        <td>
                          <strong>Total:</strong>
                        </td>
                        <td className="text-end">
                          <strong>৳{orderDetails.total.toFixed(2)}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </Table>

                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <Button variant="outline-secondary">
                      <i className="bi bi-printer me-2"></i> Print
                    </Button>
                    <Button variant="outline-primary">
                      <i className="bi bi-file-earmark-pdf me-2"></i> Generate
                      PDF
                    </Button>
                    <Button
                      variant="success"
                      onClick={processOrder}
                      disabled={cartItems.length === 0 || !selectedCustomer}
                    >
                      <i className="bi bi-credit-card me-2"></i> Process Order
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateOrder;
