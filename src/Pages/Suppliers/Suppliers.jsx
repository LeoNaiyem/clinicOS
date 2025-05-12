import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Suppliers = () => {
//   const suppliersJSON = useLoaderData();
//   const suppliersObj = JSON.parse(suppliersJSON);
//   const suppliers = suppliersObj.suppliers;
const [suppliers,setSuppliers] =useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
      fetch("/api/supplier")
        .then((res) => res.json())
        .then((data) => setSuppliers(data.suppliers));
    },[suppliers])

   const deleteProduct = async (id) => {
     try {
       const res = await fetch(
         `/api/supplier/delete`,
         {
           method: "DELETE",
           headers: {
             "Content-Type": "application/json",
             Accept: "application/json",
           },
           body: JSON.stringify({ id: id }),
         }
       );

       if (!res.ok) {
         throw new Error("Failed to fetch users");
       }
       const data = await res.json();
       console.log(data);
     } catch (err) {
       console.error("Error:", err.message);
     }
   };
    const handleDelete = (id) => {
      if (confirm("Are you sure?")) {
        deleteProduct(id);
      }
    };
  return (
    <div className="p-4">
      <div className="row">
        <div className="col-lg-12">
          <div className="ibox">
            <div className="ibox-head">
              <div className="ibox-title">Suppliers</div>
              <div className="ibox-tools">
                <a className="ibox-collapse">
                  <i className="fa fa-minus"></i>
                </a>
                <a className="dropdown-toggle" data-toggle="dropdown">
                  <i className="fa fa-ellipsis-v"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-right">
                  <a className="dropdown-item">Price</a>
                  <a className="dropdown-item">Rating</a>
                </div>
              </div>
            </div>
            <div className="ibox-body">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id}>
                      <td>{supplier.id}</td>
                      <td>
                        <img
                          className="rounded-3 object-cover"
                          src={`http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/img/${supplier.photo}`}
                          width="40"
                        />
                      </td>
                      <td>{supplier.name}</td>
                      <td>{supplier.mobile}</td>
                      <td>{supplier.email}</td>
                      <td className="text-center">
                        <button
                          onClick={() =>
                            navigate("/supplier/detail", { state: supplier })
                          }
                          className="btn btn-info"
                        >
                          View
                        </button>
                        <button
                          onClick={() =>
                            navigate("/supplier/edit", { state: supplier })
                          }
                          className="btn btn-primary mx-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(supplier.id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suppliers;
