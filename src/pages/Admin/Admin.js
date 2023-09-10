import React, { useState, useEffect } from "react";
import "./Admin.css";
import { auth } from "../../firebase-config";
import {
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const nav=useNavigate();
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    // Check if a user is already signed in
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    // Cleanup the subscription to avoid memory leaks
    return () => unsubscribe();
  }, []);

  // Function to sign in with Google
  const handleSignIn = (e) => {
    e.preventDefault();
    const email = document.getElementsByClassName("email")[0].value;
    const password = document.getElementsByClassName("password")[0].value;
    console.log(email);
    console.log(password);
    setPersistence(auth, browserSessionPersistence)
      .then()
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
        const newUser = result.user;
        setUser(newUser);
        console.log(newUser);
      })
      .catch((error) => {
        setLoginError(true);
      });
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log("Sign out successful")
      nav("/")
    }).catch((error) => {
      // An error happened.
      console.log(error)
    });
  };

  return (
    <div className="admin">
      {user == null ? (
        <div className="loginCont">
          <h1 className="login-title">ADMIN LOGIN</h1>
          <form className="loginForm">
            <h3 style={{marginBottom:"4px"}}>EMAIL</h3>
            <input
              type="text"
              className="email"
              style={{
                border: "none",
                backgroundColor: "rgba(0, 110, 255, 0.267)",
                height: "20px",
              }}
            />
            <h3 style={{marginBottom:"4px"}}>PASSWORD</h3>
            <input
              type="password"
              className="password"
              style={{
                border: "none",
                backgroundColor: "rgba(0, 110, 255, 0.267)",
                height: "20px",
                marginBottom:"40px"
              }}
            />{" "}
            <br />
            <br />
            <button className="adminloginbtn" onClick={(e) => handleSignIn(e)}>
              LOGIN
            </button>
          </form>
          {loginError ? (
            <h2 className="error">Incorrect Username or Password!</h2>
          ) : (
            ""
          )}
        </div>
      ) : (
        <div className="admin-dash">
          <h1>WELCOME BACK ZEUS!</h1>
          <div className="form">
            <button type="button" onClick={handleSignOut}> SIGN OUT</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
