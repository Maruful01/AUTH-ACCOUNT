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
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
      isSignedIn: false,
      name: '',
      password: '',
      email: '',
      error: '',
      success: false,
      photo: ''
    });
    //Google sign in 
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
    // sign out
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
    //fb sign in
  const handleFbLogin = () => {
        firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then(result => {
    const {displayName, photoURL, email} = result.user;
          const signedInUser = {
            isSignedIn: true,
            name: displayName,
            password: '',
            email: email,
            photo:  photoURL
          }
    setUser(signedInUser);
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
  // Sign in using email and password
    const handleSubmit = (e) => {
        if (newUser && user.email && user.password) {
          firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
          .then((userCredential) => {
            const user = userCredential.user;
            const newUserInfo = {...user};
            newUserInfo.success = true;
            newUserInfo.error = '';
            setUser (newUserInfo);
            updateUserInfo(user.name)
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const newUserInfo = {...user};
            newUserInfo.success = false;
            newUserInfo.error = errorMessage;
            setUser (newUserInfo);
          });
        }
        if (!newUser && user.email && user.password) {
          firebase.auth().signInWithEmailAndPassword(user.email, user.password)
          .then(res => {
          const newUserInfo = {...user};
          newUserInfo.success = true;
          newUserInfo.error = '';
          setUser (newUserInfo);
          console.log ("sign in user info", res.user)
          })
       .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const newUserInfo = {...user};
        newUserInfo.success = false;
        newUserInfo.error = errorMessage;
        setUser (newUserInfo);
  });
        }
        e.preventDefault();
    }
      const updateUserInfo = name => {
      var user = firebase.auth().currentUser;
            user.updateProfile({
            displayName: name,
            })
            .then(function() {
              console.log ("Updated user name")
            })
            .catch(function(error) {
            });
            console.log ()
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
                <div>
                <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
                <label htmlFor="newUser">Sign up</label>
                </div>
                
                <form onSubmit={handleSubmit}>
                <h3>Our own Authentication</h3>
                {
                  newUser && <input type="text" onBlur={handleChange} name="name" placeholder="Your name" required/>
                }
                <br/>
                <input type="text" onBlur={handleChange} name="email" placeholder="Your email address" required/>
                <br/>
                <input type="password" onBlur={handleChange} name="password" placeholder="Your Password" required/>
                <br/>
                <input type="submit" value={newUser ? "Sign up" : "Sign in"}/>
                </form>
            </div>
            <p style={{color: "red", fontSize: "15px"}}>{user.error}</p>
            {
              user.success && <p style={{color: "green", fontSize: "15px"}}>User {newUser ? "created" : "logged in"} successfully.</p>
            }
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