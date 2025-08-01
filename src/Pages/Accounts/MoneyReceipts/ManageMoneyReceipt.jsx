import axios from "axios";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
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
import {
  FaEdit,
  FaEye,
  FaFileInvoiceDollar,
  FaPrint,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ManageMoneyReceipts = () => {
  // State management
  const [receipts, setReceipts] = useState([]);
  const [receiptDetails, setReceiptDetails] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [receiptsPerPage] = useState(10);
  const [customers, setCustomers] = useState([]);
  const [company, setCompany] = useState(null);
  const printRef = useRef();

  // Payment method options
  const paymentMethods = [
    { value: "CASH", label: "Cash" },
    { value: "CHECK", label: "Check" },
    { value: "BANK_TRANSFER", label: "Bank Transfer" },
    { value: "CARD", label: "Card" },
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [receiptsRes, customersRes, companyRes, detailsRes] =
          await Promise.all([
            axios.get("/api/moneyreceipt"),
            axios.get("/api/customer"),
            axios.get("/api/company/find/2"),
            axios.get("/api/moneyreceiptdetail"),
          ]);

        setReceipts(receiptsRes.data.money_receipts);
        setReceiptDetails(detailsRes.data.money_receipt_details);
        setCustomers(customersRes.data.customers);
        setCompany(companyRes.data.company);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch product details when receipt details are available
  useEffect(() => {
    if (receiptDetails.length > 0) {
      const fetchProductDetails = async () => {
        const productIds = [
          ...new Set(receiptDetails.map((detail) => detail.product_id)),
        ];
        const productPromises = productIds.map((id) =>
          axios
            .get(`/api/product/find/${id}`)
            .then((res) => ({ id, data: res.data.product }))
            .catch(() => ({ id, data: null }))
        );

        const productResults = await Promise.all(productPromises);
        const productMap = productResults.reduce((acc, { id, data }) => {
          acc[id] = data;
          return acc;
        }, {});

        setProducts(productMap);
      };

      fetchProductDetails();
    }
  }, [receiptDetails]);

  // Filter receipts based on search term
  const filteredReceipts = receipts.filter((receipt) => {
    const searchString = searchTerm.toLowerCase();
    return (
      receipt.id.toString().includes(searchString) ||
      receipt.customer_id.toString().includes(searchString) ||
      receipt.receipt_total.toString().includes(searchString) ||
      receipt.remark.toLowerCase().includes(searchString)
    );
  });

  // Get details for a specific receipt
  const getReceiptDetails = (receiptId) => {
    return receiptDetails.filter(
      (detail) => detail.money_receipt_id == receiptId
    );
  };

  // Get product name by ID
  const getProductName = (productId) => {
    return products[productId]?.name || `Product #${productId}`;
  };

  // Pagination logic
  const indexOfLastReceipt = currentPage * receiptsPerPage;
  const indexOfFirstReceipt = indexOfLastReceipt - receiptsPerPage;
  const currentReceipts = filteredReceipts.slice(
    indexOfFirstReceipt,
    indexOfLastReceipt
  );
  const totalPages = Math.ceil(filteredReceipts.length / receiptsPerPage);

  // View receipt details
  const handleView = (receipt) => {
    setSelectedReceipt(receipt);
    setShowViewModal(true);
  };

  // Print receipt
  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
    <html>
      <head>
        <title>Money Receipt - MR-${selectedReceipt.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          .receipt-header {
            text-align: center;
            margin-bottom: 20px;
          }
          .company-logo {
            max-width: 150px;
            margin-bottom: 10px;
          }
          .receipt-title {
            color: #961f50;
            margin-bottom: 10px;
          }
          .receipt-details {
            margin-bottom: 30px;
          }
          .receipt-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .receipt-table th, .receipt-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .receipt-table th {
            background-color: #f2f2f2;
          }
          .text-right {
            text-align: right;
          }
          .signature {
            margin-top: 50px;
            text-align: center;
          }
          @media print {
            body {
              padding: 20px;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-header">
          ${
            company?.logo
              ? `<img src="http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/img/${company.logo}" class="company-logo" alt="${company.name}">`
              : ""
          }
          <h2 class="receipt-title">${company?.name || "Company Name"}</h2>
          <p>${company?.street_address || ""}, ${company?.city || ""}</p>
          <h3>MONEY RECEIPT</h3>
        </div>

        <div class="receipt-details">
          <table>
            <tr>
              <td><strong>Receipt #:</strong> MR-${selectedReceipt.id}</td>
              <td><strong>Date:</strong> ${formatDate(
                selectedReceipt.created_at
              )}</td>
            </tr>
            <tr>
              <td><strong>Customer:</strong> ${getCustomerName(
                selectedReceipt.customer_id
              )}</td>
              <td><strong>Payment Method:</strong> ${
                paymentMethods.find(
                  (m) => m.value === selectedReceipt.payment_method
                )?.label || "Cash"
              }</td>
            </tr>
          </table>
        </div>

        <table class="receipt-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>MR ID #</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${getReceiptDetails(selectedReceipt.id)
              .map(
                (detail, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${getProductName(detail.product_id)}</td>
                <td>MR-${detail.money_receipt_id}</td>
                <td class="text-right">৳${parseFloat(detail.price).toFixed(
                  2
                )}</td>
              </tr>
            `
              )
              .join("")}
            <tr class="total-row">
              <td colspan="3" class="text-right"><strong>Total:</strong></td>
              <td class="text-right"><strong>৳${parseFloat(
                selectedReceipt.receipt_total
              ).toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="remarks">
          <p><strong>Remarks:</strong> ${
            selectedReceipt.remark || "No remarks provided"
          }</p>
        </div>

        <div class="signature">
          <p>_________________________</p>
          <p>Authorized Signature</p>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 500);
          };
        </script>
      </body>
    </html>
  `);
    printWindow.document.close();
  };

  // Edit receipt
  const handleEdit = (receipt) => {
    setSelectedReceipt(receipt);
    setShowEditModal(true);
  };

  // Save edited receipt
  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `/api/moneyreceipt/${selectedReceipt.id}`,
        selectedReceipt
      );
      setReceipts(
        receipts.map((receipt) =>
          receipt.id === selectedReceipt.id ? selectedReceipt : receipt
        )
      );
      setShowEditModal(false);
      setSuccess("Receipt updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update receipt");
    }
  };

  // Delete receipt confirmation
  const handleDeleteClick = (receipt) => {
    setSelectedReceipt(receipt);
    setShowDeleteModal(true);
  };

  // Confirm delete receipt
  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/moneyreceipt/${selectedReceipt.id}`);
      setReceipts(
        receipts.filter((receipt) => receipt.id !== selectedReceipt.id)
      );
      setShowDeleteModal(false);
      setSuccess("Receipt deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete receipt");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString || dateString === "0000-00-00 00:00:00") return "N/A";
    return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
  };

  // Get customer name by ID
  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id == customerId);
    return customer ? customer.name : `Customer #${customerId}`;
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
          <h3 className="mb-0">Money Receipts Management</h3>
          <Link to="/accounts/money-receipt/manage">
            <Button variant="light" size="sm">
              <FaFileInvoiceDollar className="mr-2" /> Create New Receipt
            </Button>
          </Link>
        </Card.Header>

        <Card.Body>
          {/* Search and Filters */}
          <div className="mb-4">
            <Row className="d-flex justify-content-between align-items-center">
              <Col md={6}>
                <InputGroup className="d-flex align-items-center">
                  <InputGroup.Text className="mr-2">
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by ID, customer, amount..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={6} className="text-right">
                <Badge bg="success" className="fs-4">
                  {filteredReceipts.length} Receipts
                </Badge>
              </Col>
            </Row>
          </div>

          {/* Receipts Table */}
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="table-dark">
                <tr>
                  <th>Receipt #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentReceipts.length > 0 ? (
                  currentReceipts.map((receipt) => (
                    <tr key={receipt.id}>
                      <td>MR-{receipt.id}</td>
                      <td>{getCustomerName(receipt.customer_id)}</td>
                      <td>{formatDate(receipt.created_at)}</td>
                      <td className="text-right">
                        ৳{parseFloat(receipt.receipt_total).toFixed(2)}
                      </td>
                      <td>{receipt.remark || "N/A"}</td>
                      <td className="text-center">
                        <Button
                          variant="info"
                          size="sm"
                          className="mr-2"
                          onClick={() => handleView(receipt)}
                        >
                          <FaEye />
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          className="mr-2"
                          onClick={() => handleEdit(receipt)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(receipt)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No receipts found matching your criteria
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

      {/* View Receipt Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
        onExited={() => setSelectedReceipt(null)}
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Receipt Details - MR-{selectedReceipt?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReceipt && (
            <div ref={printRef}>
              <Row className="mb-4">
                <Col md={6}>
                  <div className="d-flex align-items-center mb-3">
                    {company?.logo && (
                      <img
                        src={`http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/img/${company.logo}`}
                        alt={company.name}
                        width="80"
                        className="mr-3 rounded-circle"
                      />
                    )}
                    <div>
                      <h4 className="mb-0">
                        {company?.name || "Company Name"}
                      </h4>
                      <p className="mb-0 text-muted">
                        {company?.street_address}, {company?.city}
                      </p>
                      <p className="mb-0 text-muted">
                        Tax ID: {company?.tax_id || "N/A"}
                      </p>
                    </div>
                  </div>
                </Col>
                <Col md={6} className="text-right">
                  <h3 className="text-primary">MONEY RECEIPT</h3>
                  <p className="mb-1">
                    <strong>Receipt #:</strong> MR-{selectedReceipt.id}
                  </p>
                  <p className="mb-1">
                    <strong>Date:</strong>{" "}
                    {formatDate(selectedReceipt.created_at)}
                  </p>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header className="bg-light">
                      <strong>Received From</strong>
                    </Card.Header>
                    <Card.Body>
                      <p className="mb-1">
                        <strong>
                          {getCustomerName(selectedReceipt.customer_id)}
                        </strong>
                      </p>
                      {/* Add customer details if available */}
                      <p className="mb-1 text-muted">Customer Address Line 1</p>
                      <p className="mb-0 text-muted">Phone: Customer Phone</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Header className="bg-light">
                      <strong>Payment Information</strong>
                    </Card.Header>
                    <Card.Body>
                      <Table borderless size="sm" className="mb-0">
                        <tbody>
                          <tr>
                            <td>
                              <strong>Amount Received:</strong>
                            </td>
                            <td className="text-right">
                              ৳
                              {parseFloat(
                                selectedReceipt.receipt_total
                              ).toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Payment Method:</strong>
                            </td>
                            <td className="text-right">
                              {paymentMethods.find(
                                (m) =>
                                  m.value === selectedReceipt.payment_method
                              )?.label || "Cash"}
                            </td>
                          </tr>
                          <tr className="border-top">
                            <td>
                              <strong>Total Received:</strong>
                            </td>
                            <td className="text-right">
                              <strong>
                                ৳
                                {parseFloat(
                                  selectedReceipt.receipt_total
                                ).toFixed(2)}
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Receipt Details Table */}
              <Card className="mb-3">
                <Card.Header className="bg-light">
                  <strong>Payment Details</strong>
                </Card.Header>
                <Card.Body>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>MR ID #</th>
                        <th className="text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getReceiptDetails(selectedReceipt.id).map(
                        (detail, index) => (
                          <tr key={detail.id}>
                            <td>{index + 1}</td>
                            <td>{getProductName(detail.product_id)}</td>
                            <td>MR-{detail.money_receipt_id}</td>
                            <td className="text-right">
                              ৳{parseFloat(detail.price).toFixed(2)}
                            </td>
                          </tr>
                        )
                      )}
                      <tr className="fw-bold">
                        <td colSpan="3" className="text-right">
                          Total:
                        </td>
                        <td className="text-right">
                          ৳
                          {parseFloat(selectedReceipt.receipt_total).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header className="bg-light">
                  <strong>Remarks</strong>
                </Card.Header>
                <Card.Body>
                  <p>{selectedReceipt.remark || "No remarks provided"}</p>
                </Card.Body>
              </Card>

              <div className="text-center mt-4">
                <p className="mb-1">Thank you for your payment!</p>
                <p className="text-muted">
                  If you have any questions about this receipt, please contact
                  <br />
                  {company?.email || "support@company.com"} | Phone:{" "}
                  {company?.mobile || "+880 XXXX XXXXXX"}
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            <FaPrint className="mr-2" /> Print Receipt
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Receipt Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Edit Receipt - MR-{selectedReceipt?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReceipt && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Customer</Form.Label>
                    <Form.Select
                      value={selectedReceipt.customer_id}
                      onChange={(e) =>
                        setSelectedReceipt({
                          ...selectedReceipt,
                          customer_id: e.target.value,
                        })
                      }
                    >
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Select
                      value={selectedReceipt.payment_method || "CASH"}
                      onChange={(e) =>
                        setSelectedReceipt({
                          ...selectedReceipt,
                          payment_method: e.target.value,
                        })
                      }
                    >
                      {paymentMethods.map((method) => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Receipt Date</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={selectedReceipt.created_at
                        .replace(" ", "T")
                        .slice(0, 16)}
                      onChange={(e) =>
                        setSelectedReceipt({
                          ...selectedReceipt,
                          created_at: e.target.value.replace("T", " ") + ":00",
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={selectedReceipt.receipt_total}
                      onChange={(e) =>
                        setSelectedReceipt({
                          ...selectedReceipt,
                          receipt_total: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={selectedReceipt.remark}
                  onChange={(e) =>
                    setSelectedReceipt({
                      ...selectedReceipt,
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
          {selectedReceipt && (
            <p>
              Are you sure you want to delete Receipt MR-{selectedReceipt.id}{" "}
              for {getCustomerName(selectedReceipt.customer_id)}?
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
            Delete Receipt
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageMoneyReceipts;
