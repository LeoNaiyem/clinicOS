import React, { useState } from "react";

const ThemeConfig = () => {
    const [checked,setChecked]=useState(false);
  return (
    <div className="theme-config">
      <div className="theme-config-toggle">
        <i className="fa fa-cog theme-config-show"></i>
        <i className="ti-close theme-config-close"></i>
      </div>
      <div className="theme-config-box">
        <div className="text-center font-18 m-b-20">SETTINGS</div>
        <div className="font-strong">LAYOUT OPTIONS</div>
        <div className="check-list m-b-20 m-t-10">
          <label className="ui-checkbox ui-checkbox-gray">
            <input id="_fixedNavbar" type="checkbox" defaultChecked />
            <span className="input-span"></span>Fixed navbar
          </label>
          <label className="ui-checkbox ui-checkbox-gray">
            <input id="_fixedlayout" type="checkbox" />
            <span className="input-span"></span>Fixed layout
          </label>
          <label className="ui-checkbox ui-checkbox-gray">
            <input className="js-sidebar-toggler" type="checkbox" />
            <span className="input-span"></span>Collapse sidebar
          </label>
        </div>
        <div className="font-strong">LAYOUT STYLE</div>
        <div className="m-t-10">
          <label className="ui-radio ui-radio-gray m-r-10">
            <input
              type="radio"
              name="layout-style"
              value=""
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <span className="input-span"></span>Fluid
          </label>
          <label className="ui-radio ui-radio-gray">
            <input type="radio" name="layout-style" value="1" />
            <span className="input-span"></span>Boxed
          </label>
        </div>
        <div className="m-t-10 m-b-10 font-strong">THEME COLORS</div>
        <div className="d-flex m-b-20">
          <div
            className="color-skin-box"
            data-toggle="tooltip"
            data-original-title="Default"
          >
            <label>
              <input
                type="radio"
                name="setting-theme"
                value="default"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
              <span className="color-check-icon">
                <i className="fa fa-check"></i>
              </span>
              <div className="color bg-white"></div>
              <div className="color-small bg-ebony"></div>
            </label>
          </div>
          <div
            className="color-skin-box"
            data-toggle="tooltip"
            data-original-title="Blue"
          >
            <label>
              <input type="radio" name="setting-theme" value="blue" />
              <span className="color-check-icon">
                <i className="fa fa-check"></i>
              </span>
              <div className="color bg-blue"></div>
              <div className="color-small bg-ebony"></div>
            </label>
          </div>
          <div
            className="color-skin-box"
            data-toggle="tooltip"
            data-original-title="Green"
          >
            <label>
              <input type="radio" name="setting-theme" value="green" />
              <span className="color-check-icon">
                <i className="fa fa-check"></i>
              </span>
              <div className="color bg-green"></div>
              <div className="color-small bg-ebony"></div>
            </label>
          </div>
          <div
            className="color-skin-box"
            data-toggle="tooltip"
            data-original-title="Purple"
          >
            <label>
              <input type="radio" name="setting-theme" value="purple" />
              <span className="color-check-icon">
                <i className="fa fa-check"></i>
              </span>
              <div className="color bg-purple"></div>
              <div className="color-small bg-ebony"></div>
            </label>
          </div>
          <div
            className="color-skin-box"
            data-toggle="tooltip"
            data-original-title="Orange"
          >
            <label>
              <input type="radio" name="setting-theme" value="orange" />
              <span className="color-check-icon">
                <i className="fa fa-check"></i>
              </span>
              <div className="color bg-orange"></div>
              <div className="color-small bg-ebony"></div>
            </label>
          </div>
          <div
            className="color-skin-box"
            data-toggle="tooltip"
            data-original-title="Pink"
          >
            <label>
              <input type="radio" name="setting-theme" value="pink" />
              <span className="color-check-icon">
                <i className="fa fa-check"></i>
              </span>
              <div className="color bg-pink"></div>
              <div className="color-small bg-ebony"></div>
            </label>
          </div>
        </div>
        <div className="d-flex">
          <div
            className="color-skin-box"
            data-toggle="tooltip"
            data-original-title="White"
          >
            <label>
              <input type="radio" name="setting-theme" value="white" />
              <span className="color-check-icon">
                <i className="fa fa-check"></i>
              </span>
              <div className="color"></div>
              <div className="color-small bg-silver-100"></div>
            </label>
          </div>
          <div
            className="color-skin-box"
            data-toggle="tooltip"
            data-original-title="Blue light"
          >
            <label>
              <input type="radio" name="setting-theme" value="blue-light" />
              <span className="color-check-icon">
                <i className="fa fa-check"></i>
              </span>
              <div className="color bg-blue"></div>
              <div className="color-small bg-silver-100"></div>
            </label>
          </div>
          <div
            className="color-skin-box"
            data-toggle="tooltip"
            data-original-title="Green light"
          >
            <label>
              <input type="radio" name="setting-theme" value="green-light" />
              <span className="color-check-icon">
                <i className="fa fa-check"></i>
              </span>
              <div className="color bg-green"></div>
              <div className="color-small bg-silver-100"></div>
            </label>
          </div>
          <div
            className="color-skin-box"
            data-toggle="tooltip"
            data-original-title="Purple light"
          >
            <label>
              <input type="radio" name="setting-theme" value="purple-light" />
              <span className="color-check-icon">
                <i className="fa fa-check"></i>
              </span>
              <div className="color bg-purple"></div>
              <div className="color-small bg-silver-100"></div>
            </label>
          </div>
          <div
            className="color-skin-box"
            data-toggle="tooltip"
            data-original-title="Orange light"
          >
            <label>
              <input type="radio" name="setting-theme" value="orange-light" />
              <span className="color-check-icon">
                <i className="fa fa-check"></i>
              </span>
              <div className="color bg-orange"></div>
              <div className="color-small bg-silver-100"></div>
            </label>
          </div>
          <div
            className="color-skin-box"
            data-toggle="tooltip"
            data-original-title="Pink light"
          >
            <label>
              <input type="radio" name="setting-theme" value="pink-light" />
              <span className="color-check-icon">
                <i className="fa fa-check"></i>
              </span>
              <div className="color bg-pink"></div>
              <div className="color-small bg-silver-100"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeConfig;
