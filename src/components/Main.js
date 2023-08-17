import loc from "../images/location-pin.png";
import { useNavigate } from "react-router-dom";


export default function Main(props) {
  const Navigate = useNavigate();
  const onCardClick = (id) => {
    Navigate(`location/${id}`);
  };
  //console.log(props.photos)
  

  return (
    <main className="main-card">
      <div className="card" onClick={() => onCardClick(props.id)}>
        <img className="photo" src={props.cover} alt="Location"></img>
        <section className="info">
          <div className="state">
            <img src={loc} width="30px" height="30px" alt="LOCATION"></img>
            <a href={props.link}>
              <small className="googlemaps">VIEW ON GOOGLE MAPS</small>
            </a>
          </div>
          <h2>{props.location}</h2>
          <h6>
            <strong>{props.date}</strong>
          </h6>
          <p>{props.des}</p>
        </section>
      </div>
    </main>
  );
}
