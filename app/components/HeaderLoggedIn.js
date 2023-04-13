import React, {  useContext } from "react"
import { LOGOUT } from "../actions/types";
import { DispatchContext } from "../context/DispatchContext";
import { StateContext } from "../context/StateContext";
import {  Link } from "react-router-dom";
import { IS_SEARCH_OPEN, IS_CHAT_OPEN } from "../actions/types";
import { Tooltip } from "react-tooltip";

function HeaderLoggedIn(props) {
  let dispatch = useContext(DispatchContext);
  let {user, unReadChatCount } = useContext(StateContext);
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch({type: LOGOUT})
  }
  function handleSearchIcon(e) {
    e.preventDefault()
    dispatch({ type: IS_SEARCH_OPEN })
  }

  function handleChatIcon(e) {
    e.preventDefault()
    dispatch({ type: IS_CHAT_OPEN })
  }

  return (
    <div className="flex-row my-3 my-md-0">
    <a data-tooltip-id="search" data-tooltip-content="Search" onClick={handleSearchIcon} href="#" className="text-white mr-2 header-search-icon">
      <i className="fas fa-search"></i>
    </a>
    <Tooltip place="bottom" id="search" className="custom-tooltip" />{" "}
    <span data-tooltip-id="chat" data-tooltip-content="Chat" onClick={handleChatIcon} className={`mr-2 header-chat-icon ${unReadChatCount ? 'text-danger' : 'text-white'}`}>
      <i className="fas fa-comment"></i>
      <span className={`chat-count-badge text-white`}>
        {unReadChatCount < 10 ? unReadChatCount : '9+'}
      </span>
    </span>
    <Tooltip place="bottom" id="chat" className="custom-tooltip" />{" "}
    <Link data-tooltip-id="profile" data-tooltip-content="My Profile" to={`/profile/${user.username}`} className="mr-2">
      <img className="small-header-avatar" src={user.avatar} />
    </Link>
    <Tooltip place="bottom" id="profile" className="custom-tooltip" />{" "}
    <Link className="btn btn-sm btn-success mr-2" to="/create-post">
      Create Post
    </Link>{" "}
    <button onClick={handleLogout} className="btn btn-sm btn-secondary">
      Sign Out
    </button>
  </div>
  )
}

export default HeaderLoggedIn
