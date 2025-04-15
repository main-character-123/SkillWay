import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import getCroppedImg from "../Utils/cropImage";

export default function ImageCropperModal({
  file,
  show,
  onClose,
  onCropComplete,
  aspect = 1, // Default to 1:1 for profile if not provided
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  const onCropDone = async () => {
    setLoading(true);
    const croppedImage = await getCroppedImg(
      URL.createObjectURL(file),
      croppedAreaPixels
    );
    onCropComplete(croppedImage);
    setLoading(false);
    onClose();
  };

  const onCropCompleteInternal = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Crop Image</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: 400, position: "relative" }}>
        <Cropper
          image={file ? URL.createObjectURL(file) : null}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropCompleteInternal}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="success" onClick={onCropDone} disabled={loading}>
          {loading ? <Spinner size="sm" /> : "Crop & Upload"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
