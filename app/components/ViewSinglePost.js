import React, { useState, useEffect, useContext } from "react"
import Page from "./Page"
import LoadingDotsIcon from './LoadingDotsIcon';
import { useParams, Link, useNavigate } from "react-router-dom";
import Axios from 'axios';
import ReactMarkdown from "react-markdown";
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import { StateContext } from "../context/StateContext";
import { DispatchContext } from "../context/DispatchContext";
import {FLASH_MESSAGES} from '../actions/types'
import NotFound from './NotFound'


function ViewSinglePost() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/post/${id}`)
        setPost(response.data)
        setIsLoading(false)
        
      } catch (e) {
        console.log("There was a problem.", e)
      }
    }
    fetchPosts()
  }, [])

  if(!isLoading && !post){
    return <NotFound />
  }

  if (isLoading) return <div><LoadingDotsIcon/></div>
  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  function isOwner(){
    if(appState.loggedIn){
        console.log(post, 'post test')
        return appState.user.username === post.author.username
    }
    return false
  }

  async function handleDelete(){
    const deletePost = window.confirm("Do you really want to delete this post");
    if(deletePost){
      try {
        let response = await Axios.delete(`/post/${id}`, {data: {token: appState.user.token}});
        if(response.data){
          appDispatch({type: FLASH_MESSAGES, payload: 'You are succesfully delete the post' })
          navigate(`/profile/${appState.user.username}`)
        }
      } catch(e){
        console.log(e)
      }
    }
  }
  return (
    <Page title="Fake Hardcoded Title">
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {
          isOwner() &&
          <span className="pt-2">
          <Link to={`/post/${id}/edit`} data-tooltip-id="edit" data-tooltip-content="Edit" className="text-primary mr-2">
            <i className="fas fa-edit"></i>
          </Link>
          <Tooltip id='edit' className="custom-tooltip" />{"  "}
          <a data-tooltip-id="delete" onClick={handleDelete}  data-tooltip-content="Delete" className="delete-post-button text-danger" >
            <i className="fas fa-trash"></i>
          </a>
          <Tooltip id='delete' className="custom-tooltip" />
        </span>
        }
      </div>

      <p className="text-muted small mb-4">
        <a href="#">
          <img className="avatar-tiny" src={post.author.avatar} />
        </a>
        Posted by <a href="#">{post.author.username}</a> on {dateFormatted}
      </p>

      <div className="body-content">
         <ReactMarkdown  children={post.body} />
       </div>
       </Page>
  )
}

export default ViewSinglePost
