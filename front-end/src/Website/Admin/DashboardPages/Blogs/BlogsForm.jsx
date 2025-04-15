import { useEffect, useRef, useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Axios } from "../../../../api/axios";
import { blogsAPI } from "../../../../api/Api";
import { useAuth } from "../../../../Context/AuthProvider";
import { toast } from "react-toastify";
import ImageDropzone from "../../../../Helpers/ImageDropzone";
import ImageCropperModal from "../../../../Helpers/ImageCropperModal";
import TextEditor from "../../../../Components/TextEditor/Editor";
import { Img } from "react-image";
import Skeleton from "react-loading-skeleton";

export default function BlogForm() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { setRefreshKey } = useOutletContext();

  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState({
    title: "",
    author: auth?.user.name,
    duration: "",
    date: new Date().toDateString(),
    content: "",
  });

  // Ref to track if the component is still mounted
  const isMounted = useRef(true);

  useEffect(() => {
    // Set the flag to true when component is mounted
    isMounted.current = true;

    // Clean up function to set the flag to false when component is unmounted
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      Axios.get(`${blogsAPI}/${id}`)
        .then((res) => {
          if (isMounted.current) {
            setBlog(res.data.blog); // Only update state if component is mounted
          }
        })
        .catch((err) => {
          console.error("Error fetching blog:", err);
        })
        .finally(() => {
          if (isMounted.current) {
            setLoading(false); // Only update state if component is mounted
          }
        });
    }
  }, [id]);

  const [blogImage, setBlogImage] = useState(blog.image);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    setBlogImage(blog.image);
  }, [blog.image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog({ ...blog, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        toast.info("Updating Blog!");
        await Axios.patch(`${blogsAPI}/${id}`, blog);
        if (isMounted.current) {
          toast.success("Blog updated successfully!");
          navigate("/dashboard/blogs");
        }
      } else {
        toast.info("Adding Blog!");
        const { data } = await Axios.post(blogsAPI, blog);
        if (isMounted.current) {
          toast.success("New blog added!");
          navigate(`/dashboard/blogs/${data.blog._id}`);
        }
      }
      setRefreshKey((prev) => prev + 1); // Trigger a refresh
    } catch (error) {
      if (isMounted.current) {
        toast.error("Failed to save blog!");
      }
      console.error("Error saving blog:", error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
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
      const { data } = await Axios.post(`${blogsAPI}/${id}/image`, form_Data);
      setBlogImage(data.blog.image);
      setBlog((prevBlog) => ({
        ...prevBlog,
        image: data.blog.image,
      }));
      toast.success("Blog Image updated!");
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Image upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4">
        <h2 className="text-center mb-4">
          {isEditing ? "Edit Blog" : "Add a New Blog"}
        </h2>
        <Form onSubmit={handleSubmit}>
          {isEditing ? (
            <div className="mt-3 center-flex flex-column text-center">
              <Img
                src={
                  blogImage ||
                  `https://dummyimage.com/400x220/dfdfdfdf/ffffff&text=${blog.title}`
                }
                alt="Blog"
                loader={<Skeleton height={240} />}
                decoding="async"
                loading="lazy"
                className="rounded-3"
                style={{ height: "220px", width: "400px" }}
              />

              <div className="mt-3 w-100" style={{ maxWidth: 400 }}>
                <ImageDropzone onImageSelected={handleImageSelected} />
              </div>

              <ImageCropperModal
                file={selectedFile}
                show={showCropper}
                onClose={() => setShowCropper(false)}
                onCropComplete={handleCroppedImage}
                aspect={16 / 9}
              />
            </div>
          ) : (
            <div className="text-center my-4 text-muted">
              <strong>Save the blog first to upload an image.</strong>
            </div>
          )}

          <div className="row">
            <Form.Group className="mb-3 col-4">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={blog.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 col-4">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={
                  isEditing ? blog.author?.name || "User Deleted" : blog.author
                }
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3 col-4">
              <Form.Label>Duration</Form.Label>
              <Form.Select
                name="duration"
                value={blog.duration}
                onChange={handleChange}
                required
              >
                <option value="">Select duration</option>
                <option value="2 min read">2 min read</option>
                <option value="4 min read">4 min read</option>
                <option value="6 min read">6 min read</option>
                <option value="8 min read">8 min read</option>
                <option value="10 min read">10 min read</option>
              </Form.Select>
            </Form.Group>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <TextEditor blog={blog} setBlog={setBlog} />
          </Form.Group>

          <div className="d-flex justify-content-between mt-4">
            <Button
              variant="secondary"
              onClick={() => navigate("/dashboard/blogs")}
              disabled={loading}
            >
              {loading ? "Cancelling..." : "Cancel"}
            </Button>
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update Blog" : "Add Blog"}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
