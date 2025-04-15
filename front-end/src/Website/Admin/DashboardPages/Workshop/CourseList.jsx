import { useOutletContext, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Img } from "react-image";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { FaRegTrashAlt } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CheckPasswordModal from "../../../../Helpers/CheckPasswordModal";
import { useAuth } from "../../../../Context/AuthProvider";

export default function CourseList() {
  const { courses, handleDelete } = useOutletContext(); // Assuming currentUser contains role and id
  const navigate = useNavigate();
  const { auth } = useAuth();
  const currentUser = auth?.user;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const cardPerPage = 6; // Number of cards to display per page

  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [courseId, setCourseId] = useState(null);

  // Filter courses based on user role
  const filteredCourses =
    currentUser?.role === "superAdmin" ||
    currentUser?.role === "superInstructor"
      ? courses
      : courses.filter((course) => course.instructorId === currentUser?._id);

  // Calculate the index of the first and last course on the current page
  const indexOfLastCourse = currentPage * cardPerPage;
  const indexOfFirstCourse = indexOfLastCourse - cardPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  // Show skeleton until courses are loaded
  if (!filteredCourses || filteredCourses.length === 0) {
    return (
      <Container>
        <div className="center-flex justify-content-end ">
          <Button
            variant="primary text-light text-end"
            onClick={() => navigate("add")}
            className="mb-3 fs-10px fs-md-14px"
          >
            Add Course
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
          <b>If you're stuck with loading </b>, then there's no courses
          available at the moment...
        </p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="center-flex justify-content-end ">
        <Button
          variant="primary text-light text-end"
          onClick={() => navigate("add")}
          className="mb-3 fs-10px fs-md-14px"
        >
          Add Course
        </Button>
      </div>
      <Row>
        {currentCourses.map((course) => (
          <Col lg={4} md={6} key={course._id} className="mb-4">
            <Card className="h-100">
              <Img
                src={
                  course.images[0] ||
                  `https://dummyimage.com/900x600/dfdfdfdf/ffffff&text=${course.name}`
                }
                alt={course.name}
                loader={<Skeleton height={240} />}
                decoding="async"
                loading="lazy"
                style={{ height: "220px", objectFit: "cover" }}
              />
              <Card.Body>
                <div className="between-flex">
                  <Card.Title className="truncate">{course.name}</Card.Title>
                  <span className="text-capitalize text-muted truncate">
                    by: {course.author?.name || "User Deleted"}
                  </span>
                </div>
                <div className="between-flex mt-3 text-light">
                  <Button
                    variant="success"
                    onClick={() => {
                      setCourseId(course._id);
                      setSelectedAction("edit");
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setCourseId(course._id);
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
            disabled={indexOfLastCourse >= filteredCourses.length}
          >
            Next
          </Button>
        </div>
      </Row>

      {/* Verification Modal */}
      <CheckPasswordModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSuccess={() => {
          if (selectedAction === "delete") {
            handleDelete(courseId);
          } else if (selectedAction === "edit") {
            navigate(`${courseId}`);
          }
        }}
      />
    </Container>
  );
}
