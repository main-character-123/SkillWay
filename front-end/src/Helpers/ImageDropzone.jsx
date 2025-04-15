import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageDropzone({ onImageSelected, multiple = false }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        if (multiple) {
          onImageSelected(acceptedFiles); // For multiple files, pass the array
        } else {
          onImageSelected(acceptedFiles[0]); // For a single file, pass the first file
        }
      }
    },
    [onImageSelected, multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: multiple, // Control multiple uploads
  });

  return (
    <div
      {...getRootProps()}
      className="border p-3 rounded-4 text-center bg-white pointer"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image(s) here...</p>
      ) : (
        <p>Drag 'n' drop or click to upload image(s)</p>
      )}
    </div>
  );
}
