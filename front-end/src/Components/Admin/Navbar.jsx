import React, { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import { Bell, Maximize } from "react-feather";
import { FaSignOutAlt } from "react-icons/fa";
import Cookies from "js-cookie";
import { useAuth } from "../../Context/AuthProvider";

const NavBar = ({ isCollapsed }) => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);

  const handleLogout = useCallback(() => {
    Cookies.remove("authToken");
    Cookies.remove("userData");
    setAuth(null);
    navigate("/auth/login");
  }, [setAuth, navigate]);

  function formatRole(role) {
    if (!role) return "Administrator";
    const spaced = role.replace(/([A-Z])/g, " $1"); // 'trackAdmin' → 'track Admin'
    return spaced.charAt(0).toUpperCase() + spaced.slice(1); // 'track Admin' → 'Track Admin'
  }

  // Usage

  const profilePic =
    auth?.user?.profilePic || "https://www.viverefermo.it/images/user.png";
  const userName = auth?.user?.name || "Admin";
  const userRole = formatRole(auth?.user?.role) || "Administrator";

  return (
    <Navbar
      fixed="top"
      bg="light"
      className="px-3 shadow-sm d-flex justify-content-between align-items-center"
      style={{
        marginLeft: isCollapsed ? "82px" : "302px",
        width: `calc(100% - ${isCollapsed ? "82px" : "302px"})`,
        transition: "margin-left 0.3s ease, width 0.3s ease",
      }}
    >
      {/* Search Field */}
      <Form className="d-flex">
        <FormControl type="search" placeholder="Search" className="me-2" />
        <Button variant="outline-primary">Search</Button>
      </Form>

      {/* Right Section */}
      <div className="d-flex align-items-center gap-3">
        <Button variant="light" className="p-2">
          <Bell size={20} />
        </Button>
        <Button variant="light" className="p-2" onClick={toggleFullScreen}>
          <Maximize size={20} />
        </Button>

        {/* Auth Profile Dropdown */}
        <Dropdown>
          <Dropdown.Toggle
            variant="light"
            className="d-flex align-items-center border-0"
          >
            <img
              src={profilePic}
              alt="Profile"
              className="rounded-circle"
              width="40"
              height="40"
              loading="lazy"
            />
            <div className="ms-2 text-start me-2">
              <div className="fw-bold fs-14px text-capitalize">{userName}</div>
              <small className="text-primary">{userRole}</small>
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu align="end" className="p-2">
            <Dropdown.Item as={Link} to="/profile" className="p-2 rounded-3">
              Profile
            </Dropdown.Item>
            {auth?.user.isAdmin && (
              <Dropdown.Item as={Link} to="/" className="p-2 rounded-3">
                Website
              </Dropdown.Item>
            )}
            <Dropdown.Divider />
            <Dropdown.Item
              className="p-1 rounded-3 logout-btn"
              onClick={handleLogout}
            >
              Logout <FaSignOutAlt size={18} className="ms-2 logout-icon" />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default React.memo(NavBar);
