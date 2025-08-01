import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state;
  console.log(product);

  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  // Calculate discount percentage
  const discountPercent =
    product.regular_price > 0
      ? Math.round(
          ((product.regular_price - product.offer_price) /
            product.regular_price) *
            100
        )
      : 0;

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/products">Products</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {product.name}
                </li>
              </ol>
            </nav>
            <h1 className="h2 mb-0">{product.name}</h1>
          </div>
          <div className="d-flex gap-2">
            <Link
              to="/inventory/products/manage"
              className="btn btn-outline-secondary btn-sm mr-2"
            >
              <i className="fa-solid fa-arrow-left mr-1"></i> Back
            </Link>
            <button className="btn btn-outline-primary btn-sm">
              <i className="fa-solid fa-share-nodes"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="container my-5">
        <div className="row">
          {/* Product Image */}
          <div className="col-md-5">
            <div
              style={{ borderRadius: "10px" }}
              className="card shadow-sm h-100"
            >
              <img
                src={`http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/img/${product.photo}`}
                className="card-img-top p-4"
                alt={product.name}
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
              <div className="card-body text-center">
                {product.is_featured === "1" && (
                  <span className="badge bg-success">Featured</span>
                )}
                {product.is_brand === "1" && (
                  <span className="badge bg-warning text-dark ml-2">Brand</span>
                )}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="col-md-7">
            <div
              style={{ borderRadius: "10px" }}
              className="card shadow-sm h-100"
            >
              <div className="card-body">
                <h1 className="card-title">{product.name}</h1>
                <p className="text-muted">Barcode: {product.barcode}</p>

                <div className="d-flex align-items-center mb-3">
                  <h2 className="text-danger me-3">₹{product.offer_price}</h2>
                  {product.regular_price > product.offer_price && (
                    <>
                      <del className="text-muted">₹{product.regular_price}</del>
                      <span className="badge bg-danger ms-2">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <div className="border p-3 rounded">
                      <h6 className="text-muted">Category</h6>
                      <p className="mb-0 fw-bold">
                        Category #{product.product_category_id}
                      </p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="border p-3 rounded">
                      <h6 className="text-muted">Weight</h6>
                      <p className="mb-0 fw-bold">{product.weight || "0"} g</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="border p-3 rounded">
                      <h6 className="text-muted">Product Type</h6>
                      <p className="mb-0 fw-bold">
                        Type #{product.product_type_id}
                      </p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="border p-3 rounded">
                      <h6 className="text-muted">Unit</h6>
                      <p className="mb-0 fw-bold">
                        Unit #{product.product_unit_id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-3 d-md-flex mb-4">
                  <button
                    style={{ marginRight: "10px" }}
                    className="btn btn-primary px-4 me-md-2"
                  >
                    <i className="bi bi-cart-plus me-2"></i>Add to Cart
                  </button>
                  <button className="btn btn-outline-secondary px-4">
                    <i className="bi bi-heart me-2"></i>Wishlist
                  </button>
                </div>

                {/* Additional Details Accordion */}
                <div className="accordion" id="productAccordion">
                  <div className="accordion-item border-0">
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${
                          activeAccordion === "details" ? "" : "collapsed"
                        }`}
                        type="button"
                        onClick={() => toggleAccordion("details")}
                      >
                        More
                      </button>
                    </h2>
                    <div
                      id="productDetails"
                      className={`accordion-collapse collapse ${
                        activeAccordion === "details" ? "show" : ""
                      }`}
                    >
                      <div className="accordion-body">
                        <ul className="list-unstyled">
                          <li className="mb-2">
                            <strong>Manufacturer:</strong> #
                            {product.manufacturer_id}
                          </li>
                          <li className="mb-2">
                            <strong>Section:</strong> #
                            {product.product_section_id}
                          </li>
                          <li className="mb-2">
                            <strong>UOM:</strong> #{product.uom_id}
                          </li>
                          <li className="mb-2">
                            <strong>Created:</strong> {product.created_at}
                          </li>
                          <li className="mb-0">
                            <strong>Updated:</strong> {product.updated_at}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
