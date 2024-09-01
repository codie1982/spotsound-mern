import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { register, registerWithGoogle, reset } from "../../features/auth/authSlice"
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
import Spinner from '../../components/Spinner'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import brand from "../../assets/images/brand.png"
import xLogo from "../../assets/images/X_icon.png"
import intagramLogo from "../../assets/images/instagram_icon.png"
import facebookLogo from "../../assets/images/facebook_icon.png"
import downloadIcon from "../../assets/images/download_icon.png"
import uploadIcon from "../../assets/images/upload_icon.png"
import noInternetIcon from "../../assets/images/nointernet_icon.png"
import googleIcon from "../../assets/images/Google__G__logo.png"
import logo from "../../assets/images/logo.png"
import ReactGA from "react-ga4";
import { useCookies } from 'react-cookie';
export default function HOME() {
  const [cookies, setCookie] = useCookies(['name']);
  ReactGA.send({ hitType: "pageview", page: "/", title: "Home Page" });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })
  const [first, setFirst] = useState("")
  useEffect(() => {

    console.log("cookies",cookies)

    dispatch(reset())
  }, [])

  const login = () => {
    dispatch(registerWithGoogle())
  };

  const { name, email, password, password2 } = formData
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, googleurl, isLoading, isError, isSuccess, message } = useSelector(
    (state) => {
      console.log("state.auth",state.auth)
      return state.auth
    }
  )



  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      navigate('/')
    }
    if(googleurl){
      window.location.replace(googleurl.url)
    }
    dispatch(reset())
  }, [user, googleurl, isError, isSuccess, message, navigate, dispatch])


  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }
  const onSubmit = (e) => {
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
  }
  if (isLoading) {
    return <Spinner />
  }
  return (
    <div data-bs-spy="scroll" data-bs-target="#navbar-example">
      <Container className="section" fluid>
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <a className="navbar-brand" href="#"><img src={brand} /></a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link" aria-current="page" href="#">Abouth US</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" aria-current="page" href="#">Contact US</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
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

                    <Row>
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
                        <Button  onClick={() => login()} className="btn-google">
                          <img src={googleIcon} className="btn-google-icon" />
                          <span className="btn-google-text" >Follow Us With Google Subscribe!</span>
                        </Button>
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
                                <img className="icon_image" src={uploadIcon} />
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
                              <div className="icon_box"><img className="icon_image" src={downloadIcon} /></div>
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
                                <img className="icon_image" src={noInternetIcon} />
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
      </Container>
    </div>


  )
}
