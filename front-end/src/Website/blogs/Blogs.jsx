import { useEffect, useState } from "react";
import { Axios } from "../../api/axios";
import { blogsAPI } from "../../api/Api";
import { Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { htmlToText } from "html-to-text";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Axios.get(blogsAPI)
      .then((res) => {
        setBlogs(res.data.Blogs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
      });
  }, []);

  // Stagger animation for all blogs
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Container className="my-5">
      <div className="mt-lg-5">
        <h1 className="text-center">Blogs</h1>
        <p className="text-center">Read the latest updates and insights.</p>
      </div>

      {/* Skeletons (Only Show When Loading) */}
      {loading && (
        <motion.div className="row g-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div key={i} className="col-12 col-lg-6 ">
              <Card className="border-0 bg-light shadow-sm rounded-4">
                <Skeleton height={316} className="rounded-4" />
                <Card.Body>
                  <Skeleton height={27} width="80%" />
                  <Skeleton height={25} width="60%" />
                  <Skeleton height={20} count={3} />
                </Card.Body>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Blogs (Only Show When Data is Loaded) */}
      {!loading && (
        <motion.div
          className="row g-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              className="col-12 col-lg-6 "
              variants={itemVariants}
            >
              <Link to={`/blogs/${blog._id}`} className="text-decoration-none">
                <Card className="border-0 bg-info shadow-sm rounded-4 h-100">
                  <Card.Img
                    variant="top"
                    src={
                      blog.image ||
                      `https://dummyimage.com/400x220/dfdfdfdf/ffffff&text=${blog.title}`
                    }
                    className="rounded-4"
                    loading="lazy"
                    style={{ minWidth: "326px", height: "300px" }}
                  />
                  <Card.Body className=" px-4">
                    <Card.Title className="truncate fs-3 m-0 ">
                      {blog.title}
                    </Card.Title>

                    <div className="between-flex w-100 mt-2 mb-3">
                      <Card.Subtitle className="text-capitalize text-muted m-0 truncate">
                        by: {blog.author?.name}
                      </Card.Subtitle>

                      <div className="center-flex gap-3 px-2">
                        <Card.Subtitle className="text-muted truncate m-0">
                          {blog.date}
                        </Card.Subtitle>

                        <Card.Subtitle className="text-capitalize text-muted m-0 ">
                          {blog.duration}
                        </Card.Subtitle>
                      </div>
                    </div>

                    <Card.Text className="fs-16px fs-md-18px text-truncate">
                      {htmlToText(blog.content, { wordwrap: false })}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </Container>
  );
}
