import { Container, Row } from "react-bootstrap";
import Testimonials from "../../Components/Testimonials/Testimonials";
import Benefits from "../../Components/Benefits/Benefits";
import HeroMsg from "./HeroMsg";
import CoursesSection from "./CoursesSection";
import SectionsHeads from "./SectionsHeads";
import { motion } from "framer-motion";
import { Img } from "react-image";
import Skeleton from "react-loading-skeleton";

export default function Home() {
  return (
    <Container className="my-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeroMsg />
        {/* Hero Video STATIC */}
        <Row className="my-5">
          <Img
            src={`/Assets/hero.jpg`}
            alt="hero"
            loader={<Skeleton height={600} />}
            decoding="async"
            loading="lazy"
            className="rounded-3 w-100"
          />
        </Row>

        {/* Benefits Section API */}
        <SectionsHeads
          id="benefits"
          title="Benefits"
          content={<Benefits layout="modal" />}
          description="Discover the advantages of learning with us - expert instructors, flexible learning, and real-world skills."
        />
        <Benefits layout="grid" />

        <CoursesSection />

        {/* Testimonials Section API */}
        <SectionsHeads
          id="testimonials"
          title="Our Testimonials"
          content={<Testimonials layout="modal" />}
          description="Hear from our students - real stories of growth, success, and transformation."
        />
        <Testimonials layout="grid" />
      </motion.div>
    </Container>
  );
}
