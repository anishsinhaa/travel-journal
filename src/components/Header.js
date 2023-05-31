import icon from "../images/worldwide.png";
export default function Header() {
  return (
    <header className="header">
      <img src={icon} alt="Globe"></img>
      <h1>My Travel Journal.</h1>
    </header>
  );
}
