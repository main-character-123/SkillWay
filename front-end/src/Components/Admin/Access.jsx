import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 text-center">
      <div>
        <h1 className="display-4 text-danger">Access Denied</h1>
        <p className="lead">
          You do not have permission to access this page. Please contact your
          administrator.
        </p>
        <Button variant="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    </Container>
  );
};

export default AccessDenied;
