import axios from "axios";
import { format } from "date-fns";
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
import { FaPrint, FaSearch, FaTruck } from "react-icons/fa";

const CreateDelivery = () => {
  // State management
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState({
    company: true,
    order: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [deliveryId, setDeliveryId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [shipperId, setShipperId] = useState("1");
  const [shippers, setShippers] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [remark, setRemark] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch company details
        const companyRes = await axios.get("/api/company/find/2");
        setCompany(companyRes.data.company);

        // Fetch shippers
        const shippersRes = await axios.get("/api/shipper");
        setShippers(shippersRes.data.shippers);

        // Generate delivery ID
        // const deliveryIdRes = await axios.get("/api/deliveries/last-id");
        // setDeliveryId(deliveryIdRes.data.lastId + 1);

        setLoading((prev) => ({ ...prev, company: false }));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load initial data");
        setLoading((prev) => ({ ...prev, company: false }));
      }
    };

    fetchInitialData();
  }, []);

  // Fetch order details
  const fetchOrderDetails = async () => {
    if (!orderId) {
      setError("Please enter an order ID");
      return;
    }

    setLoading((prev) => ({ ...prev, order: true }));
    setError(null);

    try {
      const response = await axios.get(
        `/api/delivery/getOrderDetails/${orderId}`
      );
      console.log(response)
      // Calculate order summary
      const subtotal = response.data.products.reduce((sum, item) => {
        return sum + (item.qty * item.price - item.discount);
      }, 0);

      const tax = subtotal * 0.05;
      const total = subtotal + tax;

      setOrderItems(response.data.products);
      setOrderSummary({ subtotal, tax, total });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch order details");
      setOrderItems([]);
      setOrderSummary({ subtotal: 0, tax: 0, total: 0 });
    } finally {
      setLoading((prev) => ({ ...prev, order: false }));
    }
  };

  // Process delivery
  const processDelivery = async () => {
    setLoading((prev) => ({ ...prev, order: true }));

    try {
      const deliveryData = {
        order_id: orderId,
        person_id: 1, // Assuming default person ID
        create_at: deliveryDate,
        shipper_id: shipperId,
        shipped_at: deliveryDate,
        delivery_status_id: 1, // Assuming status "Processing"
        shipping_address: shippingAddress,
        remark: remark,
        products: orderItems,
      };

      await axios.post("/api/delivery/save", deliveryData);

      setSuccess("Delivery processed successfully!");
      setShowConfirmModal(false);

      // Reset form after successful submission
      setTimeout(() => {
        setOrderId("");
        setShippingAddress("");
        setRemark("");
        setOrderItems([]);
        setOrderSummary({ subtotal: 0, tax: 0, total: 0 });
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process delivery");
    } finally {
      setLoading((prev) => ({ ...prev, order: false }));
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    })
      .format(amount)
      .replace("BDT", "৳");
  };

  if (loading.company) {
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
                {company?.logo && (
                  <img
                    src={`http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/img/${company.logo}`}
                    alt={company.name}
                    width="80"
                    className="mr-3 rounded-circle"
                  />
                )}
                <h2 className="mb-0">Create Delivery</h2>
              </div>
            </Col>
            <Col md={6} className="text-end">
              <Badge bg="light" text="dark" className="fs-6">
                Date: {format(new Date(), "dd MMM yyyy")}
              </Badge>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          {/* Company and Order Info */}
          <Row className="mb-4">
            <Col md={4}>
              <Card>
                <Card.Header>From</Card.Header>
                <Card.Body>
                  {company && (
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
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card>
                <Card.Header>Shipping Information</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Shipper</Form.Label>
                    <Form.Select
                      value={shipperId}
                      onChange={(e) => setShipperId(e.target.value)}
                    >
                      {shippers.map((shipper) => (
                        <option key={shipper.id} value={shipper.id}>
                          {shipper.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Shipping Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card>
                <Card.Header>Delivery Details</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Order ID</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="Enter order ID"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={fetchOrderDetails}
                        disabled={!orderId || loading.order}
                      >
                        <FaSearch />
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Delivery ID</Form.Label>
                    <Form.Control type="text" value={deliveryId} readOnly />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Delivery Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Order Items */}
          <Card className="mb-4">
            <Card.Header>Order Items</Card.Header>
            <Card.Body>
              {loading.order ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : orderItems.length > 0 ? (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Qty</th>
                        <th className="text-end">Discount</th>
                        <th className="text-end">Line Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td className="text-end">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="text-end">{item.qty}</td>
                          <td className="text-end">
                            {formatCurrency(item.discount)}
                          </td>
                          <td className="text-end">
                            {formatCurrency(
                              item.qty * item.price - item.discount
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  No order items found. Please enter an order ID and click
                  search.
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Order Summary and Remarks */}
          <Row>
            <Col md={6}>
              <Card>
                <Card.Header>Remarks</Card.Header>
                <Card.Body style={{paddingBottom:'22px'}}>
                  <Form.Control
                    as="textarea"
                    rows={7}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="Any special instructions or notes..."
                  />
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card>
                <Card.Header>Order Summary</Card.Header>
                <Card.Body>
                  <Table borderless>
                    <tbody>
                      <tr>
                        <td>
                          <strong>Subtotal:</strong>
                        </td>
                        <td className="text-end">
                          {formatCurrency(orderSummary.subtotal)}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Tax (5%):</strong>
                        </td>
                        <td className="text-end">
                          {formatCurrency(orderSummary.tax)}
                        </td>
                      </tr>
                      <tr className="table-active">
                        <td>
                          <strong>Total:</strong>
                        </td>
                        <td className="text-end">
                          <strong>{formatCurrency(orderSummary.total)}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Actions */}
          <div className="d-flex justify-content-end mt-4 gap-2">
            <Button className="mr-2" variant="outline-secondary">
              <FaPrint className="mr-1" /> Print
            </Button>

            <Button
              variant="primary"
              onClick={() => setShowConfirmModal(true)}
              disabled={orderItems.length === 0 || loading.order}
            >
              <FaTruck className="mr-1" /> Process Delivery
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Confirm Delivery</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to process this delivery?</p>
          <ul className="mb-0">
            <li>
              Order ID: <strong>{orderId}</strong>
            </li>
            <li>
              Delivery ID: <strong>{deliveryId}</strong>
            </li>
            <li>
              Total Items: <strong>{orderItems.length}</strong>
            </li>
            <li>
              Total Amount:{" "}
              <strong>{formatCurrency(orderSummary.total)}</strong>
            </li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={processDelivery}
            disabled={loading.order}
          >
            {loading.order ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              "Confirm Delivery"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CreateDelivery;
