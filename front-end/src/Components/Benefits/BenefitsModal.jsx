import { useState } from "react";
import { Modal, Card } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion } from "framer-motion";

export default function BenefitsModal({ show, onClose, contentList }) {
  const [visibleItems, setVisibleItems] = useState(6); // Load 6 items initially

  const loadMore = () => {
    setTimeout(() => {
      setVisibleItems((prev) => prev + 6); // Load 6 more on scroll
    }, 1000);
  };

  return (
    <Modal show={show} onHide={onClose} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>All Benefits</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <InfiniteScroll
          dataLength={visibleItems}
          next={loadMore}
          hasMore={visibleItems < contentList.length}
          height={400}
        >
          {contentList
            .slice(0, visibleItems)
            .map(({ id, title, description }) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-3"
              >
                <Card className="shadow-sm p-3">
                  <span className="d-block fs-1 fw-bold text-end mb-2">
                    {id < 10 ? `0${id}` : id}
                  </span>
                  <Card.Title className="mb-2">{title}</Card.Title>
                  <Card.Text className="text-muted">{description}</Card.Text>
                </Card>
              </motion.div>
            ))}
        </InfiniteScroll>
      </Modal.Body>
    </Modal>
  );
}
