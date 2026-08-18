import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthGuard from "./components/AuthGuard";
import Home, { HomeMyTravels } from "./pages/Home";
import TripDetail from "./pages/TripDetail";
import CreateTrip from "./pages/CreateTrip";
import CreatePhoto from "./pages/CreatePhoto";
import EditTrip from "./pages/EditTrip";
import EditPhoto from "./pages/EditPhoto";
import PhotoDetail from "./pages/PhotoDetail";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import SignIn from "./pages/SignIn";

function LegacyRedirect() {
  const { id } = useParams();
  return <Navigate to={`/trip/${id}`} replace />;
}

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <AuthProvider>
      <div className="App" data-theme={darkMode ? "dark" : "light"}>
        <Router>
          <Header darkMode={darkMode} toggle={() => setDarkMode((d) => !d)} />
          <div className="main-body">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/my-travels" element={<HomeMyTravels />} />
              <Route path="/trip/:tripId" element={<TripDetail />} />
              <Route
                path="/create"
                element={
                  <AuthGuard>
                    <CreateTrip />
                  </AuthGuard>
                }
              />
              <Route
                path="/create-photo"
                element={
                  <AuthGuard>
                    <CreatePhoto />
                  </AuthGuard>
                }
              />
              <Route
                path="/trip/:tripId/edit"
                element={
                  <AuthGuard>
                    <EditTrip />
                  </AuthGuard>
                }
              />
              <Route
                path="/photo/:photoId/edit"
                element={
                  <AuthGuard>
                    <EditPhoto />
                  </AuthGuard>
                }
              />
              <Route path="/photo/:photoId" element={<PhotoDetail />} />
              <Route path="/profile/:uid" element={<Profile />} />
              <Route
                path="/notifications"
                element={
                  <AuthGuard>
                    <Notifications />
                  </AuthGuard>
                }
              />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/location/:id" element={<LegacyRedirect />} />
              <Route path="/admin" element={<Navigate to="/signin" replace />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
