import SmartImage from "./SmartImage";

export default function UserProfileHeader({
  profile,
  onFollow,
  showFollow = false,
  photosCount,
  onEditProfile,
  headerExtra,
}) {
  if (!profile) return null;

  return (
    <div className="profile-header">
      {profile.photoURL && (
        <SmartImage
          src={profile.photoURL}
          alt={profile.displayName}
          className="profile-avatar"
        />
      )}
      <div>
        <h3 className="profile-name">{profile.displayName}</h3>
        {profile.bio && <p className="profile-bio">{profile.bio}</p>}
        <div className="profile-stats">
          <span>{profile.tripsCount || 0} trips</span>
          {photosCount !== undefined && <span>{photosCount} photos</span>}
          <span>{profile.followersCount || 0} followers</span>
          <span>{profile.followingCount || 0} following</span>
        </div>
        <div className="profile-actions">
          {onEditProfile && (
            <button type="button" className="btn-secondary btn-sm" onClick={onEditProfile}>
              Edit Profile
            </button>
          )}
          {showFollow && onFollow && (
            <button type="button" className="btn-primary btn-sm" onClick={onFollow}>
              {profile.isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
          {headerExtra}
        </div>
      </div>
    </div>
  );
}
