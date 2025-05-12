import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function EditSupplier() {
  const location = useLocation();
  const navigate = useNavigate();
  const supplier = location.state;

  const [form, setForm] = useState({
    id: supplier?.id || "",
    name: supplier?.name || "",
    email: supplier?.email || "",
    mobile: supplier?.mobile || "",
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
                <h3 className="mb-0">Edit Supplier</h3>
                <p className="text-muted mb-0">Update Supplier details</p>
              </div>

              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* ID Field (hidden if not needed) */}
                  <div className="mb-3" style={{ display: form.id ? 'block' : 'none' }}>
                    <label htmlFor="productId" className="form-label">Supplier ID</label>
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
                    <label htmlFor="productName" className="form-label">Supplier Name *</label>
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
                    <label htmlFor="productEmail" className="form-label">Contact Email *</label>
                    <input
                      id="productEmail"
                      type="email"
                      className="form-control"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                    <div className="form-text">We'll never share your email</div>
                  </div>

                  {/* Mobile Field */}
                  <div className="mb-4">
                    <label htmlFor="productMobile" className="form-label">Contact Number</label>
                    <input
                      id="productMobile"
                      type="tel"
                      className="form-control"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
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
                      Update Supplier
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

export default EditSupplier;
