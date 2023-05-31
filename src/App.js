import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import data from "./data";

const place_list = data.map((data) => {
  return <Main key={data.id} {...data} />;
});

function App() {
  return (
    <div className="App">
      <Header />
      <section className="place-list">{place_list}</section>
      <Footer />
    </div>
  );
}

export default App;
