import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import data from "./data";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MorePhotos} from "./components/MorePhotos";

const PlaceList = () => {
  return data.map((data) => {
    return <Main key={data.id} {...data} />;
  });
};

function App() {
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
      <Header darkMode={darkMode} toggle={toggle} />
      <Router>
        <Routes>
          <Route path="/" element={<PlaceList />} />
          <Route path="/location/:id" element={<MorePhotos />} />
        </Routes>

        {/* <section className="place-list"></section> */}
      </Router>

      <Footer />
    </div>
  );
}

export default App;
