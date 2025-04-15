import { useEffect, useState } from "react";
import { Axios } from "../../api/axios";
import { coursesAPI, testimonialsAPI } from "../../api/Api";
import { Container, Accordion, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { MdOutlineWatchLater } from "react-icons/md";
import { motion } from "framer-motion";
import "./courses.css";
import Breadcrumbs from "../../Components/BreadCrumbs/BreadCrumbs";
import TestiModal from "../../Components/Testimonials/TestiModal";

export default function CourseView() {
  const [currCourse, setCurrCourse] = useState({});
  const [videoList, setVideoList] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    Axios(`${coursesAPI}/${id}`)
      .then((res) => {
        const course = res.data.course;
        setCurrCourse(course);
        // Flatten parts into one list grouped by section
        const groupedVideos = course.curriculum?.map((section) => ({
          sectionTitle: section.title,
          videos: section.parts || [],
        }));

        setVideoList(groupedVideos);
        setCurrentVideo(groupedVideos?.[0]?.videos?.[0] || null); // set the first video as default
      })
      .catch((error) => console.log(error));
  }, [id]);

  // Testimonials Modal Settings --
  const handleModalClose = () => {
    setShowModal(false);
  };

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data } = await Axios.get(`${testimonialsAPI}/course/${id}`);
      const fetchedTestimonials = data.testimonials;
      // Enhance testimonials with userName and userProfilePic
      const enhancedTestimonials = fetchedTestimonials.map((t) => ({
        ...t,
        userName: t.userId?.name || "User Deleted",
        userProfilePic:
          t.userId?.profilePic || "https://www.viverefermo.it/images/user.png",
        courseName: t.courseId?.name || "Course Deleted",
      }));
      setTestimonials(enhancedTestimonials);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching Testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Breadcrumbs title={currCourse.name} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4 text-center text-md-start">
          <div className="between-flex  mb-3">
            <h2 className="fs-1">{currCourse.name}</h2>
            <Button variant="primary text-light" onClick={fetchTestimonials}>
              {loading ? "Loading.." : "Course Testimonials"}
            </Button>
          </div>
          <p>{currCourse.description}</p>
        </div>

        {/* Video and List */}
        <div className="d-flex flex-column flex-md-row gap-4">
          {/* Video Player */}
          <div className="flex-grow-1 w-100">
            {currentVideo?.demoVideo ? (
              <video
                key={currentVideo._id} // Use _id here to uniquely identify the video
                controls
                className="w-100 rounded shadow"
                style={{ maxHeight: "600px" }}
              >
                <source src={currentVideo.demoVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-center p-5 bg-light rounded">
                Select a video to play
              </div>
            )}
            <h4 className="mt-3">{currentVideo?.title}</h4>
            <p className="mt-3 fs-19px px-4">{currentVideo?.description}</p>
          </div>

          {/* Video List */}
          <div className="col-md-4 bg-white rounded shadow-sm p-3">
            <h5 className="fw-bold mb-3">Course Videos</h5>
            <Accordion defaultActiveKey="0">
              {videoList?.map((section, idx) => (
                <Accordion.Item key={idx} eventKey={idx.toString()}>
                  <Accordion.Header>{section.sectionTitle}</Accordion.Header>
                  <Accordion.Body>
                    <div className="d-flex flex-column gap-2">
                      {section.videos?.map((video) => (
                        <div
                          key={video._id} // Use _id here as well
                          onClick={() => setCurrentVideo(video)}
                          className={`lesson-item p-2 rounded ${
                            currentVideo?._id === video._id
                              ? "bg-primary bg-opacity-25 text-primary"
                              : "bg-light"
                          }`}
                        >
                          <div className="fw-semibold">{video.title}</div>
                          <div className="d-flex align-items-center gap-2 text-muted small">
                            <MdOutlineWatchLater />
                            {video.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        </div>

        <TestiModal
          show={showModal}
          onClose={handleModalClose}
          title="All Testimonials"
          contentList={testimonials}
          animate={true}
          onSuccess={() => setShowModal(false)}
        />
      </motion.div>
    </Container>
  );
}
