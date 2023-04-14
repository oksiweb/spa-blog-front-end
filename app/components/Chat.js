import React, { useEffect, useContext, useRef } from "react"
import {StateContext} from "../context/StateContext"
import {DispatchContext} from "../context/DispatchContext"
import { IS_CHAT_CLOSE } from "../actions/types"
import { useImmer } from "use-immer"
import {Link} from 'react-router-dom'
import io from "socket.io-client"
import { COUNT_UNREAD_CHAT_MESSAGES, CLEAR_UNREAD_CHAT_MESSAGES } from "../actions/types";

function Chat() {
  const socket = useRef(null);
  const chatField = useRef(null);
  const chatLog = useRef(null);
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: [],
  })

  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus()
      appDispatch({type: CLEAR_UNREAD_CHAT_MESSAGES})
    }
  }, [appState.isChatOpen])

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET_SERVER || "https://spa-blog-backend-api.onrender.com")
    socket.current.on("chatFromServer", (message) => {
      setState((draft) => {
        draft.chatMessages.push(message)
      })
    })
    return () => socket.current.disconnect()
  }, [])

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
    if(state.chatMessages.length && !appState.isChatOpen){
      appDispatch({type: COUNT_UNREAD_CHAT_MESSAGES})
    }
  },[state.chatMessages])

  const handleChangeFieldValue = (e) => {
    const value = e.target.value;
    setState(draft => {
      draft.fieldValue = value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send message to chat server
    socket.current.emit("chatFromBrowser", { message: state.fieldValue, token: appState.user.token })

    setState(draft => {
      draft.chatMessages.push({ message: draft.fieldValue, username: appState.user.username, avatar: appState.user.avatar })
      draft.fieldValue = ""
    })
  }

  return (
    <div id="chat-wrapper" 
    className={"chat-wrapper shadow border-top border-left border-right " + (appState.isChatOpen ? "chat-wrapper--is-visible" : "")}>
      <div className="chat-title-bar bg-primary">
        Chat
        <span onClick={() => appDispatch({ type: IS_CHAT_CLOSE })} className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {
          state.chatMessages.map((message, index) => {
            if (message.username == appState.user.username) {
              return (
                <div className="chat-self" key={index}>
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
              )
            } else {
              return (
                <div key={index} className="chat-other">
                <Link to={`/profile/${message.username}`}>
                  <img className="avatar-tiny" src={message.avatar} />
                </Link>
                <div className="chat-message">
                  <div className="chat-message-inner">
                  <Link to={`/profile/${message.username}`}>
                      <strong>{message.username} </strong>
                    </Link>
                    {message.message}
                  </div>
                </div>
              </div>
              )
            }
          }) 
        }
       

       
      </div>
      <form id="chatForm" className="chat-form border-top" onSubmit={handleSubmit}>
        <input value={state.fieldValue} onChange={handleChangeFieldValue}
        ref={chatField} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
      </form>
    </div>
  )
}

export default Chat
