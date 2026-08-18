import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/components/ProfileMenu.module.scss";

export default function ProfileMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Link to="/signin" className={styles.signin}>
        Sign in
      </Link>
    );
  }

  const handleLogout = async () => {
    setOpen(false);
    await signOut();
    navigate("/");
  };

  return (
    <div className={styles.menu} ref={menuRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open profile menu"
        aria-expanded={open}
      >
        <img src={user.photoURL} alt={user.displayName} className={styles.avatar} />
      </button>
      {open && (
        <div className={styles.dropdown}>
          <Link to="/notifications" className={styles.item} onClick={() => setOpen(false)}>
            Notifications
          </Link>
          <Link to="/my-travels" className={styles.item} onClick={() => setOpen(false)}>
            My Travels
          </Link>
          <button type="button" className={styles.item} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
