import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/pages/SignIn.module.scss";
import { PageSpinner } from "../components/LoadingSkeleton";

export default function SignIn() {
  const { user, loading, signInWithGoogle, signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <PageSpinner />;
  if (user) return <Navigate to="/my-travels" replace />;

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signInWithEmail(email.trim(), password);
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/operation-not-allowed") {
        setError("Email sign-in is not enabled in Firebase Auth yet.");
      } else if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        setError("Invalid email or password.");
      } else {
        setError(err.message || "Sign in failed.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className={styles.page}>
        <h1>Sign in to My Travel Journal</h1>
        <p>Share your journeys and explore trips from travelers you follow.</p>
        <button type="button" className={styles.googleBtn} onClick={signInWithGoogle}>
          Sign in with Google
        </button>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <form className={styles.emailForm} onSubmit={handleEmailSignIn}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in with email"}
          </button>
        </form>
      </div>
    </div>
  );
}
