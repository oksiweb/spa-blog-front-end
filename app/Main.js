import React, {useEffect, useReducer, Suspense} from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group"
import Axios from "axios"
Axios.defaults.baseURL = process.env.REACT_APP_SOCKET_SERVER;

// My Components
import LoadingDotsIcon from "./components/LoadingDotsIcon";
import Header from "./components/Header"
import About from "./components/About"
import Terms from "./components/Terms"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"
import FlashMessages from "./components/FlashMessages";
import Home from "./components/Home"
import Profile from "./components/Profile"
const CreatePost = React.lazy(() => import("./components/CreatePost"))
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"))
const Search = React.lazy(() => import("./components/Search"))
const Chat = React.lazy(() => import("./components/Chat"))
import EditPost from './components/EditPost'
import NotFound from './components/NotFound'

import { DispatchContext } from "./context/DispatchContext";
import { StateContext } from "./context/StateContext";
import { FLASH_MESSAGES, LOGIN, LOGOUT, IS_CHAT_OPEN, IS_CHAT_CLOSE,
  IS_SEARCH_CLOSE, IS_SEARCH_OPEN, COUNT_UNREAD_CHAT_MESSAGES, CLEAR_UNREAD_CHAT_MESSAGES } from "./actions/types";

function Main() {
  const initialState = {
    loggedIn: !!localStorage.getItem('complexappToken'),
    flashMessages: [],
    user: {
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar"),
      token: localStorage.getItem("complexappToken")
    },
    isSearchOpen: false,
    isChatOpen: false,
    unReadChatCount: 0
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
      if(action.type === IS_SEARCH_OPEN){
        return {
          ...state,
          isSearchOpen: true
        }
      }
      if(action.type === IS_SEARCH_CLOSE){
        return {
          ...state,
          isSearchOpen: false
        }
      }
      if(action.type === IS_CHAT_OPEN){
        return {
          ...state,
          isChatOpen: true
        }
      }
      if(action.type === IS_CHAT_CLOSE){
        return {
          ...state,
          isChatOpen: false
        }
      }
      if(action.type === COUNT_UNREAD_CHAT_MESSAGES){
        return {
          ...state,
          unReadChatCount: state.unReadChatCount + 1
        }
      }
      if(action.type === CLEAR_UNREAD_CHAT_MESSAGES){
        return {
          ...state,
          unReadChatCount: 0
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

  useEffect(() => {
    if (state.loggedIn) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post("/checkToken", { token: state.user.token }, { cancelToken: ourRequest.token })
          if(!response.data){
            dispatch({type: LOGOUT});
            dispatch({type: FLASH_MESSAGES, payload: 'Your session has expired, please login again'});
          }
        } catch (e) {
          console.log("There was a problem or the request was cancelled.")
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [])

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        <BrowserRouter>
          <FlashMessages />
          <Header />
          <Suspense fallback={<LoadingDotsIcon />}>
          <Routes > 
            <Route path="/" element={state.loggedIn ? <Home /> : <HomeGuest />} /> 
            <Route path="/about-us" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/profile/:username/*" element={<Profile />} />
          
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/post/:id" element={<ViewSinglePost />} />
            <Route path="/post/:id/edit" element={<EditPost />} />
            <Route path="*" element={<NotFound />} />
          </Routes> 
          </Suspense>
          <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">
            {state.loggedIn && <Chat />}
          </Suspense>
          <Footer />
        </BrowserRouter>
    </StateContext.Provider>
    </DispatchContext.Provider> 
  )
}

export default Main;