import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./components/Home/Home.jsx";
import Statistics from "./components/Statistics/Statistics.jsx";
import DashboardSummary from "./components/Summary/Summary.jsx";
import "./index.css";
import Layout from "./layouts/Layout.jsx";
import CreateInvoice from "./Pages/Accounts/Invoices/CreateInvoice.jsx";
import ManageInvoices from "./Pages/Accounts/Invoices/ManageInvoices.jsx";
import CreateMoneyReceipts from "./Pages/Accounts/MoneyReceipts/CreateMoneyReceipts.jsx";
import ManageMoneyReceipts from "./Pages/Accounts/MoneyReceipts/ManageMoneyReceipt.jsx";
import CreateDelivery from "./Pages/Delivery/CreateDelivery.jsx";
import CreateBom from "./Pages/Inventory/Bom/CreateBom.jsx";
import ManageBoms from "./Pages/Inventory/Bom/ManageBoms.jsx";
import BuildProduct from "./Pages/Inventory/Products/BuildProduct.jsx";
import EditProduct from "./Pages/Inventory/Products/EditProduct.jsx";
import ManageProducts from "./Pages/Inventory/Products/ManageProducts.jsx";
import ProductDetails from "./Pages/Inventory/Products/ProductDetails.jsx";
import CreateOrder from "./Pages/Order/CreateOrder.jsx";
import ManageOrders from "./Pages/Order/ManageOrders.jsx";
import ManagePurchase from "./Pages/Purchase/ManagePurchase/ManagePurchase.jsx";
import PurchaseRawMaterials from "./Pages/Purchase/RawMaterials/PurchaseRawMaterials.jsx";
import ManageStocks from "./Pages/Stock/ManageStocks.jsx";
import StockBalance from "./Pages/Stock/StockBalance.jsx";
import EditSupplier from "./Pages/Suppliers/EditSupplier.jsx";
import SupplierDetails from "./Pages/Suppliers/SupplierDetails.jsx";
import Suppliers from "./Pages/Suppliers/Suppliers.jsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      // errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: 'summary',
          element: <DashboardSummary />,
        },
        {
          path: "purchase-raw-materials",
          element: <PurchaseRawMaterials />,
        },
        {
          path: "manage-purchase",
          element: <ManagePurchase />,
        },
        {
          path: "stock/manage",
          element: <ManageStocks />,
        },
        {
          path: "stock/balance",
          element: <StockBalance />,
        },
        {
          path: "orders/create",
          element: <CreateOrder />,
        },
        {
          path: "orders/manage",
          element: <ManageOrders />,
        },
        {
          path: "deliveries/create",
          element: <CreateDelivery />,
        },
        {
          path: "deliveries/manage",
          element: <ManageOrders />,
        },
        {
          path: "inventory/products/create",
          element: <BuildProduct />,
        },
        {
          path: "inventory/products/manage",
          element: <ManageProducts />,
        },
        {
          path: "inventory/products/detail",
          element: <ProductDetails />,
        },
        {
          path: "inventory/products/edit",
          element: <EditProduct />,
        },
        {
          path: "inventory/bom/create",
          element: <CreateBom />,
        },
        {
          path: "inventory/bom/manage",
          element: <ManageBoms />,
        },
        {
          path: "statistics",
          element: <Statistics />,
        },
        {
          path: "suppliers",
          element: <Suppliers />,
        },
        {
          path: "supplier/detail",
          element: <SupplierDetails />,
        },
        {
          path: "supplier/edit",
          element: <EditSupplier />,
        },
        {
          path: "accounts/invoice/create",
          element: <CreateInvoice />,
        },
        {
          path: "accounts/invoice/manage",
          element: <ManageInvoices />,
        },
        {
          path: "accounts/money-receipt/create",
          element: <CreateMoneyReceipts />,
        },
        {
          path: "accounts/money-receipt/manage",
          element: <ManageMoneyReceipts />,
        },
      ],
    },
  ],
  
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
    <ToastContainer />
  </StrictMode>
);
