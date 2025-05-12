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
    Pagination,
    Row,
    Spinner,
    Table,
} from "react-bootstrap";
import { FaEdit, FaEye, FaFilter, FaSearch, FaTrash } from "react-icons/fa";

const ManageOrders = () => {
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  // Status options
  const statusOptions = [
    { id: "1", name: "Pending", variant: "warning" },
    { id: "2", name: "Processing", variant: "info" },
    { id: "3", name: "Completed", variant: "success" },
    { id: "4", name: "Cancelled", variant: "danger" },
  ];

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/order");
        setOrders(response.data.orders);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter and search orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchTerm.toLowerCase()) ||
      order.customer_id.toString().includes(searchTerm.toLowerCase()) ||
      order.order_total.toString().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status_id === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // View order details
  const handleView = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  // Edit order
  const handleEdit = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  // Save edited order
  const handleSaveEdit = async () => {
    try {
      await axios.put(`/api/order/${selectedOrder.id}`, selectedOrder);
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id ? selectedOrder : order
        )
      );
      setShowEditModal(false);
      setSuccess("Order updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order");
    }
  };

  // Delete order confirmation
  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  // Confirm delete order
  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/order/${selectedOrder.id}`);
      setOrders(orders.filter((order) => order.id !== selectedOrder.id));
      setShowDeleteModal(false);
      setSuccess("Order deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete order");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString || dateString === "0000-00-00 00:00:00") return "N/A";
    return format(new Date(dateString), "dd MMM yyyy");
  };

  // Get status badge
  const getStatusBadge = (statusId) => {
    const status = statusOptions.find((s) => s.id === statusId);
    return (
      <Badge bg={status?.variant || "secondary"}>
        {status?.name || "Unknown"}
      </Badge>
    );
  };

  if (loading) {
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

      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Order Management</h2>
          <Button variant="light" size="sm">
            Create New Order
          </Button>
        </Card.Header>

        <Card.Body>
          {/* Filters and Search */}
          <div className="mb-4">
            <Row>
              <Col md={6}>
                <InputGroup className="d-flex align-items-center">
                  <InputGroup.Text>
                    <FaSearch className="mr-2" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by ID, customer, or amount..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="d-flex align-items-center">
                  <InputGroup.Text>
                    <FaFilter className="mr-2" />
                  </InputGroup.Text>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    {statusOptions.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col md={2} className="text-end">
                <Badge bg="secondary" className="fs-6">
                  {filteredOrders.length} Orders
                </Badge>
              </Col>
            </Row>
          </div>

          {/* Orders Table */}
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="table-dark">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Order Date</th>
                  <th>Delivery Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>Customer #{order.customer_id}</td>
                      <td>{formatDate(order.order_date)}</td>
                      <td>{formatDate(order.delivery_date)}</td>
                      <td className="text-end">
                        ৳{parseFloat(order.order_total).toFixed(2)}
                      </td>
                      <td>{getStatusBadge(order.status_id)}</td>
                      <td className="text-center">
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleView(order)}
                        >
                          <FaEye />
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(order)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(order)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No orders found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                />

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Pagination.Item
                      key={pageNum}
                      active={pageNum === currentPage}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Pagination.Item>
                  );
                })}

                <Pagination.Next
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* View Order Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <h5>Order Information</h5>
                  <Table borderless size="sm">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Order ID:</strong>
                        </td>
                        <td>#{selectedOrder.id}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Customer ID:</strong>
                        </td>
                        <td>#{selectedOrder.customer_id}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Order Date:</strong>
                        </td>
                        <td>{formatDate(selectedOrder.order_date)}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Delivery Date:</strong>
                        </td>
                        <td>{formatDate(selectedOrder.delivery_date)}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Status:</strong>
                        </td>
                        <td>{getStatusBadge(selectedOrder.status_id)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <h5>Payment Information</h5>
                  <Table borderless size="sm">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Order Total:</strong>
                        </td>
                        <td>
                          ৳{parseFloat(selectedOrder.order_total).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Paid Amount:</strong>
                        </td>
                        <td>
                          ৳{parseFloat(selectedOrder.paid_amount).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Due Amount:</strong>
                        </td>
                        <td>
                          ৳
                          {(
                            parseFloat(selectedOrder.order_total) -
                            parseFloat(selectedOrder.paid_amount)
                          ).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>VAT:</strong>
                        </td>
                        <td>৳{parseFloat(selectedOrder.vat).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Discount:</strong>
                        </td>
                        <td>
                          ৳{parseFloat(selectedOrder.discount).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>

              <h5>Shipping Information</h5>
              <p>
                {selectedOrder.shipping_address ||
                  "No shipping address provided"}
              </p>

              <h5>Remarks</h5>
              <p>{selectedOrder.remark || "No remarks"}</p>

              <h5>Order Items</h5>
              <Alert variant="info">
                Order items would be displayed here from a separate API call
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Order Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Edit Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Order Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={selectedOrder.order_date.split(" ")[0]}
                      onChange={(e) =>
                        setSelectedOrder({
                          ...selectedOrder,
                          order_date: `${e.target.value} 00:00:00`,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Delivery Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={selectedOrder.delivery_date.split(" ")[0]}
                      onChange={(e) =>
                        setSelectedOrder({
                          ...selectedOrder,
                          delivery_date: `${e.target.value} 00:00:00`,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={selectedOrder.status_id}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      status_id: e.target.value,
                    })
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Shipping Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={selectedOrder.shipping_address}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      shipping_address: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={selectedOrder.remark}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      remark: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <p>
              Are you sure you want to delete Order #{selectedOrder.id} for
              Customer #{selectedOrder.customer_id}?
              <br />
              <strong>This action cannot be undone.</strong>
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Order
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageOrders;
