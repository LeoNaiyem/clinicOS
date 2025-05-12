import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ManagePurchase = () => {
  // const productsJSON = useLoaderData();
  // const productsObj = JSON.parse(productsJSON);
  const [purchases,setPurchases]=useState([]);
  // const products = productsObj.products;
  const navigate = useNavigate();

  useEffect(()=>{
    fetch("/api/purchase")
      .then((res) => res.json())
      .then((data) => setPurchases(data.purchase));
  },[purchases])

   const deleteProduct = async (id) => {
     try {
       const res = await fetch(
         `/api/purchase/delete`,
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
              <div className="ibox-title">All Purchase</div>
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
                    <th>Customer Id</th>
                    <th>Invoice Total</th>
                    <th>Paid</th>
                    <th>Remark</th>
                    <th>Purchase Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => (
                    <tr key={purchase.id}>
                      <td>{purchase.id}</td>
                      <td>{purchase.supplier_id}</td>
                      <td>{purchase.purchase_total}</td>
                      <td>{purchase.paid_amount}</td>
                      <td>{purchase.remark}</td>
                      <td>{purchase.purchase_date}</td>
                      <td className="text-center">
                        <button
                          onClick={() =>
                            navigate("/purchase/detail", { state: purchase })
                          }
                          className="btn btn-info"
                        >
                          View
                        </button>
                        <button
                          onClick={() =>
                            navigate("/purchase/edit", { state: purchase })
                          }
                          className="btn btn-primary mx-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(purchase.id)}
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

export default ManagePurchase;
