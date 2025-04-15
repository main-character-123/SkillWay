import { useEffect, useState } from "react";
import { coursesAPI } from "../../api/Api";
import { Axios } from "../../api/axios";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import SectionsHeads from "./SectionsHeads";

export default function CoursesSection() {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    Axios.get(`${coursesAPI}`).then((res) => setCourses(res.data.courses));
  }, []);

  const coursesShow = courses.slice(0, 4).map((course, _id) => (
    <Col className="mb-4" key={_id}>
      <div className="p-3 p-md-4 bg-white h-100 d-flex flex-column justify-content-between">
        <div>
          <Card key={_id} className=" border-0">
            <Card.Img
              variant="top"
              src={
                course.images[0] ||
                `https://dummyimage.com/400x220/dfdfdfdf/ffffff&text=${course.name}`
              }
              style={{
                maxHeight: "300px",
              }}
            />
          </Card>

          <div className="between-flex flex-wrap py-2">
            <div className="py-2">
              <span className="me-2 py-2 px-3 border rounded-3 fs-14px">
                {course.duration}
              </span>
              <span className="py-2 px-3 border rounded-3 fs-14px">
                {course.level}
              </span>
            </div>

            <div className="fw-bold p-2 fs-14px">By {course.author?.name}</div>
          </div>
        </div>

        <div className="d-flex flex-column">
          <div>
            <h3 className="w-100 ">{course.name}</h3>
            <p className="my-1 ">{course.description}</p>
          </div>
          <Link to={`courses/${course._id}`} className="my-3 ">
            <Button className="btn-info border w-sm-100 w-md-100">
              Get it Now
            </Button>
          </Link>
        </div>
      </div>
    </Col>
  ));

  return (
    <div className="mt-5">
      <SectionsHeads
        id="courses"
        title="Our Courses"
        to="/courses"
        content={
          <Button className="btn-white border w-sm-100 m-0">View All</Button>
        }
        description="Explore our wide range of practical, hands-on courses designed to help you grow and succeed."
      />

      <Row xs={1} lg={2}>
        {coursesShow}
      </Row>
    </div>
  );
}
