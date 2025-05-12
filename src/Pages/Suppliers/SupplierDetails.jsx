import React from "react";
import { Link, useLocation } from "react-router-dom";

function SupplierDetails() {
  const location = useLocation();
  // const navigate = useNavigate();
  const supplier = location.state;
  console.log(supplier);

  

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
                  <a href="/suppliers">Products</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {supplier.name}
                </li>
              </ol>
            </nav>
            <h1 className="h2 mb-0">{supplier.name}</h1>
          </div>
          <div className="d-flex gap-2">
            <Link
              to='/suppliers'
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
                src={`http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/img/${supplier.photo}`}
                className="card-img-top p-4"
                alt={supplier.name}
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="col-md-7">
            <div
              style={{ borderRadius: "10px" }}
              className="card shadow-sm h-100"
            >
              <div className="card-body">
                <h1 className="card-title">{supplier.name}</h1>
                <p className="text-muted">Barcode: {supplier.mobile}</p>

                <div className="d-flex align-items-center mb-3">
                  <h2 className="text-danger me-3">{supplier.email}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SupplierDetails;
