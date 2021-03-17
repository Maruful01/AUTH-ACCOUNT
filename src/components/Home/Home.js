import React, { useState } from 'react';
import './Home.css';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import firebaseConfig from './firebase.config';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
 }else {
    firebase.app();
 }
const provider = new firebase.auth.GoogleAuthProvider();
var fbProvider = new firebase.auth.FacebookAuthProvider();
const Home = () => {
    const [user, setUser] = useState({
      isSignedIn: false,
      name: '',
      password: '',
      email: '',
      photo: ''
    });
    const handleLogin = () => {
        firebase.auth()
        .signInWithPopup(provider)
        .then(result => {
          const {displayName, photoURL, email} = result.user;
          const signedInUser = {
            isSignedIn: true,
            name: displayName,
            password: '',
            email: email,
            photo:  photoURL
          }
          var user = result.user;
          setUser(signedInUser);
          console.log (user)
        })
        .catch(error => {
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
          console.log (errorMessage, email, errorCode, credential)
        });
    }
    const handleSignOut = () => {
      firebase.auth().signOut().then(() => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          password: '',
          email: '',
          photo:  ''
        }
        setUser(signedOutUser);
        
      }).catch((error) => {
        // An error happened.
      });
      
    }
    const handleFbLogin = () => {
        firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then(result => {
    var credential = result.credential;
    var user = result.user;
    var accessToken = credential.accessToken;
    setUser(user);
    console.log (user)
  })
  .catch(error => {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
    console.log (errorMessage, email, errorCode, credential)
    setUser(errorMessage);
  });
    }
    const handleSubmit = (e) => {
      console.log(user.email, user.password)
        if (user.email && user.password) {
          firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
          .then((userCredential) => {
            var user = userCredential.user;
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
          });
        }
        e.preventDefault();
    }
    const handleChange = (e) => {
       let isFormValid = true;
       if (e.target.name === "email") {
           isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
       }
       if (e.target.name === "password") {
        isFormValid = e.target.value.length > 6 && /\d{1}/.test (e.target.value);
       }
       if (isFormValid) {
        const newUserInfo = {...user};
        newUserInfo[e.target.name] = e.target.value;
        setUser(newUserInfo);
       }
    }
    return (
        <div className="user-info">
            <div className="form">
                <div>
                 {
                   user.isSignedIn ? <button className="login-btn"  onClick={() => handleSignOut()}> Sign out using 
                   <span className="google" style={{color: "yellow", fontSize: "20px"}}> Google </span> </button>
                    : <button className="login-btn"  onClick={() => handleLogin()}> Sign in using 
                    <span className="google" style={{color: "yellow", fontSize: "20px"}}> Google </span> </button>
               
                 }
                </div>

                <div>
                 <button className="login-btn"  onClick={() => handleFbLogin()}> Sign in using 
                 <span className="google" style={{color: "blue", fontSize: "20px"}}> facebook </span> </button>
                </div>
                <br/>
                <form onSubmit={handleSubmit}>
                <h3>Our own Authentication</h3>
                <input type="text" onBlur={handleChange} name="name" placeholder="Your name" required/>
                <br/>
                <input type="text" onBlur={handleChange} name="email" placeholder="Your email" required/>
                <br/>
                <input type="password" onBlur={handleChange} name="password" placeholder="Password" required/>
                <br/>
                <input type="submit" value="Submit"/>
                </form>
            </div>
           <h1>Your Information</h1>
           {
             user.isSignedIn && <> <p>{user.name}</p>
                                      {user.email}
                                      <br/>
                                      <img src={user.photo} alt=""/> </>
           }
        </div>

    );
};

export default Home;