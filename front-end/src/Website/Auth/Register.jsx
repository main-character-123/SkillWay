import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import {
  Button,
  Form,
  InputGroup,
  Spinner,
  Row,
  Col,
  Modal,
  ToastContainer,
  Toast,
} from "react-bootstrap";
import {
  FaCheckCircle,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
  FaVenusMars,
} from "react-icons/fa";
import { Axios } from "../../api/axios";
import { registerAPI } from "../../api/Api";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import countries from "world-countries";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Convert country data to { value, label } format with flag
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

  // Validation Schema
  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/\d/, "Must contain at least one number")
      .matches(/[\W_]/, "Must contain at least one special character")
      .required("Password is required"),
    gender: yup
      .string()
      .oneOf(["male", "female", "other"])
      .required("Gender is required"),
    age: yup
      .number()
      .min(18, "Must be 18 or older")
      .required("Age is required"),
    country: yup.string().required("Country is required"),
  });

  // Function to handle API registration request
  const handleRegister = async (values) => {
    setLoading(true);
    setErrorMessage("");
    setShowSuccessModal(false);

    try {
      const response = await Axios.post(registerAPI, values);
      console.log(response);

      if (response.status !== 201) {
        throw new Error("Register failed");
      }

      setShowSuccessModal(true);

      navigate("/auth/login");
    } catch (error) {
      setErrorMessage(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      validationSchema={schema}
      initialValues={{
        name: "",
        email: "",
        password: "",
        gender: "",
        age: "",
        country: "",
      }}
      onSubmit={handleRegister}
    >
      {({
        handleSubmit,
        handleChange,
        setFieldValue,
        values,
        touched,
        errors,
      }) => (
        <Form
          noValidate
          onSubmit={handleSubmit}
          className="w-100"
          style={{ maxWidth: "400px" }}
        >
          {/* Success Modal */}
          <Modal
            show={showSuccessModal}
            onHide={() => setShowSuccessModal(false)}
            centered
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body className="text-center p-4">
              <FaCheckCircle color="#28a745" size={60} className="mb-3" />
              <h4 className="fw-bold">Registration Successful!</h4>
              <p className="text-muted">You will be redirected shortly...</p>
              <Button
                variant="success"
                className="w-100 mt-3"
                onClick={() => navigate("/auth/login")}
              >
                Go to Login
              </Button>
            </Modal.Body>
          </Modal>

          {/* Name Field */}
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text>
                <FaUser />
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your name"
                value={values.name}
                onChange={handleChange}
                isInvalid={touched.name && !!errors.name}
                isValid={touched.name && !errors.name}
              />
            </InputGroup>

            {/* Error or Success Message */}
            <div style={{ minHeight: "25px", marginLeft: "42px" }}>
              {errors.name && touched.name ? (
                <small className="text-danger">{errors.name}</small>
              ) : touched.name ? (
                <small className="text-success">Looks good!</small>
              ) : null}
            </div>
          </Form.Group>

          {/* Email Field */}
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text>
                <FaEnvelope />
              </InputGroup.Text>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={values.email}
                onChange={handleChange}
                isInvalid={touched.email && !!errors.email}
                isValid={touched.email && !errors.email}
              />
            </InputGroup>
            <div style={{ minHeight: "25px", marginLeft: "42px" }}>
              {errors.email && touched.email ? (
                <small className="text-danger">{errors.email}</small>
              ) : touched.email ? (
                <small className="text-success">Looks good!</small>
              ) : null}
            </div>
          </Form.Group>

          {/* Password Field */}
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text>
                <FaLock />
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                isInvalid={touched.password && !!errors.password}
                isValid={touched.password && !errors.password}
              />
              <Button
                variant="outline-secondary"
                onClick={togglePasswordVisibility}
                type="button"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
            <div style={{ minHeight: "25px", marginLeft: "42px" }}>
              {errors.password && touched.password ? (
                <small className="text-danger">{errors.password}</small>
              ) : touched.password ? (
                <small className="text-success">Looks good!</small>
              ) : null}
            </div>
          </Form.Group>

          {/* Gender & Age Fields next to each other  */}
          <Row>
            <Col xs={6}>
              <Form.Group>
                <Form.Label>Gender</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text>
                    <FaVenusMars />
                  </InputGroup.Text>
                  <Form.Select
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                    isInvalid={touched.gender && !!errors.gender}
                    isValid={touched.gender && !errors.gender}
                  >
                    <option value="" disabled>
                      ...
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Form.Select>
                </InputGroup>
                <div style={{ minHeight: "25px", marginLeft: "42px" }}>
                  {errors.gender && touched.gender ? (
                    <small className="text-danger">{errors.gender}</small>
                  ) : touched.gender ? (
                    <small className="text-success">Looks good!</small>
                  ) : null}
                </div>
              </Form.Group>
            </Col>

            <Col xs={6}>
              <Form.Group>
                <Form.Label>Age</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="number"
                    name="age"
                    placeholder="Enter your age"
                    value={values.age}
                    onChange={handleChange}
                    isInvalid={touched.age && !!errors.age}
                    isValid={touched.age && !errors.age}
                  />
                </InputGroup>
                <div style={{ minHeight: "25px" }}>
                  {errors.age && touched.age ? (
                    <small className="text-danger">{errors.age}</small>
                  ) : touched.age ? (
                    <small className="text-success">Looks good!</small>
                  ) : null}
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* Country Field */}
          <Form.Group>
            <Form.Label>Country</Form.Label>
            <Select
              options={countryOptions}
              name="country"
              placeholder="Select your country"
              value={countryOptions.find(
                (option) => option.value === values.country
              )}
              onChange={(option) => setFieldValue("country", option.value)}
              className={`w-100 ${
                touched.country && errors.country ? "is-invalid" : ""
              }`}
            />

            {/* Inline Error Message Below */}
            <div style={{ minHeight: "25px" }}>
              {errors.country && touched.country ? (
                <small className="text-danger">{errors.country}</small>
              ) : touched.country ? (
                <small className="text-success">Looks good!</small>
              ) : null}
            </div>
          </Form.Group>

          {/* Submit Button */}
          <Button
            variant="primary text-light"
            type="submit"
            className="w-100 fw-semibold my-3"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Register"}
          </Button>

          {/* Error Message */}
          <ToastContainer position="bottom-center" className="p-3">
            <Toast
              show={!!errorMessage}
              onClose={() => setErrorMessage("")}
              bg="danger"
              autohide
              delay={3000}
            >
              <Toast.Body className="text-white text-center">
                {errorMessage}
              </Toast.Body>
            </Toast>
          </ToastContainer>
        </Form>
      )}
    </Formik>
  );
}
