import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Axios } from "../../api/axios";
import { tracksAPI } from "../../api/Api";
import { Card, Container } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";

export default function Tracks() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Axios.get(`${tracksAPI}`).then((res) => {
      setTracks(res.data.data.tracks);
      setLoading(false);
    });
  }, []);

  const skeletons = [...Array(4)].map((_, i) => (
    <div key={i} className="mb-4 p-3 bg-info shadow-lg">
      <Skeleton height={30} width="50%" />
      <Skeleton height={20} count={2} className="mt-2" />
    </div>
  ));

  const showTracks = tracks.map((track, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      whileHover={{ scale: 1.03 }}
    >
      <Link
        to={`/tracks/${track._id}`}
        state={{ track }}
        className="text-decoration-none"
      >
        <Card className="border-0 bg-info shadow-sm rounded-4 px-md-5 p-3 mb-4">
          <Card.Title>{track.name}</Card.Title>
          <Card.Body>{track.description}</Card.Body>
        </Card>
      </Link>
    </motion.div>
  ));

  return (
    <Container className="my-5">{loading ? skeletons : showTracks}</Container>
  );
}
