import { Link } from "react-router-dom";
import { formatWhen } from "../utils/formatWhen";

export function targetLink(n) {
  if (n.targetType === "photo" && n.targetId) return `/photo/${n.targetId}`;
  if (n.targetType === "trip" && n.targetId) return `/trip/${n.targetId}`;
  return null;
}

export default function NotificationItem({
  notification: n,
  currentUserId,
  onFollowBack,
  onNavigate,
  classNames = {},
}) {
  const link = targetLink(n);
  const {
    item = "",
    read = "",
    unread = "",
    avatar = "",
    avatarPlaceholder = "",
    body = "",
    time = "",
    followBtn = "",
  } = classNames;

  const message = (() => {
    switch (n.type) {
      case "follow":
        return "started following you";
      case "photo_like":
        return "liked your photo";
      case "trip_like":
        return "liked your trip";
      case "photo_comment":
        return "commented on your photo";
      case "trip_comment":
        return "commented on your trip";
      default:
        return "sent you a notification";
    }
  })();

  const content = (
    <div className={body}>
      <p>
        <Link
          to={`/profile/${n.fromUserId}`}
          className="author-link"
          onClick={onNavigate}
        >
          {n.fromUserName}
        </Link>{" "}
        {message}
      </p>
      {n.preview && link && (
        <p className="notification-preview">
          <Link to={link} className="author-link" onClick={onNavigate}>
            {n.preview}
          </Link>
        </p>
      )}
      {n.preview && !link && <p className="notification-preview">{n.preview}</p>}
      <span className={time}>{formatWhen(n.createdAt)}</span>
    </div>
  );

  return (
    <li className={`${item} ${n.read ? read : unread}`.trim()}>
      {n.fromUserPhotoURL ? (
        <img src={n.fromUserPhotoURL} alt="" className={avatar} />
      ) : (
        <div className={avatarPlaceholder} />
      )}
      {link && n.type !== "follow" ? (
        <Link
          to={link}
          className="notification-link-wrap"
          onClick={onNavigate}
        >
          {content}
        </Link>
      ) : (
        content
      )}
      {n.type === "follow" && n.fromUserId !== currentUserId && onFollowBack && (
        <button
          type="button"
          className={`${n.isFollowing ? "btn-secondary" : "btn-primary"} btn-sm ${followBtn}`.trim()}
          onClick={(e) => onFollowBack(e, n.fromUserId)}
        >
          {n.isFollowing ? "Following" : "Follow back"}
        </button>
      )}
    </li>
  );
}
