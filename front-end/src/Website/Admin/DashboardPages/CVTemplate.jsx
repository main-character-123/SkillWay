import { useState } from "react";
import { Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
import { Axios } from "../../../api/axios";
import { uploadTemplateAPI } from "../../../api/Api";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function CVTemplate() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("template", file);

    try {
      await Axios.post(uploadTemplateAPI, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Template uploaded successfully!");
      setFile(null); // Clear the file input after upload
    } catch (err) {
      toast.error("Failed to upload template.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-center mb-4 text-primary">Upload CV Template</h2>

        {/* File Upload Form */}
        <Form onSubmit={handleUpload}>
          <Col>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Select CV Template (PDF, DOCX, etc.)</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc"
                required
              />
            </Form.Group>
          </Col>

          <Col className="center-flex">
            <Button
              type="submit"
              variant="primary text-light"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Template"}
            </Button>
          </Col>
        </Form>
      </motion.div>
    </Container>
  );
}
