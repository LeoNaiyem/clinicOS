import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import ThemeConfig from '../components/ThemeConfig/ThemeConfig';

const Layout = () => {
    return (
        <>
            <div className="page-wrapper">
                <Header/>
                <Sidebar/>
                <div className="content-wrapper">
                    <Outlet/>
                    <Footer/>
                </div>
            </div>
<<<<<<< HEAD
            <ThemeConfig/>
            {/* <PreLoader/> */}
=======
            <ThemeConfig/>                                                          
            <PreLoader/>
>>>>>>> 7e6f7a848d77add12a1e3ff16f3d56089fef78ed
        </>
    );
};

export default Layout;