import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/ErrorPage/ErrorPage.jsx";
import Home from "./components/Home/Home.jsx";
import EditProduct from "./components/Products/EditPruduct.jsx";
import ProductDetails from "./components/Products/ProductDetails.jsx";
import Products from "./components/Products/Products.jsx";
import Statistics from "./components/Statistics/Statistics.jsx";
import "./index.css";
import Layout from "./layouts/Layout.jsx";
import CreateInvoice from "./Pages/Accounts/Invoices/CreateInvoice.jsx";
import EditInvoice from "./Pages/Accounts/Invoices/EditInvoice.jsx";
import ManageInvoices from "./Pages/Accounts/Invoices/ManageInvoices.jsx";
import ViewInvoice from "./Pages/Accounts/Invoices/ViewInvoice.jsx";
import CreateDelivery from "./Pages/Delivery/CreateDelivery.jsx";
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
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
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
          path: "products",
          element: <Products />,
        },
        {
          path: "product/detail",
          element: <ProductDetails />,
        },
        {
          path: "product/edit",
          element: <EditProduct />,
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
          path: "accounts/invoice/details/:id",
          element: <ViewInvoice />,
        },
        {
          path: "accounts/invoice/edit/:id",
          element: <EditInvoice />,
        },
      ],
    },
  ],
  {
    basename: "/Projects/React/clinic-os/", // Add basename here
  }
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
);
