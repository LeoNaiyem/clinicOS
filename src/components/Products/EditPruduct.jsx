import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function EditProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state;

  const [form, setForm] = useState({
    id: product?.id || "",
    name: product?.name || "",
    offerPrice: product?.offer_price || "",
    regularPrice: product?.regular_price || "",
    des: product?.description || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(form);
    // await fetch(`https://yourapi.com/users/${user.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(form)
    // });
    // navigate('/');
  };

  return (
    <>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-white border-bottom-0">
                <h3 className="mb-0">Edit Product</h3>
                <p className="text-muted mb-0">Update Product details</p>
              </div>

              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* ID Field (hidden if not needed) */}
                  <div className="mb-3" style={{ display: form.id ? 'block' : 'none' }}>
                    <label htmlFor="productId" className="form-label">Product ID</label>
                    <input
                      id="productId"
                      type="text"
                      className="form-control"
                      value={form.id}
                      onChange={(e) => setForm({ ...form, id: e.target.value })}
                      disabled
                    />
                  </div>

                  {/* Name Field */}
                  <div className="mb-3">
                    <label htmlFor="productName" className="form-label">Product Name *</label>
                    <input
                      id="productName"
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div className="mb-3">
                    <label htmlFor="productEmail" className="form-label">Offer Price*</label>
                    <input
                      id="productEmail"
                      type="number"
                      className="form-control"
                      value={form.offerPrice}
                      onChange={(e) => setForm({ ...form, offerPrice: e.target.value })}
                      required
                    />
                  </div>

                  {/* Mobile Field */}
                  <div className="mb-4">
                    <label htmlFor="productMobile" className="form-label">Regular Price</label>
                    <input
                      id="productMobile"
                      type="tel"
                      className="form-control"
                      value={form.regularPrice}
                      onChange={(e) => setForm({ ...form, regularPrice: e.target.value })}
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => window.history.back()}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                    >
                      Update Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProduct;
