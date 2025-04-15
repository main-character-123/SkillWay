import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Axios } from "../../api/axios";
import { blogsAPI } from "../../api/Api";
import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
import BreadCrumbs from "../../Components/BreadCrumbs/BreadCrumbs";
import { Img } from "react-image";
import Skeleton from "react-loading-skeleton";

export default function BlogView() {
  const { id } = useParams(); // Get blog ID from URL
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    Axios.get(`${blogsAPI}/${id}`)
      .then((res) => setBlog(res.data.blog))
      .catch((err) => console.error(err));
  }, [id]);

  if (!blog) return <h2 className="text-center mt-5">Loading...</h2>;

  return (
    <Container className="my-5">
      <BreadCrumbs title={blog.title} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-5">
          <h1 className="text-center mb-4">{blog.title}</h1>
          <p className="px-4">
            by{" "}
            <span className="text-capitalize text-muted">
              {blog.author?.name}
            </span>{" "}
            on <span className="text-muted">{blog.date}</span>
          </p>
          <Img
            src={
              blog.image ||
              `https://dummyimage.com/400x220/dfdfdfdf/ffffff&text=${blog.title}`
            }
            alt={blog.title}
            className="w-100 rounded-4 img-responsive "
            loader={<Skeleton height={240} />}
            decoding="async"
            loading="lazy"
            height={600}
          />
          <div
            className="text-start editor-content "
            dangerouslySetInnerHTML={{ __html: blog.content }}
          ></div>
        </div>
      </motion.div>
    </Container>
  );
}
