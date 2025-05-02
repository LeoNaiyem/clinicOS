import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import PreLoader from '../components/PreLoader/PreLoader';
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
            <ThemeConfig/>
            <PreLoader/>
        </>
    );
};

export default Layout;