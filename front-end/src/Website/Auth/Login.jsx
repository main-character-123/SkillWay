import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Button, Form, InputGroup, Alert, Spinner } from "react-bootstrap";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { Axios } from "../../api/axios";
import { loginAPI } from "../../api/Api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Validation Schema
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  // Function to handle API login request
  const handleLogin = async (values) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await Axios.post(loginAPI, values);

      if (response.status !== 200) {
        throw new Error(errorMessage || "Login failed");
      }

      const { token, user } = response.data;

      // Store token in cookies
      Cookies.set("authToken", token, { expires: 7, secure: true });

      // Store user data
      Cookies.set("userData", JSON.stringify(user), { expires: 7 });

      // Store token & user in context (For UI updates)
      setAuth({ token: token, user: user });

      // Redirect to home
      user.isAdmin ? navigate("/dashboard") : navigate("/");
    } catch (error) {
      setErrorMessage(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      validationSchema={schema}
      initialValues={{ email: "", password: "" }}
      onSubmit={handleLogin}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form
          noValidate
          onSubmit={handleSubmit}
          className="w-100"
          style={{ maxWidth: "400px" }}
        >
          {/* Error Message */}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

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

          {/* Submit Button */}
          <Button
            variant="primary text-light"
            type="submit"
            className="w-100 fw-semibold my-3"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Login"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
