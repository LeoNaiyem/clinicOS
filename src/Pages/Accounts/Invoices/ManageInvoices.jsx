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
  Table
} from "react-bootstrap";
import {
  FaEdit,
  FaEye,
  FaFileInvoice,
  FaPrint,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import './Invoice.css';

const ManageInvoices = () => {
  // State management
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(10);
  const [customers, setCustomers] = useState([]);
  const [company, setCompany] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [invoiceProducts, setInvoiceProducts] = useState([]);
  const [filteredDetails,setFilteredDetails]=useState([]);

  // Payment term options
  const paymentTerms = [
    { value: "CASH", label: "Cash" },
    { value: "CREDIT", label: "Credit" },
    { value: "CARD", label: "Card" },
    { value: "BANK_TRANSFER", label: "Bank Transfer" },
  ];

  // Status options
  const statusOptions = {
    PAID: { variant: "success", label: "Paid" },
    PARTIAL: { variant: "warning", label: "Partial" },
    UNPAID: { variant: "danger", label: "Unpaid" },
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoicesRes, customersRes, companyRes,invoiceDetailsRes] = await Promise.all([
          axios.get("/api/invoice"),
          axios.get("/api/customer"),
          axios.get("/api/company/find/2"),
          axios.get("/api/invoicedetail"),
        ]);

        setInvoices(invoicesRes.data.invoices);
        setCustomers(customersRes.data.customers);
        setCompany(companyRes.data.company);
        setInvoiceDetails(invoiceDetailsRes.data.invoice_details);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter((invoice) => {
    const searchString = searchTerm.toLowerCase();
    return (
      invoice.id.toString().includes(searchString) ||
      invoice.customer_id.toString().includes(searchString) ||
      invoice.invoice_total.toString().includes(searchString) ||
      invoice.payment_term.toLowerCase().includes(searchString)
    );
  });

  // Pagination logic
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

  // View invoice details


  const handleView = async (invoice) => {
    try {
      setLoading(true);

      // Filter invoice details first
      const filtered = invoiceDetails.filter(
        (detail) => detail.invoice_id == invoice.id
      );
      setFilteredDetails(filtered);

      // Then fetch product details for each item
      const productsWithDetails = await Promise.all(
        filtered.map(async (detail) => {
          try {
            const productRes = await axios.get(
              `/api/product/find/${detail.product_id}`
            );
            return {
              ...detail,
              product: productRes.data.product || {},
            };
          } catch (err) {
            console.error(`Failed to fetch product ${detail.product_id}:`, err);
            return {
              ...detail,
              product: { name: "Unknown Product" },
            };
          }
        })
      );

      setSelectedInvoice({
        ...invoice,
        items: productsWithDetails,
      });

      setShowViewModal(true);
    } catch (err) {
      setError("Failed to load invoice details");
      console.error(err);
      setSelectedInvoice(invoice);
      setShowViewModal(true);
    } finally {
      setLoading(false);
    }
  };
  console.log(selectedInvoice)

//Print invoice
  const handlePrintInvoice = (invoiceId) => {
    // Create a new window for printing
    const printWindow = window.open("", "", "width=900,height=1000, top=50, left=300");

    // Get the HTML content to print
    const printContent = document.getElementById(
      "invoice-print-content"
    ).innerHTML;

    // Write the print content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice #${invoiceId}</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            @media print {
              body { padding: 20px; }
              .no-print { display: none !important; }
              table { width: 100%; }
              .table-bordered th, .table-bordered td { border: 1px solid #dee2e6 !important; }
            }
          </style>
        </head>
        <body onload="window.print();">
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  // Edit invoice
  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice);
    setShowEditModal(true);
  };

  // Save edited invoice
  const handleSaveEdit = async () => {
    try {
      await axios.put(`/api/invoice/${selectedInvoice.id}`, selectedInvoice);
      setInvoices(
        invoices.map((invoice) =>
          invoice.id === selectedInvoice.id ? selectedInvoice : invoice
        )
      );
      setShowEditModal(false);
      setSuccess("Invoice updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update invoice");
    }
  };

  // Delete invoice confirmation
  const handleDeleteClick = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDeleteModal(true);
  };

  // Confirm delete invoice
  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/invoice/${selectedInvoice.id}`);
      setInvoices(
        invoices.filter((invoice) => invoice.id !== selectedInvoice.id)
      );
      setShowDeleteModal(false);
      setSuccess("Invoice deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete invoice");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString || dateString === "0000-00-00 00:00:00") return "N/A";
    return format(new Date(dateString), "dd MMM yyyy");
  };

  // Get customer name by ID
  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id == customerId);
    return customer ? customer.name : `Customer #${customerId}`;
  };

  // Get payment status
  const getPaymentStatus = (invoice) => {
    if (parseFloat(invoice.paid_total) >= parseFloat(invoice.invoice_total)) {
      return statusOptions.PAID;
    } else if (parseFloat(invoice.paid_total) > 0) {
      return statusOptions.PARTIAL;
    }
    return statusOptions.UNPAID;
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
  console.log("invoice selected",invoiceProducts.product_id);
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
          <h2 className="mb-0">Invoice Management</h2>
          <Link to="/accounts/invoice/create">
            <Button variant="light" size="sm">
              <FaFileInvoice className="me-2" /> Create New Invoice
            </Button>
          </Link>
        </Card.Header>

        <Card.Body>
          {/* Search and Filters */}
          <div className="mb-4">
            <Row>
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text>
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
                <Badge bg="secondary" className="fs-6">
                  {filteredInvoices.length} Invoices
                </Badge>
              </Col>
            </Row>
          </div>

          {/* Invoices Table */}
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="table-dark">
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Payment Term</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentInvoices.length > 0 ? (
                  currentInvoices.map((invoice) => {
                    const status = getPaymentStatus(invoice);
                    return (
                      <tr key={invoice.id}>
                        <td>INV-{invoice.id}</td>
                        <td>{getCustomerName(invoice.customer_id)}</td>
                        <td>{formatDate(invoice.created_at)}</td>
                        <td className="text-right">
                          ৳{parseFloat(invoice.invoice_total).toFixed(2)}
                        </td>
                        <td>{invoice.payment_term}</td>
                        <td>
                          <Badge bg={status.variant}>{status.label}</Badge>
                        </td>
                        <td className="text-center">
                          <Button
                            variant="info"
                            size="sm"
                            className="me-2"
                            onClick={() => handleView(invoice)}
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(invoice)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(invoice)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No invoices found matching your criteria
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
      {/* View Invoice Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="xl"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Invoice Details - INV-{selectedInvoice?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInvoice && (
            <div id="invoice-print-content">
              {/* Invoice Header */}
              <Row className="mb-4">
                <Col md={6}>
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={`http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/img/${company.logo}`}
                      alt={company.name}
                      width="150"
                      style={{ objectFit: "cover", height: "110px" }}
                      className="img-fluid"
                    />
                    <div>
                      <h4 className="mb-0">{company.name}</h4>
                      <p className="mb-0 text-muted">
                        {company.street_address}, {company.city}
                      </p>
                      <p className="mb-0 text-muted">Tax ID: 123456789</p>
                    </div>
                  </div>
                </Col>
                <Col md={6} className="text-right pr-4">
                  <h3 className="text-primary">INVOICE</h3>
                  <p className="mb-1">
                    <strong>Invoice #:</strong> INV-{selectedInvoice.id}
                  </p>
                  <p className="mb-1">
                    <strong>Date:</strong>{" "}
                    {formatDate(selectedInvoice.created_at)}
                  </p>
                  <p className="mb-1">
                    <strong>Status:</strong>{" "}
                    <Badge bg={getPaymentStatus(selectedInvoice).variant}>
                      {getPaymentStatus(selectedInvoice).label}
                    </Badge>
                  </p>
                </Col>
              </Row>

              {/* Customer and Payment Info */}
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header className="bg-light">
                      <strong>Bill To</strong>
                    </Card.Header>
                    <Card.Body>
                      <p className="mb-1">
                        <strong>
                          {getCustomerName(selectedInvoice.customer_id)}
                        </strong>
                      </p>
                      {/* Add customer address if available */}
                      <p className="mb-1 text-muted">370/Cha, Saudi Colony</p>
                      <p className="mb-1 text-muted">
                        Dhaka Cantonment, Dahaka-1206
                      </p>
                      <p className="mb-0 text-muted">Phone: +8801547896523</p>
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
                              <strong>Subtotal:</strong>
                            </td>
                            <td className="text-right">
                              ৳
                              {parseFloat(
                                selectedInvoice.invoice_total
                              ).toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Discount:</strong>
                            </td>
                            <td className="text-right">৳0.00</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Tax/VAT:</strong>
                            </td>
                            <td className="text-right">৳0.00</td>
                          </tr>
                          <tr className="border-top">
                            <td>
                              <strong>Total:</strong>
                            </td>
                            <td className="text-right">
                              <strong>
                                ৳
                                {parseFloat(
                                  selectedInvoice.invoice_total
                                ).toFixed(2)}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Paid Amount:</strong>
                            </td>
                            <td className="text-right">
                              ৳
                              {parseFloat(selectedInvoice.paid_total).toFixed(
                                2
                              )}
                            </td>
                          </tr>
                          <tr className="border-top">
                            <td>
                              <strong>Due Amount:</strong>
                            </td>
                            <td className="text-right">
                              <strong>
                                ৳
                                {(
                                  parseFloat(selectedInvoice.invoice_total) -
                                  parseFloat(selectedInvoice.paid_total)
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

              {/* Invoice Items Table */}
              <div className="table-responsive mb-4">
                <Table bordered>
                  <thead className="bg-light">
                    <tr>
                      <th width="5%">#</th>
                      <th>Description</th>
                      <th width="10%">Qty</th>
                      <th width="15%">Unit Price</th>
                      <th width="15%">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items &&
                    selectedInvoice.items.length > 0 ? (
                      selectedInvoice.items.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            {item.product?.name || `Product ${item.product_id}`}
                            {item.product?.description && (
                              <div className="text-muted small">
                                {item.product.description}
                              </div>
                            )}
                          </td>
                          <td className="text-center">{item.quantity || 1}</td>
                          <td className="text-right">
                            ৳{parseFloat(item.price || 0).toFixed(2)}
                          </td>
                          <td className="text-right">
                            ৳
                            {(
                              parseFloat(item.price || 0) *
                              parseFloat(item.quantity || 1)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-3 text-muted">
                          No items available for this invoice
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan="4" className="text-right">
                        <strong>Subtotal</strong>
                      </td>
                      <td className="text-right">
                        ৳{parseFloat(selectedInvoice.invoice_total).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="text-right">
                        <strong>Tax/VAT</strong>
                      </td>
                      <td className="text-right">৳0.00</td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="text-right">
                        <strong>Total</strong>
                      </td>
                      <td className="text-right">
                        ৳{parseFloat(selectedInvoice.invoice_total).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              {/* Terms and Conditions */}
              <Card className="mb-3">
                <Card.Header className="bg-light">
                  <strong>Terms & Conditions</strong>
                </Card.Header>
                <Card.Body>
                  <p className="mb-1">1. Payment is due within 15 days</p>
                  <p className="mb-1">
                    2. Please include invoice number with payment
                  </p>
                  <p className="mb-0">3. Late payments are subject to fees</p>
                </Card.Body>
              </Card>

              {/* Footer */}
              <div className="text-center mt-4">
                <p className="mb-1">Thank you for your business!</p>
                <p className="text-muted">
                  If you have any questions about this invoice, please contact
                  <br />
                  {company.email} | Phone: {company.mobile}
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handlePrintInvoice(selectedInvoice.id)}
          >
            <FaPrint className="me-2" /> Print Invoice
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Edit Invoice Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Edit Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInvoice && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Customer</Form.Label>
                    <Form.Select
                      value={selectedInvoice.customer_id}
                      onChange={(e) =>
                        setSelectedInvoice({
                          ...selectedInvoice,
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
                    <Form.Label>Payment Term</Form.Label>
                    <Form.Select
                      value={selectedInvoice.payment_term}
                      onChange={(e) =>
                        setSelectedInvoice({
                          ...selectedInvoice,
                          payment_term: e.target.value,
                        })
                      }
                    >
                      {paymentTerms.map((term) => (
                        <option key={term.value} value={term.value}>
                          {term.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Invoice Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={selectedInvoice.created_at.split(" ")[0]}
                      onChange={(e) =>
                        setSelectedInvoice({
                          ...selectedInvoice,
                          created_at: `${e.target.value} 00:00:00`,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Invoice Total</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={selectedInvoice.invoice_total}
                      onChange={(e) =>
                        setSelectedInvoice({
                          ...selectedInvoice,
                          invoice_total: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Paid Amount</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={selectedInvoice.paid_total}
                  onChange={(e) =>
                    setSelectedInvoice({
                      ...selectedInvoice,
                      paid_total: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={selectedInvoice.remark}
                  onChange={(e) =>
                    setSelectedInvoice({
                      ...selectedInvoice,
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
          {selectedInvoice && (
            <p>
              Are you sure you want to delete Invoice #{selectedInvoice.id} for{" "}
              {getCustomerName(selectedInvoice.customer_id)}?
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
            Delete Invoice
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageInvoices;
