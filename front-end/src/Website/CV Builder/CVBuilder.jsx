import { Button, Container, Row, Col, Form, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import { Axios } from "../../api/axios";
import { downloadTemplateAPI, analyzeCvAPI } from "../../api/Api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CVBuilder() {
  const user = Cookies.get("userData");
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [cvResult, setCvResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Show and hide the modal
  const handleShow = () => {
    if (!isAuthenticated) {
      navigate("/Oops");
      return;
    }
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
    setCvFile(null);
    setCvResult(null);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleDownload = async () => {
    if (!isAuthenticated) {
      navigate("/Oops");
      return;
    }

    try {
      const response = await Axios.get(downloadTemplateAPI, {
        responseType: "blob", // Ensure the response is in blob format (for file download)
      });

      // Create a new Blob object using the response data
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "cv.pdf";
      link.click();

      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // Handle file upload and API call
  const handleUpload = async (e) => {
    e.preventDefault();

    console.log(cvFile);

    if (!cvFile) {
      toast.info("Please select a file to upload.");
      return;
    }

    toast.info("Analyzing Cv...");
    setLoading(true);
    const formData = new FormData();
    formData.append("cv", cvFile);

    try {
      const response = await Axios.post(analyzeCvAPI, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Cv analyzed successfully!");

      // Set the API response result to display in the modal
      console.log(response.data.data);
      setCvResult(response.data.data);
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast.error("Failed to analyze CV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="between-flex flex-wrap mb-5">
          <div className="col-12 col-md-5 p-5 bg-secondary rounded-circle">
            <img src="/Assets/cv builder/man.png" className="w-100" alt="man" />
          </div>
          <div className="col-12 col-md-7 text-md-start text-center px-3">
            <h2 className="fs-60px mb-4">
              Build your <span className="text-danger">perfect</span> CV
            </h2>
            <p className="fs-18px">
              Create a new standout CV in minutes or choose any template and
              simply import all the information from your existing CV.
            </p>
          </div>
        </div>

        {/* Combined Feature Card */}
        <div className="bg-secondary rounded-4 p-5">
          <Row className="align-items-center">
            {/* Left Content */}
            <Col lg={6} className="text-center text-lg-start">
              <h2 className="mb-3">Level up your career with smart CV tools</h2>
              <p className="mb-4 fs-5">
                Discover jobs that truly fit you and stand out with a
                professional, AI-enhanced resume. Our tools ensure your CV is
                tailored, clean, and recruiter-ready.
              </p>
              <div className="d-flex flex-column flex-lg-row gap-3 justify-content-center justify-content-lg-start">
                <Button
                  variant="dark"
                  className="fs-5 px-4"
                  onClick={handleShow}
                >
                  Analyze CV
                </Button>
                <Button
                  variant="outline-success"
                  className="fs-5 px-4"
                  onClick={handleDownload}
                >
                  Download Template
                </Button>
              </div>
            </Col>

            {/* Right Image */}
            <Col lg={6} className="mt-4 mt-lg-0">
              <img
                src="/Assets/cv builder/n1.png"
                className="w-100 rounded-3 shadow"
                alt="cv preview"
              />
            </Col>
          </Row>
        </div>
      </motion.div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          {cvResult ? (
            <Modal.Title className="text-success">Result!</Modal.Title>
          ) : (
            <Modal.Title>Upload Your CV</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          {cvResult ? (
            <div>
              <h5>Job Title: {cvResult.job_title}</h5>
              <hr />
              <strong>Missing Skills:</strong>
              <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
                {cvResult.missing_skills.map((skill, index) => (
                  <li className="list" key={index}>
                    {skill}
                  </li>
                ))}
              </ul>
              <hr />
              <strong>Recommended Courses:</strong>
              <ul>
                {cvResult.recommended_courses.map((course, index) => (
                  <li key={index}>
                    <a
                      href={course["YouTube URL"]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {course["Course Title"]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Form onSubmit={handleUpload}>
              <Form.Group controlId="formFile">
                <Form.Label>Select your CV</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        {!cvResult && (
          <Modal.Footer className="d-flex justify-content-end align-items-center">
            <Button
              variant="success"
              onClick={handleUpload}
              disabled={loading || !cvFile}
            >
              {loading ? "Analyzing..." : "Analyze CV"}
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </Container>
  );
}
