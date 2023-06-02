import loc from "../images/location-pin.png";
export default function Main(props) {
  return (
    <main className="main-container">
      <div className="card">
        <img className="photo" src={props.photo} alt="Location"></img>
        <section className="info">
          <div className="state">
            <img src={loc} width="30px" height="30px" alt="LOCATION"></img>
            <h4>{props.state}</h4>
            <a href={props.link}>
              <small className="googlemaps">VIEW ON GOOGLE MAPS</small>
            </a>
          </div>
          <h2>{props.city}</h2>
          <h6>
            <strong>{props.date}</strong>
          </h6>
          <p>{props.des}</p>
        </section>
      </div>
    </main>
  );
}
