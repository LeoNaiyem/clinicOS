import adminNaiyem from "../../../public/img/admin-naiyem.jpg";
import logoMin from "../../../public/img/logos/logo-min2.svg";
import logo from "../../../public/img/logos/logo2.svg";


const Header = () => {
    return (
        <>
 {/* START HEADER */}
      <header className="header">
        <div className="page-brand">
          <a className="link" href="index.html">
            <span className="brand">
              <img width="150px" src={logo} alt="logo"/>
            </span>
            <span className="brand-mini">
                <img src={logoMin} alt="logo-min" />
            </span>
          </a>
        </div>
        <div className="flexbox flex-1">
   {/* START TOP-LEFT TOOLBAR */}
          <ul className="nav navbar-toolbar">
            <li>
              <a className="nav-link sidebar-toggler js-sidebar-toggler"
                ><i className="ti-menu"></i
              ></a>
            </li>
            <li>
              <form className="navbar-search" action="javascript:;">
                <div className="rel">
                  <span className="search-icon"><i className="ti-search"></i></span>
                  <input className="form-control" placeholder="Search here..." />
                </div>
              </form>
            </li>
          </ul>
   {/* END TOP-LEFT TOOLBAR */}
   {/* START TOP-RIGHT TOOLBAR */}
          <ul className="nav navbar-toolbar">
            <li className="dropdown dropdown-inbox">
              <a className="nav-link dropdown-toggle" data-toggle="dropdown"
                ><i className="fa fa-envelope-o"></i>
                <span className="badge badge-primary envelope-badge">9</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-right dropdown-menu-media">
                <li className="dropdown-menu-header">
                  <div>
                    <span><strong>9 New</strong> Messages</span>
                    <a className="pull-right" href="mailbox.html">view all</a>
                  </div>
                </li>
                <li
                  className="list-group list-group-divider scroller"
                  data-height="240px"
                  data-color="#71808f"
                >
                  <div>
                    <a className="list-group-item">
                      <div className="media">
                        <div className="media-img">
                          <img src="img/users/u1.jpg" />
                        </div>
                        <div className="media-body">
                          <div className="font-strong"></div>
                          Jeanne Gonzalez<small className="text-muted float-right"
                            >Just now</small
                          >
                          <div className="font-13">
                            Your proposal interested me.
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className="list-group-item">
                      <div className="media">
                        <div className="media-img">
                          <img src="img/users/u2.jpg" />
                        </div>
                        <div className="media-body">
                          <div className="font-strong"></div>
                          Becky Brooks<small className="text-muted float-right"
                            >18 mins</small
                          >
                          <div className="font-13">Lorem Ipsum is simply.</div>
                        </div>
                      </div>
                    </a>
                    <a className="list-group-item">
                      <div className="media">
                        <div className="media-img">
                          <img src="img/users/u3.jpg" />
                        </div>
                        <div className="media-body">
                          <div className="font-strong"></div>
                          Frank Cruz<small className="text-muted float-right"
                            >18 mins</small
                          >
                          <div className="font-13">Lorem Ipsum is simply.</div>
                        </div>
                      </div>
                    </a>
                    <a className="list-group-item">
                      <div className="media">
                        <div className="media-img">
                          <img src="./assets/img/users/u4.jpg" />
                        </div>
                        <div className="media-body">
                          <div className="font-strong"></div>
                          Rose Pearson<small className="text-muted float-right"
                            >3 hrs</small
                          >
                          <div className="font-13">Lorem Ipsum is simply.</div>
                        </div>
                      </div>
                    </a>
                  </div>
                </li>
              </ul>
            </li>
            <li className="dropdown dropdown-notification">
              <a className="nav-link dropdown-toggle" data-toggle="dropdown"
                ><i className="fa fa-bell-o rel"
                  ><span className="notify-signal"></span></i
              ></a>
              <ul className="dropdown-menu dropdown-menu-right dropdown-menu-media">
                <li className="dropdown-menu-header">
                  <div>
                    <span><strong>5 New</strong> Notifications</span>
                    <a className="pull-right" href="javascript:;">view all</a>
                  </div>
                </li>
                <li
                  className="list-group list-group-divider scroller"
                  data-height="240px"
                  data-color="#71808f"
                >
                  <div>
                    <a className="list-group-item">
                      <div className="media">
                        <div className="media-img">
                          <span className="badge badge-success badge-big"
                            ><i className="fa fa-check"></i
                          ></span>
                        </div>
                        <div className="media-body">
                          <div className="font-13">4 task compiled</div>
                          <small className="text-muted">22 mins</small>
                        </div>
                      </div>
                    </a>
                    <a className="list-group-item">
                      <div className="media">
                        <div className="media-img">
                          <span className="badge badge-default badge-big"
                            ><i className="fa fa-shopping-basket"></i
                          ></span>
                        </div>
                        <div className="media-body">
                          <div className="font-13">You have 12 new orders</div>
                          <small className="text-muted">40 mins</small>
                        </div>
                      </div>
                    </a>
                    <a className="list-group-item">
                      <div className="media">
                        <div className="media-img">
                          <span className="badge badge-danger badge-big"
                            ><i className="fa fa-bolt"></i
                          ></span>
                        </div>
                        <div className="media-body">
                          <div className="font-13">Server #7 rebooted</div>
                          <small className="text-muted">2 hrs</small>
                        </div>
                      </div>
                    </a>
                    <a className="list-group-item">
                      <div className="media">
                        <div className="media-img">
                          <span className="badge badge-success badge-big"
                            ><i className="fa fa-user"></i
                          ></span>
                        </div>
                        <div className="media-body">
                          <div className="font-13">New user registered</div>
                          <small className="text-muted">2 hrs</small>
                        </div>
                      </div>
                    </a>
                  </div>
                </li>
              </ul>
            </li>
            <li className="dropdown dropdown-user">
              <a className="nav-link dropdown-toggle link" data-toggle="dropdown">
                <img src={adminNaiyem} alt="admin" />
                <span></span>Admin<i className="fa fa-angle-down m-l-5"></i
              ></a>
              <ul className="dropdown-menu dropdown-menu-right">
                <a className="dropdown-item" href="profile.html"
                  ><i className="fa fa-user"></i>Profile</a
                >
                <a className="dropdown-item" href="profile.html"
                  ><i className="fa fa-cog"></i>Settings</a
                >
                <a className="dropdown-item" href="javascript:;"
                  ><i className="fa fa-support"></i>Support</a
                >
                <li className="dropdown-divider"></li>
                <a className="dropdown-item" href="login.html"
                  ><i className="fa fa-power-off"></i>Logout</a
                >
              </ul>
            </li>
          </ul>
          {/* END TOP-RIGHT TOOLBAR */}
        </div>
      </header>
      {/* END HEADER */}
            
        </>
    );
};

export default Header;