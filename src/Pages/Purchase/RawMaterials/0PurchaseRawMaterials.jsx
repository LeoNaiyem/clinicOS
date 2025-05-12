// import React, { useEffect, useState } from "react";
// // import "./PurchasePage.css";

// const base_url = "http://localhost/intellect8/api";

// const PurchaseRawMaterials = () => {
//   const [company, setCompany] = useState({});
//   const [warehouses, setWarehouses] = useState([]);
//   const [suppliers, setSuppliers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [selectedSupplier, setSelectedSupplier] = useState(null);

//   const [purchaseId, setPurchaseId] = useState(1);
//   const [purchaseDate, setPurchaseDate] = useState("");
//   const [deliveryDate, setDeliveryDate] = useState("");
//   const [shippingAddress, setShippingAddress] = useState("");
//   const [remark, setRemark] = useState("");

//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [price, setPrice] = useState(0);
//   const [qty, setQty] = useState(1);
//   const [discount, setDiscount] = useState(0);

//   const [cart, setCart] = useState([]);

//   useEffect(() => {
//     // Fetch company
//     fetch(`api/company`)
//       .then((res) => res.json())
//       .then((data) => setCompany(data.company[0]));

//     fetch(`api/warehouse`)
//       .then((res) => res.json())
//       .then((data) => setWarehouses(data.warehouses));

//     fetch(`api/supplier`)
//       .then((res) => res.json())
//       .then((data) => setSuppliers(data.suppliers));

//     fetch(`api/product`)
//       .then((res) => res.json())
//       .then((data) => setProducts(data.products));

//     fetch(`api/purchase`)
//       .then((res) => res.json())
//       .then((data) => {
//         const ids = data.map((p) => p.id);
//         const maxId = Math.max(...ids);
//         setPurchaseId(maxId + 1);
//       });

//     const today = new Date().toISOString().split("T")[0];
//     setPurchaseDate(today);
//     setDeliveryDate(today);
//   }, []);

//   const handleAddToCart = () => {
//     const subtotal = price * qty - discount * qty;
//     const newItem = {
//       item_id: selectedProduct.id,
//       name: selectedProduct.name,
//       price,
//       qty,
//       discount,
//       total_discount: discount * qty,
//       subtotal,
//     };
//     setCart([...cart, newItem]);
//   };

//   const handleDelete = (id) => {
//     setCart(cart.filter((item) => item.item_id !== id));
//   };

//   const clearCart = () => setCart([]);

//   const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
//   const tax = +(subtotal * 0.05).toFixed(2);
//   const netTotal = +(subtotal + tax).toFixed(2);

//   const handleSubmit = () => {
//     const payload = {
//       warehouse_id: document.getElementById("cmbWarehouse").value,
//       supplier_id: document.getElementById("cmbSupplier").value,
//       purchase_date: purchaseDate,
//       delivery_date: deliveryDate,
//       shipping_address: shippingAddress,
//       discount: 0,
//       vat: tax,
//       remark,
//       purchase_total: netTotal,
//       products: cart,
//     };

//     fetch(`api/purchase/save`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     })
//       .then((res) => res.json())
//       .then(() => {
//         alert("Purchase saved successfully");
//         clearCart();
//       });
//   };

//   return (
//     <div className="invoice p-5 mb-3 card my-4">
//       <div className="row">
//         <div className="col-12">
//           <h5>
//             {company.logo && (
//               <img
//                 src={`http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/img/${company.logo}`}
//                 alt="Logo"
//                 width="120"
//                 // style={{ margin: "-30px 0 10px 0", }}
//               />
//             )}
//             <small className="float-right">
//               Date: {new Date().toLocaleDateString()}
//             </small>
//           </h5>
//         </div>
//       </div>

//       <div className="row invoice-info">
//         <div className="col-sm-4">
//           <label>Warehouse</label>
//           <select id="cmbWarehouse">
//             {warehouses.map((w) => (
//               <option key={w.id} value={w.id}>
//                 {w.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="col-sm-4">
//           <label>Supplier</label>
//           <select
//             id="cmbSupplier"
//             onChange={(e) => {
//               const id = e.target.value;
//               fetch(`api/supplier/find?id=${id}`)
//                 .then((res) => res.json())
//                 .then((data) => setSelectedSupplier(data.supplier));
//             }}
//           >
//             {suppliers.map((s) => (
//               <option key={s.id} value={s.id}>
//                 {s.name}
//               </option>
//             ))}
//           </select>
//           {selectedSupplier && (
//             <p id="supplier-info">
//               {selectedSupplier.mobile} <br />
//               {selectedSupplier.email}
//             </p>
//           )}
//           <label>Shipping Address:</label>
//           <textarea
//             value={shippingAddress}
//             onChange={(e) => setShippingAddress(e.target.value)}
//           />
//         </div>

//         <div className="col-sm-4">
//           <table>
//             <tbody>
//               <tr>
//                 <td>Purchase ID:</td>
//                 <td>
//                   <input type="text" value={purchaseId} readOnly />
//                 </td>
//               </tr>
//               <tr>
//                 <td>Purchase Date:</td>
//                 <td>
//                   <input
//                     type="date"
//                     value={purchaseDate}
//                     onChange={(e) => setPurchaseDate(e.target.value)}
//                   />
//                 </td>
//               </tr>
//               <tr>
//                 <td>Delivery Date:</td>
//                 <td>
//                   <input
//                     type="date"
//                     value={deliveryDate}
//                     onChange={(e) => setDeliveryDate(e.target.value)}
//                   />
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="row mt-3">
//         <div className="col-12">
//           <table className="table table-striped">
//             <thead>
//               <tr>
//                 <th>SN</th>
//                 <th>Material</th>
//                 <th>Price</th>
//                 <th>Qty</th>
//                 <th>Discount</th>
//                 <th>Subtotal</th>
//                 <th>
//                   <button onClick={clearCart}>Clear</button>
//                 </th>
//               </tr>
//               <tr>
//                 <td></td>
//                 <td>
//                   <select
//                     onChange={(e) => {
//                       const product = products.find(
//                         (p) => p.id === parseInt(e.target.value)
//                       );
//                       setSelectedProduct(product);
//                       setPrice(product.offer_price);
//                       setQty(1);
//                       setDiscount(0);
//                     }}
//                   >
//                     <option>Select Product</option>
//                     {products.map((p) => (
//                       <option key={p.id} value={p.id}>
//                         {p.name}
//                       </option>
//                     ))}
//                   </select>
//                 </td>
//                 <td>
//                   <input
//                     type="number"
//                     value={price}
//                     onChange={(e) => setPrice(+e.target.value)}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="number"
//                     value={qty}
//                     onChange={(e) => setQty(+e.target.value)}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="number"
//                     value={discount}
//                     onChange={(e) => setDiscount(+e.target.value)}
//                   />
//                 </td>
//                 <td></td>
//                 <td>
//                   <button onClick={handleAddToCart}>+</button>
//                 </td>
//               </tr>
//             </thead>
//             <tbody>
//               {cart.map((item, index) => (
//                 <tr key={item.item_id}>
//                   <td>{index + 1}</td>
//                   <td>{item.name}</td>
//                   <td>{item.price}</td>
//                   <td>{item.qty}</td>
//                   <td>{item.total_discount}</td>
//                   <td>{item.subtotal}</td>
//                   <td>
//                     <button onClick={() => handleDelete(item.item_id)}>
//                       -
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="row">
//         <div className="col-6">
//           <strong>Remark</strong>
//           <textarea
//             value={remark}
//             onChange={(e) => setRemark(e.target.value)}
//           />
//         </div>
//         <div className="col-6">
//           <h6>Amount Summary</h6>
//           <table className="table">
//             <tbody>
//               <tr>
//                 <th>Subtotal:</th>
//                 <td>{subtotal}</td>
//               </tr>
//               <tr>
//                 <th>Tax (5%):</th>
//                 <td>{tax}</td>
//               </tr>
//               <tr>
//                 <th>Total:</th>
//                 <td>{netTotal}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="row no-print">
//         <div className="col-12">
//           <button className="btn btn-default">Print</button>
//           <button
//             className="btn btn-success float-right"
//             onClick={handleSubmit}
//           >
//             Process Purchase
//           </button>
//           <button className="btn btn-primary float-right mx-2">
//             Generate PDF
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PurchaseRawMaterials;
