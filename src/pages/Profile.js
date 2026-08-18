import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserTravelsPage from "../components/UserTravelsPage";

export default function Profile() {
  const { uid } = useParams();
  const { user } = useAuth();

  if (user?.uid === uid) {
    return <Navigate to="/my-travels" replace />;
  }

  return (
    <div className="page-container">
      <h2 className="page-title">Profile</h2>
      <UserTravelsPage uid={uid} showFollow={Boolean(user)} />
    </div>
  );
}
