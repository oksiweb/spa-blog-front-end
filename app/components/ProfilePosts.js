import React, { useEffect, useState } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from './LoadingDotsIcon';

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
  }, [])

  if (isLoading) return <LoadingDotsIcon />

  return (
    <div className="list-group">
      {posts.map(post => {
        const date = new Date(post.createdDate)
        const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

        return (
          <Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong> <span className="text-muted small">on {dateFormatted} </span>
          </Link>
        )
      })}
    </div>
  )
}

export default ProfilePosts
