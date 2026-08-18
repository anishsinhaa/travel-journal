import icon from "../images/worldwide.png";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import ProfileMenu from "./ProfileMenu";
import NotificationsBell from "./NotificationsBell";
import BackButton from "./BackButton";

const HOME_PATHS = ["/", "/my-travels"];

export default function Header({ darkMode, toggle }) {
  const location = useLocation();
  const isHome = HOME_PATHS.includes(location.pathname);
  const [buttonText, setButtonText] = React.useState("DarkMode");

  React.useEffect(() => {
    setButtonText(
      darkMode ? (
        <Icon className="toggle-icon" icon="iconamoon:mode-light" />
      ) : (
        <Icon className="toggle-icon" icon="material-symbols:dark-mode" />
      )
    );
  }, [darkMode]);

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          {isHome ? (
            <button
              type="button"
              className={`header-circle-btn toggler-${darkMode ? "dark" : "light"}`}
              onClick={toggle}
              aria-label="Toggle dark mode"
            >
              {buttonText}
            </button>
          ) : (
            <BackButton darkMode={darkMode} />
          )}
        </div>
        <div className="header-main">
          <Link to="/" className="header-title-link">
            <img className="globe" src={icon} alt="Globe" />
            <h1 className="header-h1">My Travel Journal .</h1>
          </Link>
        </div>
        <div className="header-actions">
          <NotificationsBell />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
