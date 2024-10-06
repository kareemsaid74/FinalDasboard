import { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import LogoBlue from "../../assets/images/logo_blue.svg";
import LogoWhite from "../../assets/images/logo_white.svg";
import {
  MdOutlineClose,
  MdOutlineGridView,
  MdOutlinePeople,
  MdOutlineMessage,
  MdOutlineSettings,
  MdOutlineLogout,
  MdOutlineShoppingBag,
} from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom"; // استخدام NavLink بدلاً من Link
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const navigate = useNavigate(); // Hook للتنقل بين الصفحات

  // Handle click outside to close the sidebar
  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      closeSidebar();
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');  // حذف التوكن من localStorage
    navigate('/signin');               // التوجيه لصفحة تسجيل الدخول
  };

  // Add event listener for closing sidebar on click outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`} ref={navbarRef}>
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src={theme === LIGHT_THEME ? LogoBlue : LogoWhite} alt="Logo" />
          <span className="sidebar-brand-text">Helicopter.</span>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className="menu-item">
              <NavLink
                to="/"
                className="menu-link text-decoration-none"
                activeClassName="active"
              >
                <MdOutlineGridView size={18} />
                <span className="menu-link-text">Dashboard</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/Product"
                className="menu-link text-decoration-none"
                activeClassName="active"
              >
                <MdOutlineShoppingBag size={20} />
                <span className="menu-link-text">Products</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/Category"
                className="menu-link text-decoration-none"
                activeClassName="active"
              >
                <MdOutlineShoppingBag size={20} />
                <span className="menu-link-text">Category</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/User"
                className="menu-link text-decoration-none"
                activeClassName="active"
              >
                <MdOutlinePeople size={20} />
                <span className="menu-link-text">User</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/Messages"
                className="menu-link text-decoration-none"
                activeClassName="active"
              >
                <MdOutlineMessage size={18} />
                <span className="menu-link-text">Messages</span>
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
              <NavLink
                to="/Settings"
                className="menu-link text-decoration-none"
                activeClassName="active"
              >
                <MdOutlineSettings size={20} />
                <span className="menu-link-text">Settings</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <button className="menu-link text-decoration-none" onClick={handleLogout}>
                <MdOutlineLogout size={20} />
                <span className="menu-link-text">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
