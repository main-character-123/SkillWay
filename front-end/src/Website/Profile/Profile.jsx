import { useAuth } from "../../Context/AuthProvider";
import ProfileForm from "./ProfileForm";
import "./styles.css";

export default function Profile() {
  const { auth, setAuth } = useAuth();
  const user = auth.user;

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="container my-5">
      <h2 className="mb-4">My Profile</h2>
      <ProfileForm user={user} setAuth={setAuth} />
    </div>
  );
}
