import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { register, registerWithGoogle, resetAuth } from "../../features/auth/authSlice"
import { check, connectionLanguage, resetConnection } from "../../features/connection/connectionSlice"
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
import ManuelSpinner from '../../components/Spinner'
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'

import xLogo from "../../assets/images/X_icon.png"
import intagramLogo from "../../assets/images/instagram_icon.png"
import facebookLogo from "../../assets/images/facebook_icon.png"
import downloadImage from "../../assets/images/download.jpg"
import uploadImage from "../../assets/images/upload.jpg"
import noInternetImage from "../../assets/images/listentomusic.jpg"
import googleIcon from "../../assets/images/Google__G__logo.png"
import logo from "../../assets/images/logo.png"
import ReactGA from "react-ga4";
import { useCookies } from 'react-cookie';
import { useTranslation } from "react-i18next"
import { useAuth } from '../../context/authContext'
export default function Home() {
  ReactGA.send({ hitType: "pageview", page: "/", title: "Home Page" });
  const { isLoading, isLogin, user, logout } = useAuth()
  const [cookies, setCookie] = useCookies(['name']);
  const [t, i18n] = useTranslation("global")


  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [userName, setUsername] = useState("")
  const [userImages, setUserimages] = useState("")


  const login = () => {
    dispatch(registerWithGoogle())
  };


  const googleAuth = useSelector(
    (state) => {
      return state.auth
    }
  )

  useEffect(() => {
    console.log("googleAuth",googleAuth)
    if (googleAuth.isError) {
      toast.error(googleAuth.data.message)
    }
    if (googleAuth.isSuccess) {
      if (googleAuth.redirecturl) {
        window.location.replace(googleAuth.redirecturl)
      }
    }
    dispatch(resetAuth())
  }, [googleAuth, navigate, dispatch])




  useEffect(() => {
   
    if (isLogin) {
      setUsername(user.name)
      setUserimages(user.image)
    }
  }, [isLogin, user])



  /*  useEffect(() => {
     if (connection) {
       if (connection.isError) {
         setUsername("")
         setUserimages("")
         setConnectionLoading(false)
       } else {
         if (connection && connection.result) {
           setUsername(connection.result.name)
           setUserimages(connection.result.image)
         }
         setConnectionLoading(connection.isLoading)
       }
     }
   }, [connection]) */




  /*   const onChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }))
    } */
  /*   const onSubmit = (e) => {
      e.preventDefault()
  
      if (password !== password2) {
        toast.error('password do not match')
      } else {
        const userData = {
          name,
          email,
          password,
        }
        dispatch(register(userData))
      }
    } */
  if (isLoading) {
    return <ManuelSpinner />
  }
  return (
    <>

      <Row>
        <Col>
          <section id="hero" className="min-vh-100 d-flex aling-items-center text-center">
            <div className="container">
              <Row>
                <Col md="7">
                  <Row>
                    <Col md="3">
                      <div className="logo_section">
                        <img src={logo} />
                      </div>

                    </Col>
                    <Col md="9">
                      <div className="text-section">
                        <h2 className="sub-title text-white display-1">Listen Offline Anytime, Anywhere</h2>
                        <h1 className="main-title text-uppercase text-white display-1">Upload, Play, and Enjoy Your Music Offline with SpotSound</h1>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p className="text-white main-description">SpotSound is a revolutionary music application designed to provide users with a personalized music experience. Our platform allows users to effortlessly upload their favorite songs from their computers, create custom playlists, and enjoy their music offline on any device. With SpotSound, we are bridging the gap between a traditional music app and a social platform, enabling users to share their musical journey with friends and the community. Additionally, our upcoming feature will allow users to broadcast their own live radio stations, bringing a dynamic, interactive element to the music experience. At SpotSound, we prioritize ease of use, music discovery, and community engagement, making us the perfect choice for anyone looking to enhance their listening experience. Join us today and be a part of the SpotSound revolution, where your music journey begins.</p>
                    </Col>
                  </Row>

                  <Row className="mechanis-section">
                    <Col xs="12" md="6">
                      {/*  <form onSubmit={onSubmit}>
                          <div className='form-group'>
                            <input
                              type='text'
                              className='form-control'
                              id='name'
                              name='name'
                              value={name}
                              placeholder='Enter your name'
                              onChange={onChange}
                            />
                          </div>
                          <div className='form-group'>
                            <input
                              type='email'
                              className='form-control'
                              id='email'
                              name='email'
                              value={email}
                              placeholder='Enter your email'
                              onChange={onChange}
                            />
                          </div>
                          <div className='form-group'>
                            <input
                              type='password'
                              className='form-control'
                              id='password'
                              name='password'
                              value={password}
                              placeholder='Enter password'
                              onChange={onChange}
                            />
                          </div>
                          <div className='form-group'>
                            <input
                              type='password'
                              className='form-control'
                              id='password2'
                              name='password2'
                              value={password2}
                              placeholder='Confirm password'
                              onChange={onChange}
                            />
                          </div>
                          <div className='form-group'>
                            <button type='submit' className='btn'>
                              Submit
                            </button>
                          </div>
                        </form> */}
                      {isLogin ?
                        <>
                          <div>
                            {userImages ?
                              <>
                                <div className="profil-section">
                                  <div className="profil-body">
                                    <img className="raunded" src={userImages} />
                                    <div className="profil-text-body">
                                      <div className="profil-text-section">
                                        <div className="text-white">Merhaba {userName}</div>
                                      </div>
                                      <div className="profil-text-section">
                                        <Button onClick={logout} variant="outline-danger" className="btn btn-alert">Bu sen değilmisin?</Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                              :
                              <>
                              </>
                            }
                          </div>
                        </>
                        :
                        <>
                          <Button disabled={googleAuth.isLoading ? true : false} onClick={() => login()} className="btn-google">
                            {googleAuth && googleAuth.isSuccess ?
                              <>
                                <Spinner animation="grow" role="status" />
                              </>
                              :
                              <>
                                <img src={googleIcon} className="btn-google-icon" />
                              </>
                            }
                            <span className="btn-google-text" >Follow Us With Google Subscribe!</span>
                          </Button>
                        </>
                      }
                    </Col>
                    <Col xs="4" md="2"><a href="https://twitter.com/SpotSoundMusic" target="_blank"><img src={xLogo} /></a></Col>
                    <Col xs="4" md="2"><a href="https://www.instagram.com/spotsoundoffical/" target="_blank"><img src={intagramLogo} /></a></Col>
                    <Col xs="4" md="2"><a href="https://www.facebook.com/profile.php?id=61564695863328&locale=tr_TR" target="_blank"><img src={facebookLogo} /></a></Col>
                  </Row>
                  <Row className="mt-5">
                    <Col >
                      <div className="icon_section">
                        <Row>
                          <Col><span>Upload Your Computer </span></Col>
                        </Row>
                        <Row>
                          <Col>
                            <div className="icon_box">
                              <img className="icon_image" src={uploadImage} />
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col >
                      <div className="icon_section">
                        <Row>
                          <Col><span>Download Your Mobile </span></Col>
                        </Row>
                        <Row>
                          <Col>
                            <div className="icon_box"><img className="icon_image" src={downloadImage} /></div>
                          </Col>
                        </Row>

                      </div>
                    </Col>
                    <Col >
                      <div className="icon_section">
                        <Row>
                          <Col><span>even if you don't have internet</span></Col>
                        </Row>
                        <Row>
                          <Col>
                            <div className="icon_box">
                              <img className="icon_image" src={noInternetImage} />
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </section>
        </Col>
      </Row>
    </>


  )
}
