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
        <Icon className="toggle-icon" icon="material-symbols:dark-mode" />
      )
    );
  }, [props.darkMode]);

  const adminClick = ()=>{
    window.open("/location/zeus")
  }

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
        <a href="/" className="header-title-link">
          <img className="globe" src={icon} alt="Globe"></img>
          <h1 className="header-h1">My Travel Journal .</h1>
        </a>
      </div>
      <div className="admin-btn" onClick={()=>adminClick()} >ZEUS</div>
    </header>
  );
}
