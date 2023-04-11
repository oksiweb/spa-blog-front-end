import React, { useContext, useEffect, useState } from "react"
import { useImmerReducer } from "use-immer"
import Page from "./Page"
import { useParams, Link, useNavigate } from "react-router-dom"
import Axios from "axios"
import LoadingDotsIcon from "./LoadingDotsIcon"
import { StateContext } from "../context/StateContext"
import { DispatchContext } from "../context/DispatchContext"
import {FLASH_MESSAGES} from '../actions/types'

function EditPost() {
  const {id} =  useParams();
  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: ""
    },
    body: {
      value: "",
      hasErrors: false,
      message: ""
    },
    isFetching: true,
    isSaving: false,
    id: id,
    sendCount: 0,
    notFound: false
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        draft.isFetching = false
        return
      case "titleChange":
        draft.title.hasErrors = false;
        draft.title.value = action.value
        return
      case "bodyChange":
        draft.body.hasErrors = false;
        draft.body.value = action.value
        return
      case "submitRequest":
        draft.sendCount++
        return
      case "requestWasStarted":
        draft.isSaving = true
        return
      case "requestWasFinished":
        draft.isSaving = false
        return
      case "titleRules":
        if(!action.value.trim()){
          draft.title.hasErrors = true;
          draft.title.message = "Title field can't be empty"
        }
        return
      case "bodyRules":
        if(!action.value.trim()){
          draft.body.hasErrors = true;
          draft.body.message = "Body field can't be empty"
        }
        return
      case "notFound":
        draft.notFound = true
        return
    }
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({type: 'titleRules', value: state.title.value})
    dispatch({type: 'bodyRules', value: state.body.value})
    dispatch({type: "submitRequest"})
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState);
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(state.sendCount){
      const ourRequest = Axios.CancelToken.source()
      dispatch({type: 'requestWasStarted'})
      async function fetchPost() {
        try {
          const response = await Axios.post(`/post/${state.id}/edit`, {title: state.title.value, body: state.body.value, token: appState.user.token}, { cancelToken: ourRequest.token })
          dispatch({type: 'requestWasFinished'})
          appDispatch({type: FLASH_MESSAGES, payload: 'Post was updated' })
          
        } catch (e) {
          console.log("There was a problem or the request was cancelled.")
        }
      }
      fetchPost()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.sendCount])

  useEffect(() => {
        const ourRequest = Axios.CancelToken.source()
        async function fetchPost() {
          try {
            const response = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token })
            if(response.data){
              if(appState.user.username !== response.data.author.username){
                appDispatch({type: FLASH_MESSAGES, payload: 'You not allow to edit this post' })
                navigate('/')
              } else {
                dispatch({type: "fetchComplete", value: response.data})
              }
            } else {
              dispatch({type: 'notFound'})
            }
          } catch (e) {
            console.log("There was a problem or the request was cancelled.", e)
          }
        }
        fetchPost()
        return () => {
          ourRequest.cancel()
        }
    
  }, [])

  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    )

  return (
    <Page title="Edit Post">
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onBlur={(e) => dispatch({type: 'titleRules', value: e.target.value})} value={state.title.value} onChange={(e) => dispatch({type: 'titleChange', value: e.target.value})} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
         { state.title.hasErrors &&
          <div className="alert small liveValidateMessage alert-danger">{state.title.message}</div>
         }
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onBlur={(e) => dispatch({type: 'bodyRules', value: e.target.value})} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" 
          value={state.body.value} onChange={(e) => dispatch({type: 'bodyChange', value: e.target.value})} />
          { state.body.hasErrors &&
          <div className="alert small liveValidateMessage alert-danger">{state.body.message}</div>
         }
        </div>

        <button className="btn btn-primary" disabled={state.isSaving} >Save Updates</button>
      </form>
    </Page>
  )
}

export default EditPost
