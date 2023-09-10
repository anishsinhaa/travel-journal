import Header from "./components/Header";
import Main from "./pages/Main";
import Footer from "./components/Footer";
import Admin from "./pages/Admin/Admin";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MorePhotos } from "./pages/MorePhotos";
import { db } from "./firebase-config";
import { collection, getDocs } from "firebase/firestore";

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const placesRef = collection(db, "PlacesData"); // Reference the "PlacesData" collection
        const querySnapshot = await getDocs(placesRef);
        const documentsData = querySnapshot.docs.map((doc) => doc.data());
        setData(documentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData()
  }, []);
  const PlaceList = () => {
    console.log(data);
    return <div className="main-cont"> {data.map((data) => {
      return <Main key={data.id} {...data} />;
    })} </div>
  };
  const [darkMode, setDarkMode] = React.useState(false);
  const toggle = () => {
    setDarkMode((prevState) => !prevState);
  };
  return (
    <div
      className="App"
      style={{
        backgroundColor: darkMode ? "#28282B" : "whitesmoke",
        color: darkMode ? "white" : "#28282B",
      }}
    >
      <Header darkMode={darkMode} toggle={toggle}  />
      <div className="main-body">
      <Router>
        <Routes>
          <Route path="/" element={<PlaceList />} />
          <Route path="/location/:id" element={<MorePhotos />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
      </div>
      <Footer />
    </div>
  );
}

export default App;
