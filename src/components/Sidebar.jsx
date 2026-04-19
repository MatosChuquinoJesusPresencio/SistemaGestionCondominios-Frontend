import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ menuItems }) => {
    const location = useLocation();

    const closeSidebar = () => {
        const closeBtn = document.getElementById("btn-close-sidebar");
        if (closeBtn) closeBtn.click();
    };

    return (
        <div
            className="offcanvas offcanvas-start text-main bg-main"
            tabIndex="-1"
            id="sidebarMenu"
        >
            <div className="offcanvas-header border-bottom border-light border-opacity-25">
                <button
                    type="button"
                    id="btn-close-sidebar"
                    className="btn-close btn-close-white"
                    data-bs-dismiss="offcanvas"
                />
            </div>

            <div className="offcanvas-body p-2">

                <nav className="nav flex-column gap-1">

                    {menuItems.map((item) => {
                        const isActive = item.exact
                            ? location.pathname === item.path
                            : location.pathname === item.path ||
                            location.pathname.startsWith(item.path + "/");

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={closeSidebar}
                                className={`
                                    nav-link d-flex align-items-center gap-2
                                    px-3 py-2 rounded
                                    transition
                                   ${isActive ? "active-nav-link" : "hover-bg text-main"}
                                `}
                            >
                                {item.icon && <span className="sidebar-icon">{item.icon}</span>}
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                </nav>

            </div>
        </div>
    );
};

export default Sidebar;