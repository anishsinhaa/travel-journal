import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./MorePhotos.css";
import { db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

export const MorePhotos = () => {
  const [data, setData] = useState({}); 
  const [open, setOpen] = React.useState(false); //for yet-another-react-lightbox to identify if its open or not
  const { id } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0); // track index

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locRef = doc(db, "PlacesData", id);
        const querySnapshot = await getDoc(locRef);
        if (querySnapshot.exists()) {
          const documentsData = querySnapshot.data();
          setData(documentsData);
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  const photos = data.allphotos || [];
  const photoList = photos.map((photo, index) => (
    <img
      onClick={() => {setOpen(true); setCurrentIndex(index); console.log(currentIndex)}}
      key={index}
      className="photos"
      src={photo}
      alt="Location"
    ></img>
  ));

  return (
    <div className="morephotos-container">
      <h2>More Photos in {data.location}</h2>
      {photos.length > 0 ? (
        <div className="Images">{photoList}</div>
      ) : (
        <p>Loading photos...</p>
      )}
      <Lightbox
        currentIndex={currentIndex}
        open={open}
        close={() => setOpen(false)}
        plugins={[Zoom]}
        slides={photos.map((photo)=>({src: photo}))} 
      />
    </div>
  );
};
