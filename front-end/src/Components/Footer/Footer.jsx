import { useState } from "react";
import { Col, Container, Nav, Row, Accordion } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaFacebook,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  const [activeKey, setActiveKey] = useState(null);
  const navigate = useNavigate();

  const toggleAccordion = (key) => {
    setActiveKey(activeKey === key ? null : key);
  };

  // handle navigation and scrolling
  const handleNavigation = (path, section) => {
    navigate(path);
    setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        const yOffset = -80; // Adjust this based on navbar height
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <footer className="bg-light text-center py-4 mt-auto shadow-sm">
      <Container>
        <Row className="align-items-center flex-column flex-lg-row text-lg-start">
          {/* Logo and Contact (Reach For Us) */}
          <Col lg={3} className="mb-4 mb-lg-0">
            <div className="d-flex justify-content-center justify-content-lg-start">
              <img src={`/Assets/Logo.png`} alt="Logo" width="50" height="50" />
            </div>
            <h6 className="fw-bold mt-3">Reach For Us</h6>
            <div className="d-flex flex-column gap-2 text-muted">
              <a
                href="mailto:someone@example.com"
                className="text-decoration-none"
              >
                <FaEnvelope className="me-2" /> academicguidancee@gmail.com
              </a>
              <a href="tel:+201234567890" className="text-decoration-none">
                <FaPhone className="me-2" /> +20 120 761 3745
              </a>
              <a
                href="https://www.google.com/maps/search/?q=Cairo,Egypt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                <FaMapMarkerAlt className="me-2" /> Cairo, Egypt
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={3}>
            <Accordion activeKey={activeKey} className="d-lg-none">
              <Accordion.Item eventKey="0">
                <Accordion.Header onClick={() => toggleAccordion("0")}>
                  Quick Links
                </Accordion.Header>
                <Accordion.Body>
                  <Nav className="flex-column">
                    {[
                      { section: "benefits", label: "Benefits" },
                      { section: "courses", label: "Our Courses" },
                      { section: "testimonials", label: "Testimonials" },
                      { section: "faq", label: "Our FAQ" },
                    ].map(({ section, label }) => (
                      <Nav.Link
                        key={section}
                        onClick={() => handleNavigation("/", section)}
                        className="text-muted cursor-pointer"
                      >
                        {label}
                      </Nav.Link>
                    ))}
                  </Nav>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            {/* Desktop Quick Links */}
            <div className="d-none d-lg-flex flex-column">
              <h6 className="fw-bold">Quick Links</h6>
              {[
                { section: "benefits", label: "Benefits" },
                { section: "courses", label: "Our Courses" },
                { section: "testimonials", label: "Testimonials" },
                { section: "faq", label: "Our FAQ" },
              ].map(({ section, label }) => (
                <Nav.Link
                  key={section}
                  onClick={() => handleNavigation("/", section)}
                  className="text-muted cursor-pointer"
                >
                  {label}
                </Nav.Link>
              ))}
            </div>
          </Col>

          {/* Company Links */}
          <Col lg={3}>
            <Accordion activeKey={activeKey} className="d-lg-none">
              <Accordion.Item eventKey="1">
                <Accordion.Header onClick={() => toggleAccordion("1")}>
                  Company
                </Accordion.Header>
                <Accordion.Body>
                  <Nav className="flex-column">
                    {[
                      { section: "company", label: "Company" },
                      { section: "achievements", label: "Achievements" },
                      { section: "goal", label: "Our Goal" },
                    ].map(({ section, label }) => (
                      <Nav.Link
                        key={section}
                        onClick={() => handleNavigation("/about", section)}
                        className="text-muted cursor-pointer"
                      >
                        {label}
                      </Nav.Link>
                    ))}
                  </Nav>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            {/* Desktop Company Links */}
            <div className="d-none d-lg-flex flex-column">
              <h6 className="fw-bold">Company</h6>
              {[
                { section: "company", label: "Company" },
                { section: "achievements", label: "Achievements" },
                { section: "goal", label: "Our Goal" },
              ].map(({ section, label }) => (
                <Nav.Link
                  key={section}
                  onClick={() => handleNavigation("/about", section)}
                  className="text-muted cursor-pointer"
                >
                  {label}
                </Nav.Link>
              ))}
            </div>
          </Col>

          {/* Social Media */}
          <div className="mt-4 mt-lg-0 col-lg-3 col">
            <h6 className="fw-bold text-center mb-3">Follow Us</h6>
            <div className="center-flex gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                className="btn btn-secondary p-2  center-flex fs-4 "
                rel="noreferrer"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.twitter.com/"
                target="_blank"
                className="btn btn-secondary p-2  center-flex fs-4 "
                rel="noreferrer"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                className="btn btn-secondary p-2  center-flex fs-4 "
                rel="noreferrer"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </Row>

        {/* Copyright */}
        <p className="mb-0 mt-4 text-muted">
          © 2025 SkillWay. All Rights Reserved.
        </p>
      </Container>
    </footer>
  );
}
