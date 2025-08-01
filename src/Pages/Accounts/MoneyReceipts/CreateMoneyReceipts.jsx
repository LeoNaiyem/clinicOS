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
import { FaFileInvoiceDollar, FaPlus, FaTrash } from "react-icons/fa";

const CreateMoneyReceipts = () => {
  // State management
  const [company, setCompany] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [receiptItems, setReceiptItems] = useState([]);
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
  const [totalAmount, setTotalAmount] = useState(0);

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

  // Add item to receipt
  const addItemToReceipt = () => {
    if (!selectedProduct.id || !selectedCustomer) {
      setError("Please select a product and customer");
      return;
    }

    const newItem = {
      id: receiptItems.length + 1,
      product_id: selectedProduct.id,
      description: selectedProduct.name,
      quantity: parseFloat(selectedProduct.quantity),
      price: parseFloat(selectedProduct.price),
      amount:
        parseFloat(selectedProduct.quantity) *
        parseFloat(selectedProduct.price),
    };

    const updatedItems = [...receiptItems, newItem];
    setReceiptItems(updatedItems);
    updateTotalAmount(updatedItems);
    resetProductForm();
  };

  // Remove item from receipt
  const removeItemFromReceipt = (itemId) => {
    const updatedItems = receiptItems.filter((item) => item.id !== itemId);
    setReceiptItems(updatedItems);
    updateTotalAmount(updatedItems);
  };

  // Update total amount
  const updateTotalAmount = (items) => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(total);
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

  // Create money receipt
  const createMoneyReceipt = async () => {
    if (!selectedCustomer) {
      setError("Please select a customer");
      return;
    }

    if (receiptItems.length === 0) {
      setError("Please add at least one item to the receipt");
      return;
    }

    try {
      const receiptData = {
        customer_id: selectedCustomer,
        receipt_date: format(new Date(), "yyyy-MM-dd"),
        payment_method: "Cash",
        remark: "Garment purchase receipt",
        receipt_total: totalAmount,
        items: receiptItems,
      };

      await axios.post("/api/moneyreceipt/save", receiptData);

      setSuccess("Money receipt created successfully!");
      setReceiptItems([]);
      setTotalAmount(0);
      setSelectedCustomer("");

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create money receipt");
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
    <Container className="py-4" style={{ maxWidth: "800px" }}>
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
        <Card.Body>
          {/* Header */}
          <div className="text-center mb-4">
            {company?.logo && (
              <img
                src={`http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/img/${company.logo}`}
                alt={company.name}
                width="150"
                height='90'
                className="mb-2"
                style={{objectFit:"cover"}}
              />
            )}
            <h3
              className="mb-2"
              style={{ color: "#961f50", fontWeight: "bold" }}
            >
              {company?.name}
            </h3>
            <p className="mb-1">
              {company?.street_address}, {company?.city}, Bangladesh
            </p>
            <p className="mb-1">
              Phone: {company?.mobile} | Email: {company?.email}
            </p>
            <h4 className="mt-3">MONEY RECEIPT</h4>
          </div>

          {/* Receipt Details */}
          <Row className="mb-4">
            <Col md={6}>
              <div className="d-flex mb-2">
                <strong className="me-2">Receipt No:</strong>
                <span>MR-{Math.floor(Math.random() * 10000)}</span>
              </div>
              <div className="d-flex">
                <strong className="me-2">Date:</strong>
                <span>{format(new Date(), "dd-MMM-yyyy")}</span>
              </div>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Received From:</strong>
                </Form.Label>
                <Form.Select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <div className="d-flex">
                <strong className="me-2">Payment Method:</strong>
                <span>Cash</span>
              </div>
            </Col>
          </Row>

          {/* Receipt Items */}
          <Table bordered className="mb-4">
            <thead>
              <tr className="bg-light">
                <th>Description</th>
                <th>Unit</th>
                <th>Price</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
              <tr>
                <td>
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
                    <InputGroup.Text>৳</InputGroup.Text>
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
                <td className="align-middle">
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
                    variant="primary"
                    size="sm"
                    onClick={addItemToReceipt}
                    disabled={!selectedProduct.id}
                  >
                    <FaPlus />
                  </Button>
                </td>
              </tr>
            </thead>
            <tbody>
              {receiptItems.length > 0 ? (
                receiptItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>{formatCurrency(item.amount)}</td>
                    <td className="text-center">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeItemFromReceipt(item.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No items added to receipt
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Total Amount */}
          <div className="text-end mb-4">
            <h5>
              <strong>Total: </strong>
              {formatCurrency(totalAmount)}
            </h5>
          </div>

          {/* Create Receipt Button */}
          <div className="d-flex justify-content-center">
            <Button
              variant="primary"
              size="lg"
              onClick={createMoneyReceipt}
              disabled={receiptItems.length === 0 || !selectedCustomer}
            >
              <FaFileInvoiceDollar className="me-2" /> Create Money Receipt
            </Button>
          </div>

          {/* Signature */}
          <div className="mt-5 pt-4 text-center">
            <div
              style={{
                width: "200px",
                margin: "0 auto",
                borderTop: "1px solid #000",
                paddingTop: "5px",
              }}
            >
              Customer Signature
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateMoneyReceipts;
