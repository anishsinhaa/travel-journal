import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import NotificationItem from "./NotificationItem";
import { PageSpinner } from "./LoadingSkeleton";
import styles from "../styles/components/NotificationsBell.module.scss";

const PREVIEW_LIMIT = 6;

const itemClassNames = {
  item: styles.item,
  read: styles.read,
  unread: styles.unread,
  avatar: styles.avatar,
  avatarPlaceholder: styles.avatarPlaceholder,
  body: styles.text,
  time: styles.time,
  followBtn: styles.followBtn,
};

export default function NotificationsBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);

  const fetchCount = () =>
    api
      .get("/users/me/notifications/unread-count")
      .then(({ unreadCount: count }) => setUnreadCount(count))
      .catch(() => {});

  const fetchNotifications = () => {
    setLoading(true);
    return api
      .get("/users/me/notifications")
      .then((res) => {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) return undefined;

    fetchCount();
    const interval = setInterval(fetchCount, 45000);
    const onUpdate = () => fetchCount();
    window.addEventListener("focus", onUpdate);
    window.addEventListener("notifications-updated", onUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onUpdate);
      window.removeEventListener("notifications-updated", onUpdate);
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && user) fetchNotifications();
  }, [open, user]);

  const followBack = async (e, fromUserId) => {
    e.preventDefault();
    e.stopPropagation();
    const { following } = await api.post(`/users/${fromUserId}/follow`);
    setNotifications((prev) =>
      prev.map((n) =>
        n.fromUserId === fromUserId ? { ...n, isFollowing: following } : n
      )
    );
  };

  if (!user) return null;

  const unread = notifications.filter((n) => !n.read);
  const preview = (unread.length > 0 ? unread : notifications).slice(0, PREVIEW_LIMIT);

  return (
    <div className={styles.menu} ref={menuRef}>
      <button
        type="button"
        className={styles.bell}
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Icon icon="mdi:bell-outline" width={22} height={22} />
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h3>Notifications</h3>
            {unreadCount > 0 && <span className={styles.count}>{unreadCount} new</span>}
          </div>

          <div className={styles.body}>
            {loading ? (
              <PageSpinner small />
            ) : preview.length === 0 ? (
              <p className={styles.empty}>No notifications yet</p>
            ) : (
              <ul className={styles.list}>
                {preview.map((n) => (
                  <NotificationItem
                    key={n.notificationId}
                    notification={n}
                    currentUserId={user.uid}
                    onFollowBack={followBack}
                    onNavigate={() => setOpen(false)}
                    classNames={itemClassNames}
                  />
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            className={styles.footer}
            onClick={() => {
              setOpen(false);
              navigate("/notifications");
            }}
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}
