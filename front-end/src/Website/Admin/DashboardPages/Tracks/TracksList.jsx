import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { FaRegTrashAlt } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CheckPasswordModal from "../../../../Helpers/CheckPasswordModal";

export default function TracksList() {
  const { tracks, handleDelete } = useOutletContext();
  const navigate = useNavigate();
  const [trackId, setTrackId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tracksPerPage = 6; // Number of tracks to display per page

  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  // Calculate the index of the first and last track on the current page
  const indexOfLastTrack = currentPage * tracksPerPage;
  const indexOfFirstTrack = indexOfLastTrack - tracksPerPage;
  const currentTracks = tracks.slice(indexOfFirstTrack, indexOfLastTrack);

  // Show skeleton until tracks are loaded
  if (!tracks || tracks.length === 0 || tracks === undefined) {
    return (
      <Container>
        <div className="center-flex justify-content-end ">
          <Button
            variant="primary text-light text-end"
            onClick={() => navigate("add")}
            className="mb-3 fs-10px fs-md-14px"
          >
            Add Track
          </Button>
        </div>
        <Row>
          {[...Array(6)].map((_, index) => (
            <Col xs={12} md={6} key={index} className="mb-4">
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="text-start mb-3">
                    <Skeleton width="50%" height={24} />
                  </Card.Title>
                  <Card.Text className="text-start">
                    <Skeleton count={2} width="100%" />
                  </Card.Text>
                  <div className="d-flex justify-content-between pt-3">
                    <Skeleton width={80} height={36} />
                    <Skeleton width={40} height={36} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
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
          Add Track
        </Button>
      </div>

      <Row>
        {currentTracks.map((track, i) => (
          <Col xs={12} md={6} key={i} className="mb-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <Card.Title className="mb-3 fw-semibold">
                  [{` Track-${i + 1} `}] {track.name}
                </Card.Title>
                <Card.Text className="text-muted text-truncate ps-3">
                  {track.description}
                </Card.Text>
                <div className="between-flex mt-2">
                  <Button
                    variant="success"
                    onClick={() => {
                      setTrackId(track?._id);
                      setSelectedAction("edit");
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setTrackId(track?._id);
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
            disabled={indexOfLastTrack >= tracks.length}
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
              handleDelete(trackId);
            } else if (selectedAction === "edit") {
              navigate(`${trackId}`);
            }
          }}
        />
      </Row>
    </Container>
  );
}
