import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { getMe, reset } from "../../features/auth/authSlice"
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
  useSearchParams,
} from "react-router-dom";
export default function Profile() {
  const [token, setToken] = useState()
  const [username, setusername ] = useState("")
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(
    (state) => {
      return state.auth
    }
  )
  useEffect(() => {
    const token = searchParams.get("token")
    setToken(token)
    if (token) {
      dispatch(getMe(token))
    }else{
      navigate("/")
    }
  }, [])
  useEffect(() => {
    setusername(user.name)
  }, [user])

  if(!user){
    return (
      <div>Profil Sayfası</div>
    )
  }
  return (
    <div>Merhaba {username}</div>
  )
}
