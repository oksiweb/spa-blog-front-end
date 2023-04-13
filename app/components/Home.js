import React, { useEffect, useContext } from "react";
import Page from "./Page";
import Axios from "axios";
import {StateContext} from "../context/StateContext";
import { useImmer } from "use-immer"
import Post from './Post'

function Home() {
  const appState = useContext(StateContext)
  const [state, setState] = useImmer({
    isLoading: true,
    feed: []
  })

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchData() {
      try {
        const response = await Axios.post(`/getHomeFeed`, { token: appState.user.token }, { cancelToken: ourRequest.token })
        setState(draft => {
          draft.feed = response.data
        })
      } catch (e) {
        console.log("There was a problem.")
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  return (
    <Page title="Your Feed">
      {
        state.feed.length === 0 ?
        <>
        <h2 className="text-center">
          Hello <strong>{localStorage.getItem("complexappUsername")}</strong>, your feed is empty.
        </h2>
        <p className="lead text-muted text-center">Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p>
        </> :
        <div className="list-group">
          {state.feed.map(post => {
              return (<Post post={post} key={post._id} />)
            })
          }
        </div>
      }
 
    </Page>
  )
}

export default Home
