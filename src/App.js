import React, { useReducer, useEffect } from "react";

import { Container, Col, Row } from "reactstrap";

// react-router-dom3
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// react toastify stuffs
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// firebase stuffs
//TODO: DONE import firebase config and firebase database
import {firebaseConfig} from "./utils/config";
//FIXME: TODO:import firebase from "firebase/app";
import firebase from 'firebase/compat/app';

import "firebase/compat/database"
import "firebase/compat/storage"

// components
import AddContact from "./pages/AddContact";
import Contacts from "./pages/Contacts";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import ViewContact from "./pages/ViewContact";
import PageNotFound from "./pages/PageNotFound";

// context api stuffs
//TODO: DONE: import reducers and contexts
import reducer from "./context/reducer";
import { ContactContext } from "./context/Context";
import {SET_CONTACT, SET_LOADING} from "./context/action.types"

//initlizeing firebase app with the firebase config which are in ./utils/firebaseConfig
//TODO: DONE: initialize FIREBASE
firebase.initializeApp(firebaseConfig)

// first state to provide in react reducer
const initialState = {
  contacts: [],
  contact: {},
  contactToUpdate: null,
  contactToUpdateKey: null,
  isLoading: false
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // will get contacts from firebase and set it on state contacts array
  const getContacts = async () => {
    // TODO: load existing data
    dispatch({
      type: SET_LOADING,
      payload: true
    });
    const contactsRef = firebase.database()
      .ref("/contacts");
    contactsRef.on("value",snapshot => {
      dispatch({
        type:SET_CONTACT,
        payload: snapshot.val()
      })
      dispatch({
        type: SET_LOADING,
        payload: false
      });
    })
  };

  // getting contact  when component did mount
  useEffect(() => {
    getContacts()
  }, []);

  return (
    <Router>
      <ContactContext.Provider value ={{state, dispatch}}>
        <ToastContainer />
        <Header />
        <Container>
          <Routes>
            <Route path="/contact/add" element={AddContact} />
            <Route path="/contact/view" element={ViewContact} />
            <Route path="/" element={Contacts} />
            <Route path="*" element={PageNotFound} />
          </Routes>
        </Container>

        <Footer />
      </ContactContext.Provider>
    </Router>
  );
};

export default App;
