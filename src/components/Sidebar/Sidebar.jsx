import { Link } from "react-router-dom";
import adminNaiyem from "../../../public/img/admin-naiyem.jpg";
const Sidebar = () => {
  return (
    <>
      {/* START SIDEBAR */}
      <nav className="page-sidebar" id="sidebar">
        <div id="sidebar-collapse">
          <div className="admin-block d-flex">
            <div>
              <img
                style={{ borderRadius: "50%" }}
                width="45"
                src={adminNaiyem}
              />
            </div>
            <div className="admin-info">
              <div className="font-strong">Naiyem Hossain</div>
              <small>Administrator</small>
            </div>
          </div>
          <ul className="side-menu metismenu">
            <li>
              <a className="active" href="javascript:;">
                <i className="sidebar-item-icon fa fa-th-large"></i>
                <span className="nav-label">Dashboard</span>
                <i className="fa fa-angle-left arrow"></i>
              </a>
              <ul className="nav-2-level collapse">
                <li>
                  <Link to={"/products"} href="colors.html">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to={"/products"}>Summary</Link>
                </li>
              </ul>
            </li>
            <li>
              <a className="active" href="javascript:;">
                <i className="sidebar-item-icon fa-solid fa-money-check-dollar"></i>
                <span className="nav-label">Purchase</span>
                <i className="fa fa-angle-left arrow"></i>
              </a>
              <ul className="nav-2-level collapse">
                <li>
                  <Link to={"/purchase-raw-materials"}>Raw Materials</Link>
                </li>
                <li>
                  <Link to={"/manage-purchase"}>Manage Purchase</Link>
                </li>
              </ul>
            </li>
            <li>
              <a href="javascript:;">
                <i className="sidebar-item-icon fa-solid fa-warehouse"></i>
                <span className="nav-label">Inventory</span>
                <i className="fa fa-angle-left arrow"></i>
              </a>
              <ul className="nav-2-level collapse">
                <li>
                  <Link to={"/products"}>Create BOM</Link>
                </li>
                <li>
                  <Link to={"/products"}>Manage BOM</Link>
                </li>
                <li>
                  <Link to={"/products"}>Build Product</Link>
                </li>
                <li>
                  <Link to={"/products"}>Manage Product</Link>
                </li>
              </ul>
            </li>
            <li>
              <a href="javascript:;">
                <i className="sidebar-item-icon fa-solid fa-cubes-stacked"></i>
                <span className="nav-label">Stock</span>
                <i className="fa fa-angle-left arrow"></i>
              </a>
              <ul className="nav-2-level collapse">
                <li>
                  <Link to={"/products"}>Create Stock</Link>
                </li>
                <li>
                  <Link to={"/stock/manage"}>Manage Stock</Link>
                </li>
                <li>
                  <Link to={"/stock/balance"}>Stock Balance</Link>
                </li>
              </ul>
            </li>

            <li>
              <a href="javascript:;">
                <i className="sidebar-item-icon fa-brands fa-first-order-alt"></i>
                <span className="nav-label">Order</span>
                <i className="fa fa-angle-left arrow"></i>
              </a>
              <ul className="nav-2-level collapse">
                <li>
                  <Link to={"/orders/create"}>Create Order</Link>
                </li>
                <li>
                  <Link to={"/orders/manage"}>Manage Order</Link>
                </li>
              </ul>
            </li>
            <li>
              <a href="javascript:;">
                <i className="sidebar-item-icon fa-solid fa-truck-field"></i>
                <span className="nav-label">Delivery</span>
                <i className="fa fa-angle-left arrow"></i>
              </a>
              <ul className="nav-2-level collapse">
                <li>
                  <Link to={"/deliveries/create"}>Create Delivery</Link>
                </li>
                <li>
                  <Link to={"/deliveries/manage"}>Manage Delivery</Link>
                </li>
              </ul>
            </li>
            <li>
              <a href="javascript:;">
                <i className="sidebar-item-icon fa-solid fa-calculator"></i>
                <span className="nav-label">Accounts</span>
                <i className="fa fa-angle-left arrow"></i>
              </a>
              <ul className="nav-2-level collapse">
                <li>
                  <Link to={"/products"}>Create MR</Link>
                </li>
                <li>
                  <Link to={"/products"}>Manage MR</Link>
                </li>
                <li>
                  <Link to={"/accounts/invoice/create"}>Create Invoice</Link>
                </li>
                <li>
                  <Link to={"/accounts/invoice/manage"}>Manage Invoice</Link>
                </li>
              </ul>
            </li>
            <li>
              <a href="javascript:;">
                <i className="sidebar-item-icon fa-solid fa-user-tie"></i>
                <span className="nav-label">Supplier</span>
                <i className="fa fa-angle-left arrow"></i>
              </a>
              <ul className="nav-2-level collapse">
                <li>
                  <Link to={"/suppliers/create"}>Create Supplier</Link>
                </li>
                <li>
                  <Link to={"/suppliers"}>Manage Supplier</Link>
                </li>
              </ul>
            </li>
            <li>
              <a href="javascript:;">
                <i className="sidebar-item-icon fa-solid fa-ticket"></i>
                <span className="nav-label">Coupon</span>
                <i className="fa fa-angle-left arrow"></i>
              </a>
              <ul className="nav-2-level collapse">
                <li>
                  <Link to={"/products"}>Create Coupon</Link>
                </li>
                <li>
                  <Link to={"/products"}>Manage Coupon</Link>
                </li>
              </ul>
            </li>
            <li>
              <a href="javascript:;">
                <i className="sidebar-item-icon fas fa-box"></i>
                <span className="nav-label">Production</span>
                <i className="fa fa-angle-left arrow"></i>
              </a>
              <ul className="nav-2-level collapse">
                <li>
                  <Link to={"/products"}>Create Production</Link>
                </li>
                <li>
                  <Link to={"/products"}>Manage Production</Link>
                </li>
              </ul>
            </li>
            <li>
              <a href="javascript:;">
                <i className="sidebar-item-icon fa-solid fa-gear"></i>
                <span className="nav-label">System</span>
                <i className="fa fa-angle-left arrow"></i>
              </a>
              <ul className="nav-2-level collapse">
                <li>
                  <Link to={"/products"}>Change Theme</Link>
                </li>
                <li>
                  <Link to={"/products"}>Manage Themes</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
      {/* END SIDEBAR */}
    </>
  );
};

export default Sidebar;
