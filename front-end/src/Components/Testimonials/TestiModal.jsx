import { useState } from "react";
import { Modal, Card, Button, Form } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion } from "framer-motion";
import { Axios } from "../../api/axios";
import { testimonialsAPI } from "../../api/Api";
import { useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

export default function TestiModal({
  show,
  onClose,
  title,
  contentList,
  onSuccess,
}) {
  const [visibleItems, setVisibleItems] = useState(6); // Load 6 items initially
  const [showInput, setShowInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { id } = useParams();

  const courseLocation =
    window.location.pathname.split("/")[1].toString() === "courses";

  const dashLocation =
    window.location.pathname.split("/")[1].toString() === "dashboard";

  const loadMore = () => {
    setTimeout(() => {
      setVisibleItems((prev) => prev + 6);
    }, 1000);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await Axios.post(`${testimonialsAPI}`, {
        testimonial: newComment,
        courseId: id,
      });
      setNewComment("");
      setShowInput(false);
      toast.success("Testimonial added successfully!");

      if (onSuccess) onSuccess();
    } catch (error) {
      console.log("Error submitting testimonial:", error);
      toast.error("Couldn't add testimonial.");
    }
  };

  const deleteTesti = async (testiId) => {
    try {
      await Axios.delete(`${testimonialsAPI}/${testiId}`);
      toast.success("Testimonial deleted successfully!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.log("Error deleting testimonial:", error);
      toast.error("Couldn't delete testimonial.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InfiniteScroll
          dataLength={visibleItems}
          next={loadMore}
          hasMore={visibleItems < contentList.length}
          height={400}
        >
          {contentList?.slice(0, visibleItems).map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-3"
            >
              <Card className="shadow-sm p-3">
                <div className="d-flex align-items-center gap-3">
                  {testimonial.userProfilePic && (
                    <img
                      src={testimonial.userProfilePic}
                      alt={testimonial.userName}
                      className="rounded-circle"
                      width="50"
                      height="50"
                    />
                  )}
                  <Card.Title className="mb-0">
                    {testimonial.userName}
                  </Card.Title>
                </div>
                <Card.Text className="text-muted mt-2 between-flex">
                  {testimonial.testimonial}
                  {dashLocation && (
                    <MdDelete
                      className="fs-16px text-danger pointer"
                      onClick={() => deleteTesti(testimonial._id)}
                    />
                  )}
                </Card.Text>
                {testimonial.courseName && (
                  <div className="mt-2">
                    <strong className="text-muted">Course: </strong>
                    <span className="text-primary">
                      {testimonial.courseName || "Course name not found"}
                    </span>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </InfiniteScroll>

        {courseLocation && (
          <>
            <Button
              variant={showInput ? "secondary" : "primary text-light"}
              className="w-100 mt-3"
              onClick={() => setShowInput(!showInput)}
            >
              {showInput ? "Cancel" : "Add Your Testimonial"}
            </Button>

            {showInput && (
              <div className="mt-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Write your testimonial..."
                  maxLength={45}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                  variant="success text-light"
                  className="mt-2 w-100"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  Add
                </Button>
              </div>
            )}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}
