import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useState } from "react";
import { useAuth } from "../../../../Context/AuthProvider";
import CheckPasswordModal from "../../../../Helpers/CheckPasswordModal";
import { Img } from "react-image";

export default function BlogList() {
  const { blogs, handleDelete } = useOutletContext(); // Assuming currentUser contains role and id
  const navigate = useNavigate();
  const { auth } = useAuth();
  const currentUser = auth?.user;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6; // Number of cards to display per page

  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [blogId, setBlogId] = useState(null);

  // Filter blogs based on user role
  const filteredBlogs =
    currentUser?.role === "superAdmin" ||
    currentUser?.role === "superInstructor"
      ? blogs
      : blogs.filter((blog) => blog.author?._id === currentUser?._id);

  // Calculate the index of the first and last blog on the current page
  const indexOfLastBlog = currentPage * cardsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - cardsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Show skeleton until blogs are loaded
  if (!filteredBlogs || filteredBlogs.length === 0) {
    return (
      <Container>
        <div className="center-flex justify-content-end ">
          <Button
            variant="primary text-light"
            onClick={() => navigate("add")}
            className="mb-3 fs-10px fs-md-14px"
          >
            Add Blog
          </Button>
        </div>
        <Row>
          {[...Array(6)].map((_, index) => (
            <Col lg={4} key={index} className="mb-4">
              <Card>
                <Skeleton height={240} />
                <Card.Body>
                  <Skeleton width={200} height={20} />
                  <div className="between-flex mt-3 text-light">
                    <Skeleton width={60} height={30} />
                    <Skeleton width={40} height={30} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <p className="text-danger">
          <b>If you're stuck with loading</b>, then there's no blogs available
          at the moment...
        </p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="center-flex justify-content-end ">
        <Button
          variant="primary text-light"
          onClick={() => navigate("add")}
          className="mb-3 fs-10px fs-md-14px"
        >
          Add Blog
        </Button>
      </div>

      <Row>
        {currentBlogs.map((blog) => (
          <Col lg={4} md={6} key={blog._id} className="mb-4">
            <Card className="h-100">
              <Img
                src={
                  blog.image ||
                  `https://dummyimage.com/900x600/dfdfdfdf/ffffff&text=${blog.title}`
                }
                alt={blog.title}
                loader={<Skeleton height={240} />}
                decoding="async"
                loading="lazy"
                style={{ height: "220px", objectFit: "cover" }}
              />
              <Card.Body>
                <div className="between-flex mb-2">
                  <Card.Title className="truncate m-0">{blog.title}</Card.Title>
                  <span className="text-capitalize text-muted truncate">
                    by: {blog.author?.name || "User Deleted"}
                  </span>
                </div>

                <div className="between-flex mb-3">
                  <Card.Text className="text-muted truncate m-0">
                    {blog.date}
                  </Card.Text>
                  <span className="text-capitalize text-muted truncate">
                    {blog.duration}
                  </span>
                </div>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="success"
                    onClick={() => {
                      setBlogId(blog._id);
                      setSelectedAction("edit");
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setBlogId(blog._id);
                      setSelectedAction("delete");
                      setShowModal(true);
                    }}
                  >
                    <FaRegTrashAlt />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {/* Pagination Controls */}
        <div className="d-flex justify-content-between mt-4">
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
            disabled={indexOfLastBlog >= filteredBlogs.length}
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
              handleDelete(blogId);
            } else if (selectedAction === "edit") {
              navigate(`${blogId}`);
            }
          }}
        />
      </Row>
    </Container>
  );
}
