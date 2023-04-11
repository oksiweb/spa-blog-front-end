import React, { useEffect, useContext } from "react"
import { LOGOUT } from "../actions/types";
import { DispatchContext } from "../context/DispatchContext";
import { StateContext } from "../context/StateContext";
import {  Link } from "react-router-dom";

function HeaderLoggedIn(props) {
  let dispatch = useContext(DispatchContext);
  let {user} = useContext(StateContext);
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch({type: LOGOUT})
  }
  return (
    <div className="flex-row my-3 my-md-0">
      <a href="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <span className="mr-2 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <Link to={`/profile/${user.username}`} className="mr-2">
        <img className="small-header-avatar" src={user.avatar} />
      </Link>
      <a className="btn btn-sm btn-success mr-2" href="/create-post">
        Create Post
      </a>
      <button onClick={handleLogout} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  )
}

export default HeaderLoggedIn
