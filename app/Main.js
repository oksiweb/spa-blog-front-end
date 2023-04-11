import React, {useEffect, useReducer} from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Axios from "axios"
Axios.defaults.baseURL = 'http://localhost:8080'

// My Components
import Header from "./components/Header"
import About from "./components/About"
import Terms from "./components/Terms"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import Home from "./components/Home"
import Profile from "./components/Profile"
import ProfilePosts from "./components/ProfilePosts"
import EditPost from './components/EditPost'
import NotFound from './components/NotFound'
import Search from './components/Search'

import { DispatchContext } from "./context/DispatchContext";
import { StateContext } from "./context/StateContext";
import { FLASH_MESSAGES, LOGIN, LOGOUT } from "./actions/types";

function Main() {
  const initialState = {
    loggedIn: !!localStorage.getItem('complexappToken'),
    flashMessages: [],
    user: {
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar"),
      token: localStorage.getItem("complexappToken")
    }
  }

  const reducer = (state, action) => {
      if(action.type === LOGIN){
        console.log(action.payload, 'test action payload');
        return {
          ...state,
          loggedIn: true,
          user: action.payload
        }
      }
      if(action.type === LOGOUT){
        return {
          ...state,
          loggedIn: false,
          user: null
        }
      }
      if(action.type === FLASH_MESSAGES){
        return {
          ...state,
          flashMessages: [...state.flashMessages, action.payload]
        }
      }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if(state.loggedIn){
      localStorage.setItem("complexappUsername", state.user.username);
      localStorage.setItem("complexappAvatar", state.user.avatar);
      localStorage.setItem("complexappToken", state.user.token);

    } else {
      localStorage.removeItem("complexappUsername");
      localStorage.removeItem("complexappAvatar");
      localStorage.removeItem("complexappToken");
    }
  }, [state.loggedIn])

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        <BrowserRouter>
          <FlashMessages />
          <Header />
          <Routes > 
            <Route path="/" element={state.loggedIn ? <Home /> : <HomeGuest />} /> 
            <Route path="/about-us" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/posts/:username" element={<ProfilePosts />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/post/:id" element={<ViewSinglePost />} />
            <Route path="/post/:id/edit" element={<EditPost />} />
            <Route path="*" element={<NotFound />} />
          </Routes> 
          {/* <Search /> */}
          <Footer />
        </BrowserRouter>
    </StateContext.Provider>
    </DispatchContext.Provider> 
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Main />)

if (module.hot) {
  module.hot.accept()
}
