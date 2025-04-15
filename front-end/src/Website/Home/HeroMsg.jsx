import { Button } from "react-bootstrap";
import { FaBolt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function HeroMsg() {
  const navigate = useNavigate();
  return (
    <div className="center-flex flex-column text-center">
      <h1 className="d-inline-block py-3 px-2 bg-light my-4">
        <FaBolt /> <span className="text-primary">Unlock</span> Your Creative
        Potential
      </h1>
      <h2 className="mb-3">with Online Design and Development Courses.</h2>
      <p>Learn from Industry Experts and Enhance Your Skills.</p>

      <Button
        variant="primary "
        className="d-inline-block text-light fw-bold"
        onClick={() => navigate("/courses")}
      >
        Explore Courses
      </Button>
    </div>
  );
}
