// import { useEffect, useState } from "react";
// import {
//   Button,
//   Card,
//   Col,
//   Container,
//   Form,
//   Row,
//   Spinner,
//   Table,
// } from "react-bootstrap";
// import { CiShoppingBasket } from "react-icons/ci";
// import {
//   FiFileText,
//   FiPlus,
//   FiPrinter,
//   FiShoppingCart,
//   FiTrash2,
//   FiX,
// } from "react-icons/fi";
// import useApi from "../../../utils/UseApi";
// import {
//   fetchCompanies,
//   fetchSuppliers,
//   fetchWareHouses
// } from "../../../utils/api";
// import "./PurchaseRawMaterials.css";

// const PurchaseRawMaterials = () => {
//   const [products, setProducts] = useState([]);
//   const { data: companies, isLoading, error } = useApi(fetchCompanies);
//   const {
//     data: wH,
//     isLoading: isWhLoading,
//     error: whError,
//   } = useApi(fetchWareHouses);
//   const { data: sP, isSpLoading, spError } = useApi(fetchSuppliers);
//   // const { data: pd, isPdLoading, pdError } = useApi(fetchProducts);

//   const [formData, setFormData] = useState({
//     warehouse: "",
//     supplier: "",
//     purchaseId: "PO-" + Math.floor(1000 + Math.random() * 9000),
//     purchaseDate: new Date().toISOString().split("T")[0],
//     deliveryDate: new Date().toISOString().split("T")[0],
//     shippingAddress: "",
//     remark: "Purchase Of Raw Materials",
//   });

//   const [cartItems, setCartItems] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState({
//     id: "",
//     price: "",
//     quantity: 1,
//     discount: 0,
//   });
//   useEffect(() => {
//     fetch("/api/product")
//       .then((res) => res.json())
//       .then((data) => setProducts(data.products));
//   }, []);
//   if (isLoading || isWhLoading || isSpLoading) {
//     return <Spinner animation="border" variant="primary" />;
//   }
//   if (error || whError || spError) {
//     return <div className="error-alert">Error: {error.message}</div>;
//   }
//   const company = companies.company[1];
//   const warehouses = wH.warehouses;
//   const suppliers = sP.suppliers;
//   // const products = pd.products;

//   // Calculate totals
//   const subtotal = cartItems.reduce(
//     (sum, item) => sum + (item.price * item.quantity - item.discount),
//     0
//   );
//   const tax = subtotal * 0.05;
//   const total = subtotal + tax;

//   // Handlers
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleProductSelect = (e) => {
//     const productId = e.target.value;
//     const product = products.find((p) => p.id == productId);
//     setSelectedProduct((prev) => ({
//       ...prev,
//       id: productId,
//       name: product?.name || "",
//       price: product?.offer_price || "",
//       unit: product?.unit || "",
//     }));
//   };
//   const addToCart = () => {
//     if (!selectedProduct.id || !selectedProduct.price) return;

//     const newItem = {
//       id: selectedProduct.id,
//       name: selectedProduct.name,
//       price: parseFloat(selectedProduct.price),
//       quantity: parseFloat(selectedProduct.quantity) || 1,
//       discount: parseFloat(selectedProduct.discount) || 0,
//       unit: selectedProduct.unit,
//       subtotal:
//         selectedProduct.price * (selectedProduct.quantity || 1) -
//         (selectedProduct.discount || 0),
//     };

//     setCartItems([...cartItems, newItem]);
//     console.log(cartItems);
//     setSelectedProduct({
//       id: "",
//       price: "",
//       quantity: 1,
//       discount: 0,
//       unit: "",
//     });
//   };

//   const removeItem = (index) => {
//     setCartItems(cartItems.filter((_, i) => i !== index));
//   };

//   const processOrder = async () => {
//     alert("Are you Sure?");
//     try {
//       const data = {
//         purchase_date: formData.purchaseDate,
//         delivery_date: formData.deliveryDate,
//         products: cartItems,
//         supplier_id: formData.supplier,
//         shipping_address: formData.shippingAddress,
//         purchase_total: total,
//         remark: formData.remark,
//         discount: 0,
//         vat: tax,
//       };
//       const res = await fetch("/api/purchase/save", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });
//       if (!res.ok) {
//         throw new Error("HTTP error status:", res.status);
//       }
//       const result = await res.json();
//       console.log(result);

//       console.log(data);
//       // Reset form
//       setFormData({
//         ...formData,
//         shippingAddress: "",
//         remark: "",
//       });
//       setCartItems([]);

//       alert(`Order ${formData.purchaseId} processed successfully!`);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <Container fluid className="py-4">
//       {/* Header Section */}
//       <Card className="mb-4 border-0 shadow-sm">
//         <Card.Body>
//           <Row className="align-items-center">
//             <Col md={8}>
//               <div className="d-flex align-items-center">
//                 <img
//                   src={`http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/img/${company.logo}`}
//                   alt={company.name}
//                   className="me-3 rounded"
//                   style={{
//                     width: "140px",
//                     height: "80px",
//                     objectFit: "cover",
//                   }}
//                 />
//                 <div>
//                   <h2 className="mb-0 text-primary">{company.name}</h2>
//                   <p className="text-muted mb-0">
//                     {company.street_address} <br /> {company.area},{" "}
//                     {company.city} {company.post_code}
//                   </p>
//                 </div>
//               </div>
//             </Col>
//             <Col md={4} className="text-md-end mt-3 mt-md-0">
//               <div className="d-inline-block bg-light p-3 rounded">
//                 <h5
//                   style={{
//                     fontSize: "20px",
//                     color: "#23b7e5",
//                   }}
//                   className="mb-0"
//                 >
//                   Purchase Order
//                 </h5>
//                 <p className="mb-0 text-muted">#{formData.purchaseId}</p>
//                 <p className="mb-0">
//                   <small className="text-muted">
//                     {new Date(formData.purchaseDate).toLocaleDateString(
//                       "en-US",
//                       {
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                       }
//                     )}
//                   </small>
//                 </p>
//               </div>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {/* Form Section */}
//       <Row className="g-4 mb-4">
//         <Col md={4}>
//           <Card className="h-100 border-0 shadow-sm">
//             <Card.Body>
//               <h5
//                 style={{
//                   fontSize: "20px",
//                   color: "#23b7e5",
//                 }}
//                 className="card-title mb-4 d-flex align-items-center"
//               >
//                 <FiShoppingCart className="mr-2" />
//                 Order Information
//               </h5>

//               <Form.Group className="mb-3">
//                 <Form.Label className="mr-2">Warehouse</Form.Label>
//                 <Form.Select
//                   name="warehouse"
//                   className="py-1"
//                   value={formData.warehouse}
//                   onChange={handleInputChange}
//                 >
//                   <option value="">Select warehouse</option>
//                   {warehouses.map((wh) => (
//                     <option key={wh.id} value={wh.id}>
//                       {wh.name}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label className="mr-2">Supplier</Form.Label>
//                 <Form.Select
//                   name="supplier"
//                   className="py-1"
//                   value={formData.supplier}
//                   onChange={handleInputChange}
//                 >
//                   <option value="">Select supplier</option>
//                   {suppliers.map((sup) => (
//                     <option key={sup.id} value={sup.id}>
//                       {sup.name}
//                     </option>
//                   ))}
//                 </Form.Select>
//                 {formData.supplier && (
//                   <div className="mt-2 bg-light p-2 rounded">
//                     <small className="text-muted d-block">
//                       {suppliers.find((s) => s.id == formData.supplier)?.mobile}
//                     </small>
//                     <small className="text-muted">
//                       {suppliers.find((s) => s.id == formData.supplier)?.email}
//                     </small>
//                   </div>
//                 )}
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Shipping Address</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={3}
//                   name="shippingAddress"
//                   value={formData.shippingAddress}
//                   onChange={handleInputChange}
//                 />
//               </Form.Group>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={8}>
//           <Card className="h-100 border-0 shadow-sm">
//             <Card.Body>
//               <h5
//                 style={{
//                   fontSize: "20px",
//                   color: "#23b7e5",
//                 }}
//                 className="card-title mb-4 d-flex align-items-center"
//               >
//                 <FiFileText className="mr-2" />
//                 Order Details
//               </h5>

//               <Row className="g-3">
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Purchase Date</Form.Label>
//                     <Form.Control
//                       type="date"
//                       name="purchaseDate"
//                       value={formData.purchaseDate}
//                       onChange={handleInputChange}
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Delivery Date</Form.Label>
//                     <Form.Control
//                       type="date"
//                       name="deliveryDate"
//                       value={formData.deliveryDate}
//                       onChange={handleInputChange}
//                       min={formData.purchaseDate}
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <div className="mt-4 pt-3 border-top">
//                 <h6 className="mb-3">Add Products</h6>
//                 <Row className="g-2 align-items-end">
//                   <Col md={5}>
//                     <Form.Group>
//                       <Form.Label className="mr-2">Product</Form.Label>
//                       <Form.Select
//                         className="py-1"
//                         value={selectedProduct.id}
//                         onChange={handleProductSelect}
//                       >
//                         <option value="">Select product</option>
//                         {products.map((product) => (
//                           <option key={product.id} value={product.id}>
//                             {product.name} ({product.offer_price}/per{" "}
//                             {product.uom_id})
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
//                   <Col md={2}>
//                     <Form.Group>
//                       <Form.Label>Qty</Form.Label>
//                       <Form.Control
//                         type="number"
//                         min="1"
//                         value={selectedProduct.quantity}
//                         onChange={(e) =>
//                           setSelectedProduct({
//                             ...selectedProduct,
//                             quantity: e.target.value,
//                           })
//                         }
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={2}>
//                     <Form.Group>
//                       <Form.Label>Price</Form.Label>
//                       <Form.Control
//                         type="number"
//                         min="0"
//                         step="0.01"
//                         value={selectedProduct.price}
//                         onChange={(e) =>
//                           setSelectedProduct({
//                             ...selectedProduct,
//                             price: e.target.value,
//                           })
//                         }
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={2}>
//                     <Form.Group>
//                       <Form.Label>Discount</Form.Label>
//                       <Form.Control
//                         type="number"
//                         min="0"
//                         step="0.01"
//                         value={selectedProduct.discount}
//                         onChange={(e) =>
//                           setSelectedProduct({
//                             ...selectedProduct,
//                             discount: e.target.value,
//                           })
//                         }
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={1}>
//                     <Button
//                       variant="primary"
//                       className="w-100"
//                       onClick={addToCart}
//                       disabled={!selectedProduct.id}
//                     >
//                       <FiPlus />
//                     </Button>
//                   </Col>
//                 </Row>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Order Items Table */}
//       <Card className="mb-4 border-0 shadow-sm">
//         <Card.Body>
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h5
//               style={{
//                 fontSize: "20px",
//                 color: "#23b7e5",
//               }}
//               className="mb-0 d-flex align-items-center"
//             >
//               <CiShoppingBasket style={{ fontSize: "25px" }} className="mr-2" />
//               Order Items
//             </h5>
//             {cartItems.length > 0 && (
//               <Button
//                 variant="outline-danger"
//                 size="sm"
//                 onClick={() => setCartItems([])}
//               >
//                 <FiTrash2 className="me-1" /> Clear All
//               </Button>
//             )}
//           </div>

//           {cartItems.length > 0 ? (
//             <div className="table-responsive">
//               <Table hover className="mb-0">
//                 <thead className="table-light">
//                   <tr>
//                     <th width="5%">#</th>
//                     <th width="35%">Product</th>
//                     <th width="12%">Price</th>
//                     <th width="10%">Qty</th>
//                     <th width="12%">Discount</th>
//                     <th width="16%">Subtotal</th>
//                     <th width="10%"></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {cartItems.map((item, index) => (
//                     <tr key={index}>
//                       <td>{index + 1}</td>
//                       <td>
//                         <strong>{item.name}</strong>
//                         <small className="text-muted d-block">
//                           per {item.unit}
//                         </small>
//                       </td>
//                       <td>{item.price.toFixed(2)}</td>
//                       <td>{item.quantity}</td>
//                       <td>{item.discount.toFixed(2)}</td>
//                       <td>
//                         {(item.price * item.quantity - item.discount).toFixed(
//                           2
//                         )}
//                       </td>
//                       <td className="text-end">
//                         <Button
//                           variant="outline-danger"
//                           size="sm"
//                           onClick={() => removeItem(index)}
//                         >
//                           <FiX />
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           ) : (
//             <div className="text-center py-3 bg-light rounded">
//               <FiShoppingCart size={48} className="text-muted mb-3" />
//               <h5
//                 style={{
//                   fontSize: "20px",
//                   color: "#23b7e5",
//                 }}
//               >
//                 Your cart is empty
//               </h5>
//               <p className="text-muted">
//                 Add products to create a purchase order
//               </p>
//             </div>
//           )}
//         </Card.Body>
//       </Card>

//       {/* Order Summary */}
//       <Row className="g-4">
//         <Col md={6}>
//           <Card className="h-100 border-0 shadow-sm">
//             <Card.Body>
//               <h5
//                 style={{
//                   fontSize: "20px",
//                   color: "#23b7e5",
//                 }}
//                 className="card-title mb-3"
//               >
//                 Remarks
//               </h5>
//               <Form.Control
//                 as="textarea"
//                 rows={4}
//                 name="remark"
//                 value={formData.remark}
//                 onChange={handleInputChange}
//                 placeholder="Additional notes or special instructions..."
//               />
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body>
//               <h5
//                 style={{
//                   fontSize: "20px",
//                   color: "#23b7e5",
//                 }}
//                 className="card-title mb-3"
//               >
//                 Order Summary
//               </h5>
//               <Table borderless className="mb-0">
//                 <tbody>
//                   <tr>
//                     <td>
//                       <strong>Subtotal:</strong>
//                     </td>
//                     <td className="text-end">{subtotal.toFixed(2)}</td>
//                   </tr>
//                   <tr>
//                     <td>
//                       <strong>Tax (5%):</strong>
//                     </td>
//                     <td className="text-end">{tax.toFixed(2)}</td>
//                   </tr>
//                   <tr className="border-top">
//                     <td>
//                       <strong>Total:</strong>
//                     </td>
//                     <td className="text-end">
//                       <span className="h5 text-primary">
//                         {total.toFixed(2)}
//                       </span>
//                     </td>
//                   </tr>
//                 </tbody>
//               </Table>

//               <div className="d-flex mt-4 justify-content-around">
//                 <Button
//                   variant="primary"
//                   size="lg"
//                   onClick={processOrder}
//                   disabled={cartItems.length === 0}
//                 >
//                   Process Purchase Order
//                 </Button>
//                 <div className="d-flex ml-2">
//                   <Button
//                     variant="outline-secondary"
//                     className="flex-grow-1 mr-2"
//                   >
//                     <FiPrinter className="mr-2" />
//                     Print
//                   </Button>
//                   <Button variant="outline-primary" className="flex-grow-1">
//                     <FiFileText className="mr-2" />
//                     PDF
//                   </Button>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default PurchaseRawMaterials;
