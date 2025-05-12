import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ManageStocks = () => {
  const [stocks,setStocks]=useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    fetch("/api/stock")
      .then((res) => res.json())
      .then((data) => setStocks(data.stocks));
  },[stocks])

   const deleteProduct = async (id) => {
     try {
       const res = await fetch(
         `/api/product/delete`,
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
              <div className="ibox-title">All Products</div>
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
                    <th>Product Id</th>
                    <th>Quantity</th>
                    <th>Transaction Type</th>
                    <th>Remarks</th>
                    <th>Warehouse Id</th>
                    <th>Created at</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock) => (
                    <tr key={stock.id}>
                      <td>{stock.id}</td>
                      <td>{stock.product_id}</td>
                      <td>{stock.qty}</td>
                      <td>{stock.transaction_type_id}</td>
                      <td>{stock.warehouse_id}</td>
                      <td>{stock.created_at}</td>
                      <td className="text-center">
                        <button
                          onClick={() =>
                            navigate("/stock/detail", { state: stock })
                          }
                          className="btn btn-info"
                        >
                          View
                        </button>
                        <button
                          onClick={() =>
                            navigate("/stock/edit", { state: stock })
                          }
                          className="btn btn-primary mx-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(stock.id)}
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

export default ManageStocks;
