import React from "react";
import { useParams } from "react-router-dom";
import data from "../data";
import "./MorePhotos.css";

export const MorePhotos = () => {
  const { id } = useParams();
  const loc = data.find((item) => Number(item.id) === Number(id));
  console.log(loc);
  const photos=loc.allphotos;
  const photolist= photos?.map((photo,index)=>{return <img key={index} className="photos" src={photo} alt="Location"></img> })
  console.log(photos)
  return (
    <div>
      <h2>More Photos in {loc.location}</h2>
      <div className="Images">
       {photolist}
      </div>
    </div>
  );
};
