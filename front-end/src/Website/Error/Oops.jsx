import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Oops() {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
        color: "#fff",
      }}
    >
      <motion.div
        className="text-center p-5 rounded shadow-lg"
        style={{
          maxWidth: "500px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: "15px",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4">Oops, You're not signed in!</h2>
        <p className="fs-5 mb-4">
          To access this page, you need to sign in first. Let's get you back on
          track!
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate("/auth/login")}
          style={{
            padding: "10px 30px",
            fontSize: "18px",
            borderRadius: "25px",
          }}
        >
          Sign In
        </Button>
      </motion.div>
    </div>
  );
}
