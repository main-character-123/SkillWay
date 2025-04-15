import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Admin/Sidebar";
import NavBar from "../../Components/Admin/Navbar";

export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="d-flex vh-100">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        className="d-flex flex-column flex-grow-1"
        style={{
          marginLeft: isCollapsed ? "82px" : "302px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <NavBar isCollapsed={isCollapsed} />

        <div className="p-1 px-md-3 my-5 py-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
