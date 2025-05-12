import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Card,
  Col,
  Form,
  Pagination,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";

const StockBalance = () => {
  const [stockData, setStockData] = useState({
    stocks: [],
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_rows: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    product: "",
    minQty: "",
    maxQty: "",
  });

  const fetchStockBalance = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stock/balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page,
          perpage: stockData.per_page,
          criteria: buildCriteria(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStockData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const buildCriteria = () => {
    let criteria = "";
    if (filters.product) {
      criteria += ` AND p.name LIKE '%${filters.product}%'`;
    }
    if (filters.minQty) {
      criteria += ` AND s.qty >= ${filters.minQty}`;
    }
    if (filters.maxQty) {
      criteria += ` AND s.qty <= ${filters.maxQty}`;
    }
    return criteria;
  };

  useEffect(() => {
    fetchStockBalance();
  }, []);

  const handlePageChange = (page) => {
    fetchStockBalance(page);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchStockBalance(1);
  };

  const handleResetFilters = () => {
    setFilters({
      product: "",
      minQty: "",
      maxQty: "",
    });
    fetchStockBalance(1);
  };

  const getQuantityBadge = (qty) => {
    const quantity = parseInt(qty);
    if (quantity < 50) return <Badge bg="danger">{qty} (Low)</Badge>;
    if (quantity < 100)
      return (
        <Badge bg="warning" text="dark">
          {qty} (Medium)
        </Badge>
      );
    return <Badge bg="success">{qty} (High)</Badge>;
  };

  return (
    <div className="container py-4">
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <h2 className="mb-0">Stock Balance</h2>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" className="mb-4">
              <Alert.Heading>Error Loading Data</Alert.Heading>
              <p>{error}</p>
            </Alert>
          )}

          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Filters</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleFilterSubmit}>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Product Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="product"
                        value={filters.product}
                        onChange={handleFilterChange}
                        placeholder="Search by product"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Min Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        name="minQty"
                        value={filters.minQty}
                        onChange={handleFilterChange}
                        placeholder="Min"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Max Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        name="maxQty"
                        value={filters.maxQty}
                        onChange={handleFilterChange}
                        placeholder="Max"
                      />
                    </Form.Group>
                  </Col>
                  <Col style={{marginTop:"13px"}} md={4} className="d-flex align-items-center">
                    <button
                      type="submit"
                      className="btn btn-primary mr-2"
                      disabled={loading}
                    >
                      {loading ? "Applying..." : "Apply Filters"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleResetFilters}
                      disabled={loading}
                    >
                      Reset
                    </button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2">Loading stock data...</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table striped bordered hover className="mb-4">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Product</th>
                      <th className="text-end">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockData.stocks.length > 0 ? (
                      stockData.stocks.map((stock) => (
                        <tr key={stock.id}>
                          <td>{stock.id}</td>
                          <td>
                            <strong>{stock.product}</strong>
                          </td>
                          <td className="text-end">
                            {getQuantityBadge(stock.qty)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center py-4">
                          <div className="text-muted">
                            No stock data found matching your criteria
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {stockData.total_pages > 1 && (
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-muted">
                    Showing{" "}
                    {(stockData.current_page - 1) * stockData.per_page + 1} to{" "}
                    {Math.min(
                      stockData.current_page * stockData.per_page,
                      stockData.total_rows
                    )}{" "}
                    of {stockData.total_rows} items
                  </div>
                  <Pagination>
                    <Pagination.First
                      onClick={() => handlePageChange(1)}
                      disabled={stockData.current_page === 1}
                    />
                    <Pagination.Prev
                      onClick={() =>
                        handlePageChange(stockData.current_page - 1)
                      }
                      disabled={stockData.current_page === 1}
                    />
                    {Array.from(
                      { length: Math.min(5, stockData.total_pages) },
                      (_, i) => {
                        let pageNum;
                        if (stockData.total_pages <= 5) {
                          pageNum = i + 1;
                        } else if (stockData.current_page <= 3) {
                          pageNum = i + 1;
                        } else if (
                          stockData.current_page >=
                          stockData.total_pages - 2
                        ) {
                          pageNum = stockData.total_pages - 4 + i;
                        } else {
                          pageNum = stockData.current_page - 2 + i;
                        }

                        return (
                          <Pagination.Item
                            key={pageNum}
                            active={pageNum === stockData.current_page}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Pagination.Item>
                        );
                      }
                    )}
                    <Pagination.Next
                      onClick={() =>
                        handlePageChange(stockData.current_page + 1)
                      }
                      disabled={
                        stockData.current_page === stockData.total_pages
                      }
                    />
                    <Pagination.Last
                      onClick={() => handlePageChange(stockData.total_pages)}
                      disabled={
                        stockData.current_page === stockData.total_pages
                      }
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default StockBalance;
