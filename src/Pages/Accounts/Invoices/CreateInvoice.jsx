import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Col,
    Container,
    Form,
    InputGroup,
    Row,
    Spinner,
    Table,
} from "react-bootstrap";
import { FaFileInvoice, FaPlus, FaTrash } from "react-icons/fa";

const CreateInvoice = () => {
  // State management
  const [company, setCompany] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({
    id: "",
    price: "",
    quantity: 1,
    name: "",
  });
  const [loading, setLoading] = useState({
    company: true,
    customers: true,
    products: true,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [invoiceSummary, setInvoiceSummary] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
    due: 0,
  });

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
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load initial data");
      }
    };

    fetchData();
  }, []);

  // Handle product selection
  const handleProductChange = (e) => {
    const productId = e.target.value;
    const product = products.find((p) => p.id == productId);
    if (product) {
      setSelectedProduct({
        id: productId,
        price: product.offer_price,
        quantity: 1,
        name: product.name,
      });
    } else {
      setSelectedProduct({
        id: "",
        price: "",
        quantity: 1,
        name: "",
      });
    }
  };

  // Add item to invoice
  const addItemToInvoice = () => {
    if (!selectedProduct.id || !selectedCustomer) {
      setError("Please select a product and customer");
      return;
    }

    const newItem = {
      id: invoiceItems.length + 1,
      product_id: selectedProduct.id,
      name: selectedProduct.name,
      quantity: parseFloat(selectedProduct.quantity),
      price: parseFloat(selectedProduct.price),
      discount: 0,
      vat: 0,
      lineTotal:
        parseFloat(selectedProduct.quantity) *
        parseFloat(selectedProduct.price),
    };

    setInvoiceItems([...invoiceItems, newItem]);
    updateInvoiceSummary([...invoiceItems, newItem]);
    resetProductForm();
  };

  // Remove item from invoice
  const removeItemFromInvoice = (itemId) => {
    const updatedItems = invoiceItems.filter((item) => item.id !== itemId);
    setInvoiceItems(updatedItems);
    updateInvoiceSummary(updatedItems);
  };

  // Update invoice summary
  const updateInvoiceSummary = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const tax = subtotal * 0.03; // 3% tax
    const total = subtotal + tax;

    setInvoiceSummary({
      subtotal,
      tax,
      total,
      due: total,
    });
  };

  // Reset product form
  const resetProductForm = () => {
    setSelectedProduct({
      id: "",
      price: "",
      quantity: 1,
      name: "",
    });
  };

  // Create invoice
  const createInvoice = async () => {
    if (!selectedCustomer) {
      setError("Please select a customer");
      return;
    }

    if (invoiceItems.length === 0) {
      setError("Please add at least one item to the invoice");
      return;
    }

    try {
      const invoiceData = {
        customer_id: selectedCustomer,
        invoice_date: format(new Date(), "yyyy-MM-dd"),
        payment_term: "CASH",
        remark: "Garment order invoice",
        invoice_total: invoiceSummary.total,
        paid_total: invoiceSummary.total,
        previous_due: 0,
        items: invoiceItems,
      };

      const response = await axios.post("/api/invoice/save", invoiceData);
      console.log(response);

      setSuccess("Invoice created successfully!");
      setInvoiceItems([]);
      setInvoiceSummary({
        subtotal: 0,
        tax: 0,
        total: 0,
        due: 0,
      });
      setSelectedCustomer("");

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create invoice");
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
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
    <Container className="py-4" style={{ maxWidth: "1000px" }}>
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
        <Card.Body>
          {/* Header */}
          <Row className="align-items-center text-center mb-4">
            <Col md={6} className="text-md-start mb-3 mb-md-0">
              {company?.logo && (
                <img
                  src={`http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/img/${company.logo}`}
                  alt={company.name}
                  width="150"
                  style={{ objectFit: "cover", height: "110px" }}
                  className="img-fluid"
                />
              )}
            </Col>
            <Col className="text-md-end">
              <h2 className="mb-3">INVOICE</h2>
              <h5>{company?.name}</h5>
              <p className="text-muted mb-0">
                {company?.street_address}
                <br />
                {company?.area}, {company?.city}
              </p>
            </Col>
          </Row>
          <hr />

          {/* Customer and Invoice Info */}
          <Row className="mb-4">
            <Col md={6}>
              <h6 className="text-muted mb-3">INVOICE TO</h6>
              <Form.Select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="mb-3 p-1"
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </Form.Select>

              {selectedCustomer && (
                <div className="customer-details">
                  <p className="mb-1">1954 Bloor Street West</p>
                  <p className="mb-1">Toronto ON, M6P 3K9</p>
                  <p className="mb-1">Canada</p>
                  <p className="mb-0">
                    <a href={`mailto:${company?.email}`}>{company?.email}</a>
                  </p>
                  <p className="mb-0">
                    <a href={`tel:${company?.mobile}`}>{company?.mobile}</a>
                  </p>
                </div>
              )}
            </Col>

            <Col md={6} className="mt-3 mt-md-0">
              <Table
                borderless
                className="ms-auto"
                style={{ maxWidth: "250px" }}
              >
                <tbody>
                  <tr>
                    <th className="text-end pe-3">Invoice No:</th>
                    <td>INV-{Math.floor(Math.random() * 10000)}</td>
                  </tr>
                  <tr>
                    <th className="text-end pe-3">Invoice Date:</th>
                    <td>{format(new Date(), "dd-MMM-yyyy")}</td>
                  </tr>
                  <tr>
                    <th className="text-end pe-3">Payment Terms:</th>
                    <td>CASH</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

          {/* Invoice Items */}
          <div className="table-responsive mb-4">
            <Table striped bordered hover>
              <thead className="bg-info text-white">
                <tr>
                  <th className="text-white">Products</th>
                  <th className="text-center text-white">Quantity</th>
                  <th className="text-end text-white">Rate</th>
                  <th className="text-end text-white">Amount</th>
                  <th className="text-center text-white">Action</th>
                </tr>
                <tr>
                  <td>
                    <Form.Select
                      value={selectedProduct.id}
                      onChange={handleProductChange}
                      className="p-1"
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      min="1"
                      value={selectedProduct.quantity}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          quantity: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <InputGroup>
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        type="number"
                        min="0"
                        step="0.01"
                        value={selectedProduct.price}
                        onChange={(e) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            price: e.target.value,
                          })
                        }
                      />
                    </InputGroup>
                  </td>
                  <td className="text-end">
                    {selectedProduct.id && (
                      <span>
                        {formatCurrency(
                          selectedProduct.quantity * selectedProduct.price
                        )}
                      </span>
                    )}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="light"
                      className="d-flex justify-content-center align-items-center"
                      size="sm"
                      onClick={addItemToInvoice}
                      disabled={!selectedProduct.id}
                    >
                      <FaPlus />
                    </Button>
                  </td>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.length > 0 ? (
                  invoiceItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <h6 className="mb-0">{item.name}</h6>
                        <small className="text-muted">#{item.product_id}</small>
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">{formatCurrency(item.price)}</td>
                      <td className="text-end">
                        {formatCurrency(item.lineTotal)}
                      </td>
                      <td className="text-center">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeItemFromInvoice(item.id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No items added to invoice
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Invoice Summary */}
          <Row className="justify-content-end">
            <Col xs={12} md={6} lg={4}>
              <Table borderless className="text-end">
                <tbody>
                  <tr>
                    <th className="text-muted pe-3">Subtotal:</th>
                    <td className="fw-bold">
                      {formatCurrency(invoiceSummary.subtotal)}
                    </td>
                  </tr>
                  <tr>
                    <th className="text-muted pe-3">Tax (3%):</th>
                    <td className="fw-bold">
                      {formatCurrency(invoiceSummary.tax)}
                    </td>
                  </tr>
                  <tr className="border-top">
                    <th className="text-muted pe-3">Total:</th>
                    <td className="fw-bold">
                      {formatCurrency(invoiceSummary.total)}
                    </td>
                  </tr>
                  <tr className="border-top border-2 fw-bolder">
                    <th className="pe-3">Amount Due:</th>
                    <td>{formatCurrency(invoiceSummary.due)}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

          {/* Notes and Actions */}
          <div className="mt-4">
            <p className="text-muted mb-3">
              <strong>Notes: </strong>We really appreciate your business and if
              there's anything else we can do, please let us know!
            </p>

            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                size="lg"
                onClick={createInvoice}
                disabled={invoiceItems.length === 0 || !selectedCustomer}
              >
                <FaFileInvoice className="me-2" /> Create Invoice
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateInvoice;
