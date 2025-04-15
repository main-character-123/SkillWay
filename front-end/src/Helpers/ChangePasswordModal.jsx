import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Axios } from "../api/axios";
import { updatePasswordApi } from "../api/Api";
import { toast } from "react-toastify";

export default function ChangePasswordModal({ show, onClose }) {
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/\d/, "Must contain at least one number")
      .matches(/[\W_]/, "Must contain at least one special character"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords do not match")
      .required("Confirm your new password"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const { oldPassword, newPassword } = values;
    setLoading(true);
    try {
      await Axios.patch(updatePasswordApi, { oldPassword, newPassword });
      toast.success("Password updated successfully!");
      resetForm();
      onClose();
    } catch (err) {
      console.error("Error updating password:", err);
      toast.error(err?.response?.data?.error || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <FormikForm>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <div className="d-flex">
                <Field
                  name="oldPassword"
                  type={showCurrent ? "text" : "password"}
                  className="form-control"
                  disabled={loading}
                />
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="ms-2"
                >
                  {showCurrent ? "Hide" : "Show"}
                </Button>
              </div>
              <ErrorMessage
                name="oldPassword"
                component="div"
                className="text-danger small"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <div className="d-flex">
                <Field
                  name="newPassword"
                  type={showNew ? "text" : "password"}
                  className="form-control"
                  disabled={loading}
                />
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="ms-2"
                >
                  {showNew ? "Hide" : "Show"}
                </Button>
              </div>
              <ErrorMessage
                name="newPassword"
                component="div"
                className="text-danger small"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Confirm New Password</Form.Label>
              <div className="d-flex">
                <Field
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  className="form-control"
                  disabled={loading}
                />
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="ms-2"
                >
                  {showConfirm ? "Hide" : "Show"}
                </Button>
              </div>
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-danger small"
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="danger" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? "Updating..." : "Confirm"}
            </Button>
          </Modal.Footer>
        </FormikForm>
      </Formik>
    </Modal>
  );
}
