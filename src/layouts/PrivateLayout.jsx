import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

import { useAuth } from "../hooks/useAuth";

import { MENU_BY_ROLE } from "../constants/menus";

const PrivateLayout = () => {
    const { authUser } = useAuth();

    const menuItems = MENU_BY_ROLE[authUser?.role] || [];

    return (
        <>
            <Header />
            <Sidebar menuItems={menuItems} />
            <Outlet />
            <Footer />
        </>
    );
};

export default PrivateLayout;