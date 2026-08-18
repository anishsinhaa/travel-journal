import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import NotificationItem from "../components/NotificationItem";
import { NotificationsSkeleton } from "../components/LoadingSkeleton";
import styles from "../styles/pages/Notifications.module.scss";

const pageClassNames = {
  item: styles.item,
  read: styles.read,
  avatar: styles.avatar,
  avatarPlaceholder: styles.avatarPlaceholder,
  body: styles.body,
  time: styles.time,
};

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRead, setShowRead] = useState(false);
  const [markedRead, setMarkedRead] = useState(false);

  const load = () =>
    api.get("/users/me/notifications").then((res) => {
      setNotifications(res.notifications);
      return res;
    });

  useEffect(() => {
    load()
      .then(() => api.post("/users/me/notifications/read", { all: true }))
      .then(() => {
        window.dispatchEvent(new Event("notifications-updated"));
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setMarkedRead(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const followBack = async (e, fromUserId) => {
    e.preventDefault();
    const { following } = await api.post(`/users/${fromUserId}/follow`);
    setNotifications((prev) =>
      prev.map((n) =>
        n.fromUserId === fromUserId ? { ...n, isFollowing: following } : n
      )
    );
  };

  if (loading) {
    return (
      <div className={`page-container ${styles.page}`}>
        <NotificationsSkeleton />
      </div>
    );
  }

  const read = notifications.filter((n) => n.read);
  const unread = notifications.filter((n) => !n.read);
  const visible = showRead ? notifications : unread;

  return (
    <div className={`page-container ${styles.page}`}>
      <div className={styles.header}>
        <h2 className="page-title">Notifications</h2>
        {read.length > 0 && (
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => setShowRead((v) => !v)}
          >
            {showRead ? "Hide read" : `Show earlier (${read.length})`}
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="empty-state">
          {markedRead && notifications.length > 0
            ? "You're all caught up!"
            : "No notifications yet."}
        </p>
      ) : (
        <ul className={styles.list}>
          {visible.map((n) => (
            <NotificationItem
              key={n.notificationId}
              notification={n}
              currentUserId={user?.uid}
              onFollowBack={followBack}
              classNames={pageClassNames}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
