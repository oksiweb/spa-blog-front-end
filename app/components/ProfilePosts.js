import React, { useEffect, useState } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from './LoadingDotsIcon';
import Post from './Post'

function ProfilePosts(props) {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, { canselToken: ourRequest.token })
        setPosts(response.data)
        setIsLoading(false)
        console.log(response.data);
      } catch (e) {
        console.log("There was a problem or request was canceled")
      }
    }
    fetchPosts()
    return () => {
      console.log('cancel request');
      ourRequest.cancel();
    }
  }, [username])

  if (isLoading) return <LoadingDotsIcon />

  return (
    <div className="list-group">
      {posts.map(post => {
        return (<Post post={post} key={post._id} noAuthor={true} />)
      })}
    </div>
  )
}

export default ProfilePosts
