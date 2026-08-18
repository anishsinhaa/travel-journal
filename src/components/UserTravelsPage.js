import { useEffect, useState } from "react";
import { api } from "../api/client";
import EditProfileModal from "./EditProfileModal";
import PhotoCard from "./PhotoCard";
import TripCard from "./TripCard";
import UserProfileHeader from "./UserProfileHeader";
import { ProfileSkeleton } from "./LoadingSkeleton";

export default function UserTravelsPage({
  uid,
  isOwnProfile = false,
  showFollow = false,
  headerExtra,
}) {
  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/users/${uid}`),
      api.get(`/trips/user/${uid}`),
      api.get(`/photos/user/${uid}?standalone=true`),
    ])
      .then(([userRes, tripsRes, photosRes]) => {
        setProfile(userRes.user);
        setTrips(tripsRes.trips);
        setPhotos(photosRes.photos);
      })
      .finally(() => setLoading(false));
  }, [uid]);

  const toggleFollow = async () => {
    const { following } = await api.post(`/users/${uid}/follow`);
    setProfile((prev) => ({
      ...prev,
      isFollowing: following,
      followersCount: (prev.followersCount || 0) + (following ? 1 : -1),
    }));
  };

  const toggleBlock = async () => {
    const { blocked } = await api.post(`/users/${uid}/block`);
    setProfile((prev) => ({
      ...prev,
      isBlocked: blocked,
      isFollowing: blocked ? false : prev.isFollowing,
    }));
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) return <p className="page-error">User not found</p>;

  const hasContent = !profile.isBlocked && (trips.length > 0 || photos.length > 0);

  return (
    <>
      <UserProfileHeader
        profile={profile}
        photosCount={photos.length}
        showFollow={showFollow && !isOwnProfile}
        onFollow={toggleFollow}
        onEditProfile={isOwnProfile ? () => setEditOpen(true) : undefined}
        headerExtra={
          <>
            {headerExtra}
            {showFollow && !isOwnProfile && (
              <button type="button" className="btn-secondary btn-sm" onClick={toggleBlock}>
                {profile.isBlocked ? "Unblock" : "Block"}
              </button>
            )}
          </>
        }
      />
      <EditProfileModal
        profile={profile}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={setProfile}
      />
      {profile.isBlocked && !isOwnProfile ? (
        <p className="empty-state">You have blocked this user.</p>
      ) : !hasContent ? (
        <p className="empty-state">
          {isOwnProfile ? (
            <>
              Nothing here yet. Use <strong>+ New Trip</strong> or <strong>+ Post Photo</strong> to get
              started.
            </>
          ) : (
            "No public trips or photos yet."
          )}
        </p>
      ) : (
        <>
          {trips.length > 0 && (
            <section className="my-travels-section">
              <h3 className="my-travels-section-title">Trips</h3>
              <div className="main-cont">
                {trips.map((trip) => (
                  <TripCard key={trip.tripId} trip={trip} />
                ))}
              </div>
            </section>
          )}
          {photos.length > 0 && (
            <section className="my-travels-section">
              <h3 className="my-travels-section-title">Photos</h3>
              <div className="main-cont">
                {photos.map((photo) => (
                  <PhotoCard key={photo.photoId} photo={photo} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
