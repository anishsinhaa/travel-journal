import icon from "../images/worldwide.png";
import React from "react";
import { Icon } from "@iconify/react";

export default function Header(props) {
  const [buttonText, setButtonText] = React.useState("DarkMode");
  React.useEffect(() => {
    setButtonText(
      props.darkMode ? (
        <Icon className="toggle-icon" icon="iconamoon:mode-light" />
      ) : (
        <Icon className="toggle-icon"  icon="material-symbols:dark-mode" />
      )
    );
  }, [props.darkMode]);
  return (
    <header
      className="header"
      style={{
        backgroundColor: props.darkMode ? "#002147" : "#f55a5a",
        color: props.darkMode ? "white" : "#28282B",
      }}
    >
      <button
        className={`toggler-${props.darkMode ? "dark" : "light"}`}
        onClick={props.toggle}
      >
        {buttonText}
      </button>
      <div className="header-main">
        <img src={icon} alt="Globe"></img>
        <h1 className="header-h1">My Travel Journal.</h1>
      </div>
    </header>
  );
}
