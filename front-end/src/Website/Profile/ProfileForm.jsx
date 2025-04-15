import { useState } from "react";
import { updateUserApi, updatePictureApi } from "../../api/Api";
import { Axios } from "../../api/axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import ProfileInfo from "./ProfileInfo";
import ImageDropzone from "../../Helpers/ImageDropzone";
import ImageCropperModal from "../../Helpers/ImageCropperModal";
import ChangePasswordModal from "../../Helpers/ChangePasswordModal";

export default function ProfileForm({ user, setAuth }) {
  const [formData, setFormData] = useState({ ...user });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(user.profilePic);

  const [selectedFile, setSelectedFile] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await Axios.patch(
        `${updateUserApi}/${user._id}`,
        formData
      );
      setAuth((prev) => ({ ...prev, user: data.user }));
      Cookies.set("userData", JSON.stringify(data.user), { expires: 7 });
      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelected = (file) => {
    setSelectedFile(file);
    setShowCropper(true);
  };

  const handleCroppedImage = async (croppedFile) => {
    toast.info("Uploading image...");
    const form_Data = new FormData();
    form_Data.append("photo", croppedFile);

    setLoading(true);
    try {
      const { data } = await Axios.patch(
        `${updatePictureApi}/${user._id}`,
        form_Data
      );
      setProfilePic(data.user.profilePic);
      setAuth((prev) => ({ ...prev, user: data.user }));
      Cookies.set("userData", JSON.stringify(data.user), { expires: 7 });
      toast.success("Profile picture updated!");
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Image upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-light rounded-5 shadow-sm">
      <div className="mt-3 center-flex flex-column text-center">
        <img
          src={profilePic}
          alt="Profile"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        <div className="mt-3 w-100" style={{ maxWidth: 400 }}>
          <ImageDropzone onImageSelected={handleImageSelected} />
        </div>

        <ImageCropperModal
          file={selectedFile}
          show={showCropper}
          onClose={() => setShowCropper(false)}
          onCropComplete={handleCroppedImage}
        />
      </div>

      <ProfileInfo
        formData={formData}
        handleChange={handleChange}
        editMode={editMode}
      />

      {editMode ? (
        <div className="d-flex gap-2 mt-3">
          <button
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="between-flex">
          <button
            className="btn btn-primary mt-3 text-white"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
          <button
            className="btn btn-primary mt-3 text-white"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </button>
        </div>
      )}
      <ChangePasswordModal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}
