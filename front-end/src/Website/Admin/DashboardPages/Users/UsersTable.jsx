import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Button, Container, Table } from "react-bootstrap";
import { FaTrashAlt, FaUserAlt, FaUserEdit } from "react-icons/fa";
import { Img } from "react-image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CheckPasswordModal from "../../../../Helpers/CheckPasswordModal";
import { toast } from "react-toastify";

export default function UsersTable() {
  const { users, handleDelete } = useOutletContext();
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8; // Number of users to display per page

  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [userId, setUserId] = useState(null);

  // Format role function
  function formatRole(role) {
    if (!role) return "Administrator";
    const spaced = role.replace(/([A-Z])/g, " $1"); // 'trackAdmin' → 'track Admin'
    return spaced.charAt(0).toUpperCase() + spaced.slice(1); // 'track Admin' → 'Track Admin'
  }

  // Calculate the index of the first and last user on the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Show skeleton until users are loaded
  if (!users || users.length === 0 || users === undefined) {
    return (
      <Container className="mt-5">
        <div className="center-flex justify-content-end ">
          <Button
            variant="primary text-light"
            onClick={() => navigate("add")}
            className="mb-3 fs-10px fs-md-14px"
          >
            Add User
          </Button>
        </div>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr className="text-center fs-8px fs-md-14px">
              <th className="bg-secondary p-1 p-md-2">Id</th>
              <th className="bg-secondary p-1 p-md-2">Pic</th>
              <th className="bg-secondary p-1 p-md-2">Name</th>
              <th className="bg-secondary p-1 p-md-2">Email</th>
              <th className="bg-secondary p-1 p-md-2">Role</th>
              <th className="bg-secondary p-1 p-md-2">Country</th>
              <th className="bg-secondary p-1 p-md-2">Gender</th>
              <th className="bg-secondary p-1 p-md-2">Age</th>
              <th className="bg-secondary p-1 p-md-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, index) => (
              <tr key={index} className="text-center">
                {[...Array(9)].map((__, i) => (
                  <td key={i} className="p-1 p-md-2">
                    <Skeleton height={20} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
        <p className="text-danger">
          <b>If you're stuck with a loading table</b>, then there's no users
          with this role at the moment...
        </p>
      </Container>
    );
  }

  // Show current users based on pagination
  const showUsers = currentUsers.map((user, i) => {
    return (
      <tr className="text-center fs-8px fs-md-14px" key={i}>
        <td className="p-1 p-md-2">
          <Button
            variant="outline-dark"
            size="sm"
            onClick={() => {
              setUserId(user?._id);
              setSelectedAction("revealId");
              setShowModal(true);
            }}
          >
            <FaUserAlt />
          </Button>
        </td>
        <td>
          <Img
            src={user?.profilePic}
            alt={user?.name}
            width={32}
            height={32}
            loader={<Skeleton width={32} height={32} />}
            decoding="async"
            loading="lazy"
            className="rounded-circle"
          />
        </td>
        <td className="p-1 p-md-2 text-capitalize truncate">{user?.name}</td>
        <td className="p-1 p-md-2 truncate">{user?.email}</td>
        <td className="p-1 p-md-2 text-capitalize truncate">
          {formatRole(user?.role)}
        </td>
        <td className="p-1 p-md-2 text-capitalize truncate">{user?.country}</td>
        <td className="p-1 p-md-2 text-capitalize truncate">{user?.gender}</td>
        <td className="p-1 p-md-2 truncate">{user?.age}</td>
        <td className="p-1 p-md-2">
          <FaUserEdit
            className="pointer text-success me-3"
            size={20}
            onClick={() => {
              setUserId(user?._id);
              setSelectedAction("edit");
              setShowModal(true);
            }}
          />
          <FaTrashAlt
            className="pointer text-danger"
            size={19}
            onClick={() => {
              setUserId(user?._id);
              setSelectedAction("delete");
              setShowModal(true);
            }}
          />
        </td>
      </tr>
    );
  });

  return (
    <Container className="mt-5">
      <div className="center-flex justify-content-end ">
        <Button
          variant="primary text-light text-end"
          onClick={() => navigate("add")}
          className="mb-3 fs-10px fs-md-14px"
        >
          Add User
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr className="text-center fs-8px fs-md-14px">
            <th className="bg-secondary p-1 p-md-2">Id</th>
            <th className="bg-secondary p-1 p-md-2">Pic</th>
            <th className="bg-secondary p-1 p-md-2">Name</th>
            <th className="bg-secondary p-1 p-md-2">Email</th>
            <th className="bg-secondary p-1 p-md-2">Role</th>
            <th className="bg-secondary p-1 p-md-2">Country</th>
            <th className="bg-secondary p-1 p-md-2">Gender</th>
            <th className="bg-secondary p-1 p-md-2">Age</th>
            <th className="bg-secondary p-1 p-md-2">Actions</th>
          </tr>
        </thead>
        <tbody>{showUsers}</tbody>
      </Table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between">
        <Button
          variant="secondary"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={indexOfLastUser >= users.length}
        >
          Next
        </Button>
      </div>

      {/* Verification Modal */}
      <CheckPasswordModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSuccess={() => {
          if (selectedAction === "delete") {
            handleDelete(userId);
          } else if (selectedAction === "edit") {
            navigate(`${userId}`);
          } else if (selectedAction === "revealId") {
            navigator.clipboard
              .writeText(userId)
              .then(() => {
                toast.success("ID copied to clipboard!");
              })
              .catch((err) => {
                toast.error("Failed to copy ID.");
              });
          }
        }}
      />
    </Container>
  );
}
