import React from "react";

const Statistics = () => {
  return (
    <>
      <div className="page-heading">
        <h1 className="page-title">Chart.js</h1>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="index.html">
              <i className="la la-home font-20"></i>
            </a>
          </li>
          <li className="breadcrumb-item">Chart.js</li>
        </ol>
      </div>
      <div className="page-content fade-in-up">
        <div className="row">
          <div className="col-md-6">
            <div className="ibox">
              <div className="ibox-head">
                <div className="ibox-title">Line Chart</div>
              </div>
              <div className="ibox-body">
                <div>
                  <canvas id="line_chart" style={{ height: "200px" }}></canvas>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="ibox">
              <div className="ibox-head">
                <div className="ibox-title">Bar Chart</div>
              </div>
              <div className="ibox-body">
                <div>
                  <canvas id="bar_chart" style={{ height: "200px" }}></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="ibox">
              <div className="ibox-head">
                <div className="ibox-title">Radar Chart</div>
              </div>
              <div className="ibox-body">
                <div>
                  <canvas id="radar_chart" style={{ height: "200px" }}></canvas>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="ibox">
              <div className="ibox-head">
                <div className="ibox-title">Doughnut Chart</div>
              </div>
              <div className="ibox-body">
                <div>
                  <canvas
                    id="doughnut_chart"
                    style={{ height: "200px" }}
                  ></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <a
            className="adminca-banner"
            href="http://admincast.com/adminca/"
            target="_blank"
          >
            <div className="adminca-banner-ribbon">
              <i className="fa fa-trophy mr-2"></i>PREMIUM TEMPLATE
            </div>
            <div className="wrap-1">
              <div className="wrap-2">
                <div>
                  <img
                    src="./assets/img/adminca-banner/adminca-preview.jpg"
                    style={{ height: "160px", marginTop: "50px" }}
                  />
                </div>
                <div className="color-white" style={{ marginLeft: "40px" }}>
                  <h1 className="font-bold">ADMINCA</h1>
                  <p className="font-16">Save your time, choose the best</p>
                  <ul className="list-unstyled">
                    <li className="m-b-5">
                      <i className="ti-check m-r-5"></i>High Quality Design
                    </li>
                    <li className="m-b-5">
                      <i className="ti-check m-r-5"></i>Fully Customizable and
                      Easy Code
                    </li>
                    <li className="m-b-5">
                      <i className="ti-check m-r-5"></i>Bootstrap 4 and Angular
                      5+
                    </li>
                    <li className="m-b-5">
                      <i className="ti-check m-r-5"></i>Best Build Tools: Gulp,
                      SaSS, Pug...
                    </li>
                    <li>
                      <i className="ti-check m-r-5"></i>More layouts, pages,
                      components
                    </li>
                  </ul>
                </div>
              </div>
              <div style={{ flex:" 1" }}>
                <div className="d-flex justify-content-end wrap-3">
                  <div className="adminca-banner-b m-r-20">
                    <img
                      src="./assets/img/adminca-banner/bootstrap.png"
                      style={{ width: "40px", marginRight: "10px" }}
                    />
                    Bootstrap v4
                  </div>
                  <div className="adminca-banner-b m-r-10">
                    <img
                      src="./assets/img/adminca-banner/angular.png"
                      style={{ width: "35px", marginRight: "10px" }}
                    />
                    Angular v5+
                  </div>
                </div>
                <div className="dev-img">
                  <img src="./assets/img/adminca-banner/sprite.png" />
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </>
  );
};

export default Statistics;
