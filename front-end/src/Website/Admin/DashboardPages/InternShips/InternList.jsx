import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Button, Card, Container, Row } from "react-bootstrap";
import {
  FaRegTrashAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBuilding,
} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CheckPasswordModal from "../../../../Helpers/CheckPasswordModal";

export default function InternsList() {
  const { interns, handleDelete } = useOutletContext();
  const navigate = useNavigate();
  const [internId, setInternId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const internsPerPage = 3; // Number of interns to display per page

  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  // Calculate the index of the first and last intern on the current page
  const indexOfLastIntern = currentPage * internsPerPage;
  const indexOfFirstIntern = indexOfLastIntern - internsPerPage;
  const currentInterns = interns?.slice(indexOfFirstIntern, indexOfLastIntern);

  // Show skeleton until interns are loaded
  if (!interns || interns.length === 0 || interns === undefined) {
    return (
      <Container>
        <div className="center-flex justify-content-end ">
          <Button
            variant="primary text-light text-end"
            onClick={() => navigate("add")}
            className="mb-3 fs-10px fs-md-14px"
          >
            Add Intern
          </Button>
        </div>

        <Row>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="col-12 mb-3">
              <Card className="shadow-sm border-0">
                <Card.Body className="d-flex">
                  <div className="me-3">
                    <Skeleton circle width={80} height={80} />
                  </div>
                  <div className="flex-grow-1">
                    <Skeleton width="30%" height={20} className="mb-2" />
                    <Skeleton width="40%" height={16} className="mb-2" />
                    <Skeleton width="25%" height={16} className="mb-2" />
                    <div className="d-flex flex-wrap mt-2">
                      {[...Array(3)].map((__, i) => (
                        <Skeleton
                          key={i}
                          width={60}
                          height={20}
                          className="me-2 mb-2"
                        />
                      ))}
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                      <Skeleton width={70} height={36} className="me-2" />
                      <Skeleton width={36} height={36} />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Row>
      </Container>
    );
  }

  // Show current interns based on pagination
  const showInterns = currentInterns.map((intern, i) => (
    <div key={i} className="col-12 mb-3">
      <Card className="shadow-sm border-0 h-100">
        <Card.Body className="d-flex flex-column flex-md-row align-items-start">
          {/* Image Section */}
          <div className="me-md-4 mb-3 mb-md-0">
            <img
              src={
                intern.image ||
                `https://dummyimage.com/900x600/dfdfdfdf/ffffff&text=${intern.company}`
              }
              alt="intern"
              className="rounded-circle"
              style={{ width: 80, height: 80, objectFit: "cover" }}
            />
          </div>

          {/* Info Section */}
          <div className="flex-grow-1">
            <Card.Title className="fw-bold mb-2 d-flex align-items-center">
              <FaBuilding className="me-2" size={15} /> {intern?.company}
            </Card.Title>

            <p className="mb-1 d-flex align-items-center">
              <FaMapMarkerAlt className="me-2" /> {intern?.place}
            </p>

            <p className="mb-1 d-flex align-items-center">
              <FaMoneyBillWave className="me-2" /> {intern?.salary}
            </p>

            <div className="d-flex flex-wrap mt-2">
              <span className="me-2 text-muted">Skills:</span>
              {intern.keywords?.map((kw, idx) => (
                <span
                  key={idx}
                  className="badge bg-light text-muted me-2 mb-2 border border-secondary"
                >
                  {kw}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-end mt-2">
              <Button
                variant="success"
                className="me-2"
                onClick={() => {
                  setInternId(intern?._id);
                  setSelectedAction("edit");
                  setShowModal(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setInternId(intern?._id);
                  setSelectedAction("delete");
                  setShowModal(true);
                }}
              >
                <FaRegTrashAlt />
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  ));

  return (
    <Container>
      <div className="center-flex justify-content-end ">
        <Button
          variant="primary text-light text-end"
          onClick={() => navigate("add")}
          className="mb-3 fs-10px fs-md-14px"
        >
          Add Intern
        </Button>
      </div>

      <Row> {showInterns}</Row>

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
          disabled={indexOfLastIntern >= interns.length}
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
            handleDelete(internId);
          } else if (selectedAction === "edit") {
            navigate(`${internId}`);
          }
        }}
      />
    </Container>
  );
}
