import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { BiDumbbell } from "react-icons/bi";
import { LuMedal } from "react-icons/lu";
import { MdBackpack } from "react-icons/md";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBook,
  FaCrown,
  FaLightbulb,
  FaShieldAlt,
  FaTheaterMasks,
} from "react-icons/fa";

export default function About() {
  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Row id="company">
          <div className="d-flex justify-content-between align-items-center my-5 flex-wrap text-center text-md-start">
            <h1 className="col-md-6 col-12">About SkillWay</h1>
            <p className="col-md-6 col-12">
              Welcome to our platform, where we are passionate about empowering
              individuals to master the world of design and development. We
              offer a wide range of online courses designed to equip learners
              with the skills and knowledge needed to succeed in the
              ever-evolving digital landscape.
            </p>
          </div>
        </Row>

        {/* Achievements */}
        <Row className="mt-5 center-flex" id="achievements">
          <div className="text-center text-md-start">
            <h1>Achievements</h1>
            <p>
              Our commitment to excellence has led us to achieve significant
              milestones along our journey. Here are some of our notable
              achievements
            </p>
          </div>

          <Row xs={1} lg={2} className="mt-3">
            <Col className="mb-4">
              <Card className="p-4 shadow-sm text-start h-100 border-0 ">
                <span className="fs-1 text-start mb-3 text-primary">
                  <FaCrown />
                </span>
                <Card.Title className="mb-2">Trusted by Thousands</Card.Title>
                <Card.Text>
                  We have successfully served thousands of students, helping
                  them unlock their potential and achieve their career goals.
                </Card.Text>
              </Card>
            </Col>

            <Col className="mb-4">
              <Card className="p-4 shadow-sm text-start h-100 border-0 ">
                <span className="fs-1 text-start mb-3 text-primary">
                  <LuMedal />
                </span>
                <Card.Title className="mb-2">Award-Winning Courses</Card.Title>
                <Card.Text>
                  Our courses have received recognition and accolades in the
                  industry for their quality, depth of content, and effective
                  teaching methodologies.
                </Card.Text>
              </Card>
            </Col>

            <Col className="mb-4">
              <Card className="p-4 shadow-sm text-start h-100 border-0 ">
                <span className="fs-1 text-start mb-3 text-primary">
                  <FaTheaterMasks />
                </span>
                <Card.Title className="mb-2">
                  Positive Student Feedback
                </Card.Title>
                <Card.Text>
                  We take pride in the positive feedback we receive from our
                  students, who appreciate the practicality and relevance of our
                  course materials.
                </Card.Text>
              </Card>
            </Col>

            <Col className="mb-4">
              <Card className="p-4 shadow-sm text-start h-100 border-0 ">
                <span className="fs-1 text-start mb-3 text-primary">
                  <FaShieldAlt />
                </span>
                <Card.Title className="mb-2">Industry Partnerships</Card.Title>
                <Card.Text>
                  We have established strong partnerships with industry leaders,
                  enabling us to provide our students with access to the latest
                  tools and technologies
                </Card.Text>
              </Card>
            </Col>
          </Row>
        </Row>

        {/* Goals */}
        <Row className="mt-5 center-flex" id="goal">
          <div className="text-center text-md-start">
            <h1>Our Goals</h1>
            <p>
              At SkillWay, our goal is to empower individuals from all
              backgrounds to thrive in the world of design and development. We
              believe that education should be accessible and transformative,
              enabling learners to pursue their passions and make a meaningful
              impact. Through our carefully crafted courses, we aim to
            </p>
          </div>

          <Row xs={1} lg={2} className="mt-3">
            <Col className="mb-4">
              <Card className="p-4 shadow-sm text-start h-100 border-0 ">
                <span className="fs-1 text-start mb-3 text-primary">
                  <MdBackpack />
                </span>
                <Card.Title className="mb-2">
                  Provide Practical Skills
                </Card.Title>
                <Card.Text>
                  We focus on delivering practical skills that are relevant to
                  the current industry demands. Our courses are designed to
                  equip learners with the knowledge and tools needed to excel in
                  their chosen field.
                </Card.Text>
              </Card>
            </Col>

            <Col className="mb-4">
              <Card className="p-4 shadow-sm text-start h-100 border-0 ">
                <span className="fs-1 text-start mb-3 text-primary">
                  <FaBook />
                </span>
                <Card.Title className="mb-2">
                  Foster Creative Problem-Solving
                </Card.Title>
                <Card.Text>
                  We encourage creative thinking and problem-solving abilities,
                  allowing our students to tackle real-world challenges with
                  confidence and innovation.
                </Card.Text>
              </Card>
            </Col>

            <Col className="mb-4">
              <Card className="p-4 shadow-sm text-start h-100 border-0 ">
                <span className="fs-1 text-start mb-3 text-primary">
                  <BiDumbbell />
                </span>
                <Card.Title className="mb-2">
                  Promote Collaboration and Community
                </Card.Title>
                <Card.Text>
                  We believe in the power of collaboration and peer learning.
                  Our platform fosters a supportive and inclusive community
                  where learners can connect, share insights, and grow together.
                </Card.Text>
              </Card>
            </Col>

            <Col className="mb-4">
              <Card className="p-4 shadow-sm text-start h-100 border-0 ">
                <span className="fs-1 text-start mb-3 text-primary">
                  <FaLightbulb />
                </span>
                <Card.Title className="mb-2">
                  Stay Ahead of the Curve
                </Card.Title>
                <Card.Text>
                  The digital landscape is constantly evolving, and we strive to
                  stay at the forefront of industry trends. We regularly update
                  our course content to ensure our students receive the latest
                  knowledge and skills.
                </Card.Text>
              </Card>
            </Col>
          </Row>
        </Row>

        <Row className="my-5">
          <div
            className="between-flex flex-column flex-lg-row bg-white p-5 position-relative"
            style={{ zIndex: "1" }}
          >
            <img
              style={{ zIndex: "-1", height: "240px" }}
              className="position-absolute top-0 start-50 d-none d-lg-block "
              src={`/Assets/about-us/Abstract Design.png`}
              alt=""
            />
            <div>
              <h2 className="fs-1">
                <span className="text-primary">Together</span>, let's shape the
                future of digital <br /> innovation
              </h2>
              <p>
                Join us on this exciting learning journey and unlock your
                potential in design and development.
              </p>
            </div>
            <Link to="/tracks" className="my-3 ">
              <Button variant="primary" className="text-light">
                Join Now
              </Button>
            </Link>
          </div>
        </Row>
      </motion.div>
    </Container>
  );
}
