import React from 'react';

const PreLoader = () => {
    return (
      <>
        <div className="sidenav-backdrop backdrop"></div>
        <div className="preloader-backdrop">
          <div className="page-preloader">Loading</div>
        </div>
      </>
    );
};

export default PreLoader;