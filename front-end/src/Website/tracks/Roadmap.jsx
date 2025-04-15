import { useLocation } from "react-router-dom";
import { Card, Container, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import Breadcrumbs from "../../Components/BreadCrumbs/BreadCrumbs";

export default function Roadmap() {
  const location = useLocation();
  const track = location.state?.track;

  if (!track || !track.sections) {
    return <p>Track not found or no roadmap available.</p>;
  }

  return (
    <Container className="my-5">
      <Breadcrumbs title={track.name} />
      <h2 className="text-center text-dark mb-5">{track.name}</h2>
      <p className="text-center mb-4 text-muted">{track.description}</p>

      {/* Iterate over each section */}
      {track.sections.map((section, sectionIndex) => (
        <motion.div
          key={section._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: sectionIndex * 0.2 }}
        >
          <Card className="border-0 bg-light shadow-lg rounded-4 mb-5">
            <Card.Header
              className="bg-primary text-white text-uppercase fw-bold fs-5 py-3"
              style={{
                backgroundColor: "#1a73e8", // Stronger contrast header background
              }}
            >
              {section.name}
            </Card.Header>
            <Card.Body className="p-4">
              {/* Iterate over each step within the section */}
              {section.content.map((step, stepIndex) => (
                <motion.div
                  key={step._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: sectionIndex * 0.2 + stepIndex * 0.1,
                  }}
                >
                  <Card className="border-0 bg-white shadow-sm mb-3 rounded-3">
                    <Card.Body className="p-4 d-flex justify-content-between flex-md-row flex-column gap-3">
                      <h5 className="card-title text-dark">{step.title}</h5>
                      <Button
                        variant="dark"
                        href={step.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2"
                      >
                        Learn More
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))}
            </Card.Body>
          </Card>
        </motion.div>
      ))}
    </Container>
  );
}
