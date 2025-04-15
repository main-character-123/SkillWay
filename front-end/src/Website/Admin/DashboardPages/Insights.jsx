import React, { useEffect, useState } from "react";
import { Row, Col, Card, Container } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import { Axios } from "../../../api/axios";
import { coursesAPI, usersAPI } from "../../../api/Api";

const Insights = () => {
  const [students, setStudents] = useState([]);
  const [coursesCount, setCoursesCount] = useState(0);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchUsers();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await Axios.get(coursesAPI);
      setCoursesCount(data.courses.length);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await Axios.get(`${usersAPI}`);
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    const filtered = users.filter((user) => user.role === "student"); // Make sure "student" matches your data
    setStudents(filtered);
  }, [users]);

  // Calculate the total number of students and gender-based age distribution
  const totalStudents = students.length;
  const genderAgeData = students.reduce((acc, student) => {
    const { gender, age } = student;
    if (!acc[age]) acc[age] = { male: 0, female: 0 };

    if (gender === "male") acc[age].male += 1;
    if (gender === "female") acc[age].female += 1;

    return acc;
  }, {});

  // Convert the genderAgeData into an array for the chart
  const chartData = Object.entries(genderAgeData).map(([age, counts]) => ({
    age: age,
    male: counts.male,
    female: counts.female,
  }));

  return (
    <Container>
      {/* First Section with Total Students and Courses Number */}
      <Row className="mb-4">
        <Col sm={12} md={6} lg={6}>
          <Card className="text-center mb-3 p-4">
            <Card.Body>
              <h5>Total Students</h5>
              <h3>{totalStudents}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={12} md={6} lg={6}>
          <Card className="text-center mb-3 p-4">
            <Card.Body>
              <h5>Total Courses</h5>
              <h3>{coursesCount}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Second Section with BarChart based on Gender & Age */}
      <Row>
        <Col sm={12}>
          <Card className="p-4 ">
            <Card.Body height={400}>
              <h5 className="text-center mb-4">Students by Gender and Age</h5>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={chartData}
                  barSize={30}
                  margin={{ top: 20, right: 50, left: 50, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age">
                    <Label value="Age" offset={-10} position="insideBottom" />
                  </XAxis>
                  <YAxis
                    type="number"
                    tickFormatter={(tick) => Math.floor(tick)}
                  >
                    <Label
                      value="Count"
                      angle={-90}
                      position="insideLeft"
                      offset={-5}
                    />
                  </YAxis>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f5f5f5",
                      border: "1px solid #ccc",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      top: 0,
                      left: "auto",
                      right: 0,
                      position: "absolute",
                      paddingTop: 20,
                    }}
                    layout="vertical"
                    align="right"
                  />
                  <Bar
                    dataKey="male"
                    fill="#0088FE"
                    name="Male"
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar
                    dataKey="female"
                    fill="#FF8042"
                    name="Female"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Insights;
