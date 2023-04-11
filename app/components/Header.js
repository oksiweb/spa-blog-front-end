import React, {useState, useContext} from "react"
import {  Link } from "react-router-dom";
import { StateContext } from "../context/StateContext";

import HeaderLoggedIn from './HeaderLoggedIn';
import HeaderLoggedOut from './HeaderLoggedOut';

function Header() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const {loggedIn} = useContext(StateContext);

  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            PostsApp
          </Link>
        </h4>
        {
          loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut  />
        }
      </div>
    </header>
  )
}

export default Header
