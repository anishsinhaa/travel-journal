import { useNavigate } from "react-router-dom";
import SmartImage from "./SmartImage";

export default function TripCard({ trip }) {
  const navigate = useNavigate();

  return (
    <main className="main-card">
      <div className="card" onClick={() => navigate(`/trip/${trip.tripId}`)}>
        {trip.fromFollowing && <span className="trip-badge">Following</span>}
        {trip.coverUrl ? (
          <SmartImage className="photo" src={trip.coverUrl} alt={trip.location} />
        ) : (
          <div className="photo photo-placeholder">No photos yet</div>
        )}
        <section className="info">
          <h2>{trip.location}</h2>
          <h6>
            <strong>{trip.date}</strong>
          </h6>
          <p className="card-description">{trip.description}</p>
          <div className="trip-meta">
            <span>{trip.likesCount || 0} likes</span>
            <span>{trip.viewCount || 0} views</span>
            {trip.commentsCount > 0 && (
              <span>{trip.commentsCount} comments</span>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
