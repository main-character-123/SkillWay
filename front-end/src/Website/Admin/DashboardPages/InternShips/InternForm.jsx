import { useEffect, useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Axios } from "../../../../api/axios";
import { internshipsAPI } from "../../../../api/Api";
import { toast } from "react-toastify";
import ImageDropzone from "../../../../Helpers/ImageDropzone";
import ImageCropperModal from "../../../../Helpers/ImageCropperModal";
import { Img } from "react-image";
import Skeleton from "react-loading-skeleton";

export default function InternshipForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { setRefreshKey } = useOutletContext();
  const [salaryValue, setSalaryValue] = useState("");
  const [salaryUnit, setSalaryUnit] = useState("USD/month");

  const [loading, setLoading] = useState(false);
  const [intern, setIntern] = useState({
    company: "",
    duration: "",
    keywords: [],
    place: "",
    salary: "",
    sponser: "",
    link: "",
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      Axios.get(`${internshipsAPI}/${id}`)
        .then((res) => {
          const data = res.data.inter;
          setIntern(data);
          if (data.salary) {
            const [val, ...unitParts] = data.salary.split(" ");
            setSalaryValue(val);
            setSalaryUnit(unitParts.join(" "));
          }
        })
        .catch((err) => {
          console.error("Error fetching internship:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const [internImage, setInternImage] = useState(intern?.image);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    setInternImage(intern.image);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIntern({ ...intern, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedIntern = {
      ...intern,
      salary: `${salaryValue} ${salaryUnit}`,
    };
    try {
      if (isEditing) {
        toast.info("Updating Internship...");
        await Axios.patch(`${internshipsAPI}/${id}`, updatedIntern);
        toast.success("Internship updated successfully!");
        navigate("/dashboard/internships");
      } else {
        toast.info("Adding Internship...");
        const { data } = await Axios.post(internshipsAPI, updatedIntern);
        toast.success("New internship added!");
        console.log(data);

        navigate(`/dashboard/internships/${data.intern._id}`);
      }
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      toast.error("Failed to add internship!");
      console.error("Error saving internship:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelected = (file) => {
    setSelectedFile(file);
    setShowCropper(true);
  };

  const handleCroppedImage = async (croppedFile) => {
    toast.info("Uploading image...");
    const form_Data = new FormData();
    form_Data.append("image", croppedFile);
    setLoading(true);
    try {
      const { data } = await Axios.post(
        `${internshipsAPI}/add-image/${id}`,
        form_Data
      );

      setInternImage(data.intern.image);
      setIntern((prev) => ({ ...prev, image: data.intern.image }));
      toast.success("Internship Image updated!");
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Image upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4">
        <h2 className="text-start mb-4">
          {isEditing ? "Edit Internship" : "Add a New Internship"}
        </h2>
        <Form onSubmit={handleSubmit}>
          {isEditing ? (
            <div className="mt-3 center-flex flex-column text-center">
              {intern.image ? (
                <Img
                  src={internImage}
                  alt="Internship"
                  loader={<Skeleton height={240} />}
                  decoding="async"
                  loading="lazy"
                  className="rounded-3"
                  style={{ height: "220px", width: "400px" }}
                />
              ) : (
                <p>No image uploaded</p>
              )}
              <div className="mt-3 w-100" style={{ maxWidth: 400 }}>
                <ImageDropzone onImageSelected={handleImageSelected} />
              </div>
              <ImageCropperModal
                file={selectedFile}
                show={showCropper}
                onClose={() => setShowCropper(false)}
                onCropComplete={handleCroppedImage}
              />
            </div>
          ) : (
            <div className="text-center my-4 text-muted">
              <strong>Save the internship first to upload an image.</strong>
            </div>
          )}

          <div className="row">
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={intern.company}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Duration</Form.Label>
              <Form.Select
                name="duration"
                value={intern.duration}
                onChange={handleChange}
                required
              >
                <option value="">Select duration</option>
                {[...Array(6)].map((_, i) => (
                  <option
                    key={i + 1}
                    value={`${i + 1} month${i > 0 ? "s" : ""}`}
                  >
                    {i + 1} month{i > 0 ? "s" : ""}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3 col-md-4">
              <Form.Label>Place</Form.Label>
              <Form.Control
                type="text"
                name="place"
                value={intern.place}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3 col-md-4">
              <Form.Label>Salary</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="number"
                  min="0"
                  value={salaryValue}
                  onChange={(e) => setSalaryValue(e.target.value)}
                  className="me-2"
                  required
                />
                <Form.Select
                  value={salaryUnit}
                  onChange={(e) => setSalaryUnit(e.target.value)}
                  required
                >
                  <option value="USD/month">USD/month</option>
                  <option value="EGP/month">EGP/month</option>
                  <option value="EUR/month">EUR/month</option>
                </Form.Select>
              </div>
            </Form.Group>

            <Form.Group className="mb-3 col-md-4">
              <Form.Label>Sponsor</Form.Label>
              <Form.Control
                type="text"
                name="sponser"
                value={intern.sponser}
                onChange={handleChange}
              />
            </Form.Group>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Apply Link</Form.Label>
            <Form.Control
              type="url"
              name="link"
              value={intern.link}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Skills</Form.Label>
            <Form.Control
              type="text"
              name="keywordsInput"
              value={intern.keywords.join(", ")}
              onChange={(e) =>
                setIntern({ ...intern, keywords: [e.target.value] })
              }
              onBlur={(e) =>
                setIntern({
                  ...intern,
                  keywords: e.target.value
                    .split(",")
                    .map((kw) => kw.trim())
                    .filter((kw) => kw),
                })
              }
              placeholder="e.g. frontend, remote, paid"
            />
            <Form.Text className="text-muted">
              Separate skills with commas. Example: React, Remote, Paid
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-between mt-4">
            <Button
              variant="secondary"
              onClick={() => navigate("/dashboard/internships")}
              disabled={loading}
            >
              {loading ? "Cancelling..." : "Cancel"}
            </Button>
            <Button variant="success" type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Internship"
                : "Add Internship"}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
