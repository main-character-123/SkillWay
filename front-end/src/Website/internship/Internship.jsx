import { useEffect, useState } from "react";
import { Axios } from "../../api/axios";
import { internshipsAPI } from "../../api/Api";
import { Button } from "react-bootstrap";
import { FaSackDollar } from "react-icons/fa6";
import { GiPin } from "react-icons/gi";
import Skeleton from "react-loading-skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState(3);
  useEffect(() => {
    Axios.get(internshipsAPI)
      .then((res) => {
        setInternships(res.data.interns);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  const loadMore = () => {
    setTimeout(() => {
      setVisibleItems((prev) => prev + 3);
    }, 1000);
  };

  const skeletons = [...Array(3)].map((_, i) => (
    <div
      key={i}
      className="bg-white border rounded-4 shadow-sm mb-4 p-3 px-md-4"
    >
      <div className="d-flex align-items-center mb-3">
        <Skeleton circle width={90} height={90} className="me-4" />
        <div className="w-100">
          <Skeleton height={20} width={`40%`} className="mb-2" />
          <Skeleton height={15} width={`30%`} className="mb-1" />
          <Skeleton height={15} width={`20%`} />
        </div>
      </div>
      <div className="d-flex flex-wrap gap-2 mb-3">
        {[...Array(4)].map((_, j) => (
          <Skeleton
            key={j}
            height={30}
            width={80 + j * 10}
            className="rounded-pill"
          />
        ))}
      </div>
      <Skeleton height={40} width={120} className="mx-auto rounded-4" />
    </div>
  ));

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h1 className="fw-bold text-dark">
          Find Your Perfect <span className="text-primary">Internship</span>
        </h1>
        <p className="text-muted">
          Browse available internships and apply to kickstart your career!
        </p>
      </div>

      <div className="mb-4 text-end">
        <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-3">
          {internships.length} New Opportunities
        </span>
      </div>

      {loading ? (
        skeletons
      ) : (
        <InfiniteScroll
          dataLength={visibleItems}
          next={loadMore}
          hasMore={visibleItems < internships.length}
          loader={<h4 className="mb-5 text-center">Loading...</h4>}
        >
          {internships.slice(0, visibleItems).map((intern, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-4 border shadow-sm mb-4 p-3 px-md-4"
            >
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                <div className="d-flex align-items-center flex-column flex-md-row text-center text-md-start">
                  <img
                    src={
                      intern.image ||
                      `https://dummyimage.com/900x600/dfdfdfdf/ffffff&text=${intern.company}`
                    }
                    alt="intern"
                    className="rounded-circle me-md-4 mb-3 mb-md-0"
                    style={{ width: 90, height: 90, objectFit: "cover" }}
                  />
                  <div>
                    <h4 className="fw-bold mb-1">{intern.track}</h4>
                    <p className="mb-1 text-muted">{intern.company}</p>
                    <span className="badge bg-light text-dark me-2">
                      {intern.place}
                    </span>
                    <span className="badge bg-warning-subtle text-warning fw-semibold">
                      <FaSackDollar className="me-1" /> {intern.salary}
                    </span>
                  </div>
                </div>

                <div className="text-center mt-3 mt-md-0">
                  <span className="fw-semibold text-danger">
                    <GiPin className="me-1" /> {intern.duration}
                  </span>
                </div>
              </div>

              <div className="d-flex justify-content-center flex-wrap gap-2 mt-3">
                {intern.keywords.map((skill, idx) => (
                  <span
                    key={idx}
                    className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="text-center mt-4">
                <Button
                  variant="outline-primary"
                  className="fw-semibold px-4 py-2 rounded-4"
                >
                  <Link to={intern.link} target="_blank">
                    Apply
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
}
