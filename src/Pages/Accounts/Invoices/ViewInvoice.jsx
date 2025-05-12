import React from 'react';
import { Container, Card, Table, Button, Row, Col, Badge } from 'react-bootstrap';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

const ViewInvoice = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const invoice = state?.invoice;

  if (!invoice) {
    return (
      <Container className="py-4">
        <Alert variant="danger">Invoice data not found</Alert>
      </Container>
    );
  }

  // Calculate due amount
  const dueAmount = parseFloat(invoice.invoice_total) - parseFloat(invoice.paid_total);

  return (
    <Container className="py-4">
      <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-3">
        <FiArrowLeft className="me-2" /> Back to Invoices
      </Button>

      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Invoice #INV-{invoice.id}</h4>
          <div>
            <Button variant="outline-primary" className="me-2" onClick={() => window.print()}>
              <FiPrinter className="me-2" /> Print
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <h5>Customer Information</h5>
              <p className="mb-1"><strong>Name:</strong> {invoice.customer_name || 'N/A'}</p>
              <p className="mb-1"><strong>Payment Term:</strong> {invoice.payment_term}</p>
            </Col>
            <Col md={6} className="text-md-end">
              <p className="mb-1"><strong>Invoice Date:</strong> {invoice.created_at}</p>
              <p className="mb-1"><strong>Status:</strong> 
                {dueAmount <= 0 ? (
                  <Badge bg="success" className="ms-2">Paid</Badge>
                ) : (
                  <Badge bg="warning" className="ms-2">Pending</Badge>
                )}
              </p>
            </Col>
          </Row>

          <Table striped bordered className="mb-4">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.product_name || 'N/A'}</td>
                  <td>{item.qty}</td>
                  <td>{parseFloat(item.price).toFixed(2)}</td>
                  <td>{parseFloat(item.discount || 0).toFixed(2)}</td>
                  <td>{(item.qty * item.price - (item.discount || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Row>
            <Col md={{ span: 4, offset: 8 }}>
              <Table borderless>
                <tbody>
                  <tr>
                    <td><strong>Subtotal:</strong></td>
                    <td className="text-end">{parseFloat(invoice.invoice_total - (invoice.invoice_total * 0.05)).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td><strong>Tax (5%):</strong></td>
                    <td className="text-end">{(invoice.invoice_total * 0.05).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td><strong>Total:</strong></td>
                    <td className="text-end">{parseFloat(invoice.invoice_total).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td><strong>Paid Amount:</strong></td>
                    <td className="text-end">{parseFloat(invoice.paid_total).toFixed(2)}</td>
                  </tr>
                  <tr className="border-top">
                    <td><strong>Due Amount:</strong></td>
                    <td className="text-end">{dueAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

          {invoice.remark && (
            <Card className="mt-3">
              <Card.Header>Remarks</Card.Header>
              <Card.Body>
                <p>{invoice.remark}</p>
              </Card.Body>
            </Card>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ViewInvoice;