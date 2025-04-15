import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { Axios } from "../../../../api/axios";
import {
  usersAPI,
  updateUserApi,
  registerAPI,
  updateRoleApi,
} from "../../../../api/Api";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  Card,
  InputGroup,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import Select from "react-select";
import countries from "world-countries";

// Helper: convert country code to emoji flag
const countryOptions = countries.map((country) => ({
  value: country.cca2, // Country code (e.g., US, EG)
  label: (
    <div className="d-flex align-items-center">
      <img
        src={`https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`}
        alt={country.name.common}
        width="20"
        className="me-2"
      />
      {country.name.common}
    </div>
  ),
}));

export default function UserForm() {
  const [isEdit, setIsEdit] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: "",
    role: "",
    gender: "",
    country: "",
    age: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { setRefreshKey } = useOutletContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      Axios.get(`${usersAPI}/${id}`)
        .then((res) => setInitialValues(res.data.user))
        .catch(() => toast.error("Failed to load user data"));
    }
  }, [id]);

  // Validation Schema
  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: isEdit
      ? yup.string() // No password validation for editing
      : yup
          .string()
          .min(8, "Password must be at least 8 characters")
          .matches(/[A-Z]/, "Must contain at least one uppercase letter")
          .matches(/[a-z]/, "Must contain at least one lowercase letter")
          .matches(/\d/, "Must contain at least one number")
          .matches(/[\W_]/, "Must contain at least one special character")
          .required("Password is required"),
    gender: yup
      .string()
      .oneOf(["male", "female"])
      .required("Gender is required"),
    age: yup
      .number()
      .min(18, "Must be 18 or older")
      .required("Age is required"),
    country: yup.string().required("Country is required"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const { role, isAdmin, ...userData } = values;
      if (isEdit) {
        toast.info("Updating User...");
        await Axios.patch(`${updateUserApi}/${id}`, userData);
        toast.success("User updated successfully!");
      } else {
        toast.info("Adding User...");
        await Axios.post(registerAPI, userData);
        toast.success("User added successfully!");
      }

      if (values.role !== initialValues.role) {
        const newRoleData = {
          role: values.role,
          isAdmin: values.role !== "student", // Determine isAdmin based on the role
        };
        await Axios.post(`${updateRoleApi}/${id}`, newRoleData);
        toast.success("User role updated successfully!");
      }

      setRefreshKey((prev) => prev + 1);
      navigate("/dashboard/users");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-lg border-0">
        <Card.Body>
          <h3 className="text-center mb-4 fw-bold text-primary">
            {isEdit ? "Edit User" : "Add User"}
          </h3>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleSubmit,
              handleChange,
              setFieldValue,
              values,
              touched,
              errors,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group htmlFor="name" className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        id="name"
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        isInvalid={touched.name && !!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group htmlFor="email" className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        id="email"
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        isInvalid={touched.email && !!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {!isEdit && (
                    <Col md={6}>
                      <Form.Group htmlFor="password" className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            isInvalid={touched.password && !!errors.password}
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </Button>
                          <Form.Control.Feedback type="invalid">
                            {errors.password}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  )}

                  {isEdit && (
                    <Col md={6}>
                      <Form.Group htmlFor="role" className="mb-3">
                        <Form.Label>User Role</Form.Label>
                        <Form.Select
                          id="role"
                          name="role"
                          value={values.role}
                          onChange={handleChange}
                          isInvalid={touched.role && !!errors.role}
                        >
                          <option value="">Select Role</option>
                          <option value="superAdmin">Super Admin</option>
                          <option value="student">Student</option>
                          <option value="cvAdmin">CV Admin</option>
                          <option value="trackAdmin">Track Admin</option>
                          <option value="instructor">Instructor</option>
                          <option value="superInstructor">
                            Super Instructor
                          </option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.role}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  )}

                  <Col md={6}>
                    <Form.Group htmlFor="gender" className="mb-3">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        id="gender"
                        name="gender"
                        value={values.gender}
                        onChange={handleChange}
                        isInvalid={touched.gender && !!errors.gender}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.gender}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group htmlFor="country" className="mb-3">
                      <Form.Label>Country</Form.Label>
                      <Select
                        id="country"
                        options={countryOptions}
                        name="country"
                        placeholder="Select your country"
                        value={countryOptions.find(
                          (option) => option.value === values.country
                        )}
                        onChange={(option) =>
                          setFieldValue("country", option.value)
                        }
                        className={`w-100 ${
                          touched.country && errors.country ? "is-invalid" : ""
                        }`}
                        classNamePrefix="react-select"
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.country}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group htmlFor="age" className="mb-3">
                      <Form.Label>Age</Form.Label>
                      <Form.Control
                        type="number"
                        name="age"
                        value={values.age}
                        onChange={handleChange}
                        isInvalid={touched.age && !!errors.age}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.age}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between mt-4">
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/dashboard/users")}
                    disabled={loading}
                  >
                    {loading ? "Cancelling..." : "Cancel"}
                  </Button>
                  <Button variant="success" type="submit" disabled={loading}>
                    {loading
                      ? "Saving..."
                      : isEdit
                      ? "Update User"
                      : "Add User"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </Container>
  );
}
