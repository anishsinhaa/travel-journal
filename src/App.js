import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import data from "./data";
import React from "react";

const place_list = data.map((data) => {
  return <Main key={data.id} {...data} />;
});



function App() {
  const [darkMode,setDarkMode]=React.useState(false)
  console.log(darkMode)
  const toggle=()=>{
    setDarkMode((prevState)=>!prevState)
  }
  return (
    <div className="App" style={{backgroundColor: darkMode?"#28282B":"whitesmoke", color: darkMode?"white":"#28282B"}}>
      <Header darkMode={darkMode} toggle={toggle} />
      <section className="place-list">{place_list}</section>
      <Footer />
    </div>
  );
}

export default App;
