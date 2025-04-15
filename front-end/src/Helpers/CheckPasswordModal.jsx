import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { Axios } from "../api/axios";
import { checkPasswordApi } from "../api/Api";
import { toast } from "react-toastify";

const CheckPasswordModal = ({ show, onHide, onSuccess }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true); // Start with loading state
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track authentication state
  const [actionInProgress, setActionInProgress] = useState(false); // Action being performed after verification

  // Check if 5 minutes have passed since last authentication
  const isTimePassed = () => {
    const lastAuthenticated = localStorage.getItem("lastAuthenticated");
    if (!lastAuthenticated) return true; // No record means time to re-authenticate
    const timeElapsed = Date.now() - parseInt(lastAuthenticated, 10);
    return timeElapsed > 5 * 60 * 1000; // 5 minutes
  };

  // Initialize the modal based on the authentication state
  useEffect(() => {
    if (show) {
      const expired = isTimePassed();
      if (expired) {
        setIsAuthenticated(false); // Prompt for password
      } else {
        setIsAuthenticated(true); // Automatically authenticate
      }
      setLoading(false); // End loading state once checked
    }
  }, [show]);

  // Handle the password verification
  const handleVerify = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple clicks

    setLoading(true);
    try {
      const { data } = await Axios.post(checkPasswordApi, { password });
      if (data.success) {
        localStorage.setItem("lastAuthenticated", Date.now().toString());
        toast.success("Verified Successfully");
        setIsAuthenticated(true);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handle the action after authentication
  const handleAction = () => {
    setActionInProgress(true);
    setTimeout(() => {
      onSuccess();
      setActionInProgress(false);
      onHide();
    }, 1000);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Critical Action</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
            <p>Checking...</p>
          </div>
        ) : isAuthenticated === null ? (
          <div className="text-center">
            <p>Unexpected error occurred. Please try again.</p>
          </div>
        ) : isAuthenticated === false ? (
          <>
            <p className="text-dark">
              Please enter your password to confirm this action.
            </p>
            <Form onSubmit={handleVerify}>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </Form.Group>
            </Form>
          </>
        ) : (
          <div className="text-center">
            <p className="text-success fw-bold">
              Verified Successfully! Click below to proceed.
            </p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {isAuthenticated === false ? (
          <Button
            variant="success"
            onClick={handleVerify}
            disabled={loading || actionInProgress}
          >
            {loading ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              "Verify"
            )}
          </Button>
        ) : null}
        <Button
          variant="secondary"
          onClick={onHide}
          disabled={actionInProgress}
        >
          Cancel
        </Button>
        {isAuthenticated ? (
          <Button
            variant="success"
            onClick={handleAction}
            disabled={actionInProgress}
          >
            {actionInProgress ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              "Proceed"
            )}
          </Button>
        ) : null}
      </Modal.Footer>
    </Modal>
  );
};

export default CheckPasswordModal;
