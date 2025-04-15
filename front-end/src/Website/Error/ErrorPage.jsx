import React from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

export default function ErrorPage() {
  return (
    <Container className="text-center center-flex flex-column vh-100">
      <h1 className="display-3 fw-bold text-danger">404</h1>
      <h2 className="mb-3">Oops! Page Not Found</h2>
      <p className="text-muted">The page you're looking for doesn't exist.</p>
      <Link to="/">
        <Button variant="primary">Go Home</Button>
      </Link>
    </Container>
  );
}
