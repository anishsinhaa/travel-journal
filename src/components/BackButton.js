import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { exitFlow } from "../utils/navigation";

export default function BackButton({ fallback = "/", darkMode = false, className = "" }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={`header-circle-btn toggler-${darkMode ? "dark" : "light"} ${className}`.trim()}
      onClick={() => exitFlow(navigate, fallback)}
      aria-label="Go back"
    >
      <Icon className="toggle-icon" icon="material-symbols:arrow-back-rounded" />
    </button>
  );
}
