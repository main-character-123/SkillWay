import { useState, useEffect } from "react";
import { Axios } from "../../../../api/axios";
import { Outlet, useLocation } from "react-router-dom";
import { usersAPI } from "../../../../api/Api";
import { useAuth } from "../../../../Context/AuthProvider";
import { toast } from "react-toastify";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const location = useLocation();
  const { auth } = useAuth();
  const currentUser = auth?.user;

  useEffect(() => {
    fetchUsers();
  }, [refreshKey]);

  const fetchUsers = async () => {
    try {
      const { data } = await Axios.get(`${usersAPI}`);
      let usersData = data.users;

      // Remove the logged-in user from the list
      if (currentUser) {
        usersData = usersData.filter((user) => user._id !== currentUser?._id);
      }

      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await Axios.delete(`${usersAPI}/${id}`);
      fetchUsers();
      toast.success("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error?.response?.data?.error || "Couldn't delete user.");
    }
  };

  // Filter users based on role
  useEffect(() => {
    if (roleFilter) {
      const filtered = users.filter((user) => user.role === roleFilter);
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [roleFilter, users]);

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
  };

  // Check if we're on the main '/users' page (not child routes)
  const isMainUsersPage = location.pathname === "/dashboard/users";

  return (
    <div className="mt-4">
      {isMainUsersPage && (
        <div className="mb-3 container">
          <label htmlFor="roleFilter" className="form-label">
            Filter by Role
          </label>
          <select
            id="roleFilter"
            className="form-select"
            value={roleFilter}
            onChange={handleRoleChange}
          >
            <option value="">All Roles</option>
            <option value="superAdmin">Super Admin</option>
            <option value="superInstructor">Super Instructor</option>
            <option value="instructor">Instructor</option>
            <option value="cvAdmin">CV Admin</option>
            <option value="trackAdmin">Track Admin</option>
            <option value="student">Student</option>
          </select>
        </div>
      )}
      {/* Pass filtered data to Outlet context */}
      <Outlet context={{ users: filteredUsers, handleDelete, setRefreshKey }} />
    </div>
  );
}
