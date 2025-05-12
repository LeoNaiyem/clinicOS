import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Table, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import { FiSave, FiTrash2, FiPlus, FiMinus, FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const EditInvoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  // Initialize form with invoice data or empty state
  const [formData, setFormData] = useState(state?.invoice || {
    customer_id: '',
    payment_term: 'CASH',
    remark: '',
    invoice_date: new Date().toISOString().split('T')[0],
    items: []
  });

  // Fetch customers and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch customers
        const customersRes = await fetch('http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/api/customer');
        if (!customersRes.ok) throw new Error('Failed to fetch customers');
        const customersData = await customersRes.json();
        setCustomers(customersData.customers || []);
        
        // Fetch products
        const productsRes = await fetch('http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/api/product');
        if (!productsRes.ok) throw new Error('Failed to fetch products');
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle item quantity changes
  const handleItemQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = [...formData.items];
    updatedItems[index].qty = parseInt(newQuantity);
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  // Remove item from invoice
  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  // Add new item to invoice
  const [newItem, setNewItem] = useState({
    product_id: '',
    qty: 1,
    price: '',
    discount: 0
  });

  const handleAddItem = (e) => {
    e.preventDefault();
    
    if (!newItem.product_id || !newItem.price) {
      setError('Please select a product and enter price');
      return;
    }

    const product = products.find(p => p.id == newItem.product_id);
    
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          ...newItem,
          product_name: product?.name || 'Unknown Product'
        }
      ]
    });

    setNewItem({
      product_id: '',
      qty: 1,
      price: '',
      discount: 0
    });
  };

  // Calculate totals
  const subtotal = formData.items.reduce((sum, item) => sum + (item.price * item.qty - item.discount), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  // Save invoice
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const invoiceData = {
        ...formData,
        invoice_total: total,
        items: formData.items.map(item => ({
          product_id: item.product_id,
          qty: item.qty,
          price: item.price,
          discount: item.discount || 0
        }))
      };

      const response = await fetch(`http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/api/invoice/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData)
      });

      if (!response.ok) throw new Error('Failed to update invoice');

      setSuccess('Invoice updated successfully');
      setTimeout(() => navigate('/invoices'), 2000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.items) return <Spinner animation="border" className="d-block mx-auto my-5" />;

  return (
    <Container className="py-4">
      <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-3">
        <FiArrowLeft className="me-2" /> Back to Invoices
      </Button>

      <h2 className="mb-4">Edit Invoice #INV-{id}</h2>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="customer">
                  <Form.Label>Customer</Form.Label>
                  <Form.Select
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.mobile}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group controlId="invoiceDate">
                  <Form.Label>Invoice Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="invoice_date"
                    value={formData.invoice_date}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group controlId="paymentTerm">
                  <Form.Label>Payment Term</Form.Label>
                  <Form.Select
                    name="payment_term"
                    value={formData.payment_term}
                    onChange={handleInputChange}
                  >
                    <option value="CASH">Cash</option>
                    <option value="CREDIT">Credit</option>
                    <option value="CARD">Card</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group controlId="remark" className="mb-3">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="remark"
                value={formData.remark}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <h5 className="mb-3">Invoice Items</h5>
            
            {formData.items.length > 0 ? (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Discount</th>
                    <th>Subtotal</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product_name}</td>
                      <td>{item.price.toFixed(2)}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleItemQuantity(index, item.qty - 1)}
                          >
                            <FiMinus />
                          </Button>
                          <span className="mx-2">{item.qty}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleItemQuantity(index, item.qty + 1)}
                          >
                            <FiPlus />
                          </Button>
                        </div>
                      </td>
                      <td>{item.discount.toFixed(2)}</td>
                      <td>{(item.price * item.qty - item.discount).toFixed(2)}</td>
                      <td>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          <FiTrash2 />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="text-end"><strong>Subtotal:</strong></td>
                    <td><strong>{subtotal.toFixed(2)}</strong></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="text-end"><strong>Tax (5%):</strong></td>
                    <td><strong>{tax.toFixed(2)}</strong></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="text-end"><strong>Total:</strong></td>
                    <td><strong>{total.toFixed(2)}</strong></td>
                    <td></td>
                  </tr>
                </tfoot>
              </Table>
            ) : (
              <Alert variant="info">No items added to this invoice</Alert>
            )}

            <h5 className="mt-4 mb-3">Add New Item</h5>
            <Form onSubmit={handleAddItem}>
              <Row className="align-items-end">
                <Col md={5}>
                  <Form.Group controlId="product">
                    <Form.Label>Product</Form.Label>
                    <Form.Select
                      value={newItem.product_id}
                      onChange={(e) => {
                        const productId = e.target.value;
                        const product = products.find(p => p.id == productId);
                        setNewItem({
                          ...newItem,
                          product_id: productId,
                          price: product?.offer_price || product?.regular_price || ''
                        });
                      }}
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {product.code}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={2}>
                  <Form.Group controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                
                <Col md={2}>
                  <Form.Group controlId="quantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={newItem.qty}
                      onChange={(e) => setNewItem({...newItem, qty: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                
                <Col md={2}>
                  <Form.Group controlId="discount">
                    <Form.Label>Discount</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      step="0.01"
                      value={newItem.discount}
                      onChange={(e) => setNewItem({...newItem, discount: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={1}>
                  <Button variant="primary" type="submit" className="w-100">
                    <FiPlus />
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        <div className="d-flex justify-content-end">
          <Button variant="success" type="submit" disabled={loading}>
            <FiSave className="me-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditInvoice;