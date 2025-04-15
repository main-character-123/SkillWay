import { useEffect, useState } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Accordion,
} from "react-bootstrap";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Axios } from "../../../../api/axios";
import { tracksAPI } from "../../../../api/Api";
import { toast } from "react-toastify";

export default function TracksForm() {
  const { setRefreshKey } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [track, setTrack] = useState({
    name: "",
    description: "",
    sections: [],
  });

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      Axios.get(`${tracksAPI}/${id}`)
        .then((res) => {
          setTrack(res.data);
          console.log(res.data);
        })
        .catch((err) => console.error("Error fetching track:", err));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrack({ ...track, [name]: value });
  };

  const handleAddSection = () => {
    setTrack({
      ...track,
      sections: [
        ...track.sections,
        {
          name: "",
          content: [{ title: "", link: "" }],
        },
      ],
    });
  };

  const handleDeleteSection = (sectionIndex) => {
    const updatedSections = [...track.sections];
    updatedSections.splice(sectionIndex, 1);
    setTrack({ ...track, sections: updatedSections });
  };

  const handleSectionChange = (index, value) => {
    const updatedSections = [...track.sections];
    updatedSections[index].name = value;
    setTrack({ ...track, sections: updatedSections });
  };

  const handleAddContent = (sectionIndex) => {
    const updatedSections = [...track.sections];
    updatedSections[sectionIndex].content.push({ title: "", link: "" });
    setTrack({ ...track, sections: updatedSections });
  };

  const handleDeleteContent = (sectionIndex, contentIndex) => {
    const updatedSections = [...track.sections];
    updatedSections[sectionIndex].content.splice(contentIndex, 1);
    setTrack({ ...track, sections: updatedSections });
  };

  const handleContentChange = (sectionIndex, contentIndex, field, value) => {
    const updatedSections = [...track.sections];
    updatedSections[sectionIndex].content[contentIndex][field] = value;
    setTrack({ ...track, sections: updatedSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        toast.info("Updating track...");
        await Axios.patch(`${tracksAPI}/${id}`, track);
        toast.success("Track updated successfully!");
      } else {
        toast.info("Adding new track...");
        await Axios.post(tracksAPI, track);
        toast.success("Track added successfully!");
      }

      setRefreshKey((prev) => prev + 1);
      navigate("/dashboard/tracks");
    } catch (err) {
      toast.error("Error occurred!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Form onSubmit={handleSubmit}>
        <Card className="shadow-lg">
          <Card.Body>
            <h2 className="mb-4">
              {isEditing ? "Edit Track" : "Add a New Track"}
            </h2>

            <Form.Group controlId="trackName">
              <Form.Label>Track Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={track.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="trackDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={track.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="mt-4">
              <h5>Roadmap</h5>
              <Button
                variant="primary text-light"
                onClick={handleAddSection}
                className="my-3"
              >
                Add Section
              </Button>

              <Accordion>
                {track.sections.map((section, sectionIndex) => (
                  <Accordion.Item
                    eventKey={sectionIndex.toString()}
                    key={sectionIndex}
                  >
                    <Accordion.Header>
                      {section.name || `Section ${sectionIndex + 1}`}
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="between-flex gap-3">
                        <Form.Group controlId={`section-${sectionIndex}`}>
                          <Form.Control
                            type="text"
                            placeholder="Section Title"
                            value={section.name}
                            onChange={(e) =>
                              handleSectionChange(sectionIndex, e.target.value)
                            }
                            required
                          />
                        </Form.Group>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteSection(sectionIndex)}
                        >
                          Delete This Section
                        </Button>
                      </div>

                      <div className="mt-3">
                        <h6>Content</h6>
                        {section.content.map((content, contentIndex) => (
                          <Row key={contentIndex} className="mb-2">
                            <Col>
                              <Form.Control
                                type="text"
                                placeholder="Title"
                                value={content.title}
                                onChange={(e) =>
                                  handleContentChange(
                                    sectionIndex,
                                    contentIndex,
                                    "title",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </Col>
                            <Col>
                              <Form.Control
                                type="url"
                                placeholder="Link"
                                value={content.link}
                                onChange={(e) =>
                                  handleContentChange(
                                    sectionIndex,
                                    contentIndex,
                                    "link",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </Col>
                            <Col xs="auto">
                              <Button
                                variant="danger"
                                onClick={() =>
                                  handleDeleteContent(
                                    sectionIndex,
                                    contentIndex
                                  )
                                }
                              >
                                Delete
                              </Button>
                            </Col>
                          </Row>
                        ))}
                        <Button
                          variant="info"
                          onClick={() => handleAddContent(sectionIndex)}
                        >
                          Add Content
                        </Button>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="secondary"
                onClick={() => navigate("/dashboard/tracks")}
                disabled={loading}
              >
                {loading ? "Cancelling..." : "Cancel"}
              </Button>
              <Button variant="success" type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : isEditing
                  ? "Update Track"
                  : "Add Track"}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Form>
    </Container>
  );
}
