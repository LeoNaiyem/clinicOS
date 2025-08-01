import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
    Alert,
    Badge,
    Card,
    Col,
    Container,
    Row,
    Spinner,
    Table,
} from "react-bootstrap";
import {
    FaBoxes,
    FaClipboardList,
    FaMoneyBillWave,
    FaUsers
} from "react-icons/fa";

const DashboardSummary = () => {
  // State management
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("today");

  // API base URL
  const API_BASE =
    "http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/api";

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE}/dashboard/summary?range=${timeRange}`
        );
        setSummaryData(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard data"
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

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

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-iteml-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Time Range Selector */}
      <div className="d-flex justify-content-end mb-4">
        <div className="btn-group">
          <button
            className={`btn btn-sm ${
              timeRange === "today" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setTimeRange("today")}
          >
            Today
          </button>
          <button
            className={`btn btn-sm ${
              timeRange === "week" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setTimeRange("week")}
          >
            This Week
          </button>
          <button
            className={`btn btn-sm ${
              timeRange === "month" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setTimeRange("month")}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-iteml-center">
                <div>
                  <h6 className="text-muted mb-2">Total Orders</h6>
                  <h3 className="mb-0">{summaryData?.orders?.total || 0}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <FaClipboardList className="text-light" size={24} />
                </div>
              </div>
              <div className="mt-3">
                <span
                  className={`badge ${
                    summaryData?.orders?.change >= 0
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {summaryData?.orders?.change >= 0 ? "+" : ""}
                  {summaryData?.orders?.change || 0}%
                </span>
                <span className="text-muted ml-2">vs previous period</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-iteml-center">
                <div>
                  <h6 className="text-muted mb-2">Revenue</h6>
                  <h3 className="mb-0">
                    {formatCurrency(summaryData?.revenue?.total || 0)}
                  </h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <FaMoneyBillWave className="text-light" size={24} />
                </div>
              </div>
              <div className="mt-3">
                <span
                  className={`badge ${
                    summaryData?.revenue?.change >= 0
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {summaryData?.revenue?.change >= 0 ? "+" : ""}
                  {summaryData?.revenue?.change || 0}%
                </span>
                <span className="text-muted ml-2">vs previous period</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-iteml-center">
                <div>
                  <h6 className="text-muted mb-2">Inventory</h6>
                  <h3 className="mb-0">{summaryData?.inventory?.total || 0}</h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <FaBoxes className="text-light" size={24} />
                </div>
              </div>
              <div className="mt-3">
                <span
                  className={`badge ${
                    summaryData?.inventory?.change >= 0
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {summaryData?.inventory?.change >= 0 ? "+" : ""}
                  {summaryData?.inventory?.change || 0}%
                </span>
                <span className="text-muted ml-2">vs previous period</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-iteml-center">
                <div>
                  <h6 className="text-muted mb-2">Customers</h6>
                  <h3 className="mb-0">{summaryData?.customers?.total || 0}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <FaUsers className="text-light" size={24} />
                </div>
              </div>
              <div className="mt-3">
                <span
                  className={`badge ${
                    summaryData?.customers?.change >= 0
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {summaryData?.customers?.change >= 0 ? "+" : ""}
                  {summaryData?.customers?.change || 0}%
                </span>
                <span className="text-muted ml-2">vs previous period</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts and Detailed Sections */}
      <Row>
        {/* Recent Orders */}
        <Col lg={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-light d-flex justify-content-between align-iteml-center">
              <h5 className="mb-0">Recent Orders</h5>
              <Badge bg="primary">
                {summaryData?.recentOrders?.length || 0} orders
              </Badge>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryData?.recentOrders?.map((order) => (
                      <tr key={order.id}>
                        <td>ORD-{order.id}</td>
                        <td>{order.customer_name}</td>
                        <td>{format(new Date(order.order_date), "dd MMM")}</td>
                        <td className="text-end">
                          {formatCurrency(order.total_amount)}
                        </td>
                      </tr>
                    ))}
                    {(!summaryData?.recentOrders ||
                      summaryData.recentOrders.length === 0) && (
                      <tr>
                        <td colSpan="4" className="text-center py-3 text-muted">
                          No recent orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Inventory Status */}
        <Col lg={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-light d-flex justify-content-between align-iteml-center">
              <h5 className="mb-0">Inventory Status</h5>
              <Badge bg="info">
                {summaryData?.inventoryItems?.length || 0} items
              </Badge>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th className="text-end">Stock</th>
                      <th className="text-end">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryData?.inventoryItems?.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td className="text-end">
                          <Badge
                            bg={
                              item.quantity < 50
                                ? "danger"
                                : item.quantity < 100
                                ? "warning"
                                : "success"
                            }
                          >
                            {item.quantity} units
                          </Badge>
                        </td>
                        <td className="text-end">
                          {formatCurrency(item.value)}
                        </td>
                      </tr>
                    ))}
                    {(!summaryData?.inventoryItems ||
                      summaryData.inventoryItems.length === 0) && (
                      <tr>
                        <td colSpan="4" className="text-center py-3 text-muted">
                          No inventory data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Production and Delivery */}
      <Row>
        {/* Production Status */}
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-light d-flex justify-content-between align-iteml-center">
              <h5 className="mb-0">Production Status</h5>
              <Badge bg="secondary">
                {summaryData?.production?.total || 0} batches
              </Badge>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <h6 className="text-muted">Completed</h6>
                  <h4>{summaryData?.production?.completed || 0}</h4>
                </div>
                <div>
                  <h6 className="text-muted">In Progress</h6>
                  <h4>{summaryData?.production?.in_progress || 0}</h4>
                </div>
                <div>
                  <h6 className="text-muted">Delayed</h6>
                  <h4>{summaryData?.production?.delayed || 0}</h4>
                </div>
              </div>
              <div className="progress" style={{ height: "10px" }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{
                    width: `${summaryData?.production?.completion_rate || 0}%`,
                  }}
                  aria-valuenow={summaryData?.production?.completion_rate || 0}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="mt-2 text-muted text-center">
                Overall completion:{" "}
                {summaryData?.production?.completion_rate || 0}%
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Deliveries */}
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-light d-flex justify-content-between align-iteml-center">
              <h5 className="mb-0">Recent Deliveries</h5>
              <Badge bg="success">
                {summaryData?.recentDeliveries?.length || 0} shipments
              </Badge>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Delivery #</th>
                      <th>Order #</th>
                      <th>Date</th>
                      <th className="text-end">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryData?.recentDeliveries?.map((delivery) => (
                      <tr key={delivery.id}>
                        <td>DLV-{delivery.id}</td>
                        <td>ORD-{delivery.order_id}</td>
                        <td>
                          {format(new Date(delivery.delivery_date), "dd MMM")}
                        </td>
                        <td className="text-end">
                          <Badge
                            bg={
                              delivery.status === "completed"
                                ? "success"
                                : delivery.status === "in_transit"
                                ? "warning"
                                : "danger"
                            }
                          >
                            {delivery.status.replace("_", " ")}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {(!summaryData?.recentDeliveries ||
                      summaryData.recentDeliveries.length === 0) && (
                      <tr>
                        <td colSpan="4" className="text-center py-3 text-muted">
                          No recent deliveries found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardSummary;
