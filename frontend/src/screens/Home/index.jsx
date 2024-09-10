import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { register, registerWithGoogle, resetAuth } from "../../features/auth/authSlice"
import { useNavigate, } from "react-router-dom";
import ManuelSpinner from '../../components/Spinner'
import Social from "../../components/Social"
import { Row, Col, Button, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'


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
                        <h2 className="sub-title text-white display-1">{t("home.h2")}</h2>
                        <h1 className="main-title text-uppercase text-white display-1">{t("home.h1")}</h1>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p className="text-white main-description">{t("home.description")}</p>
                    </Col>
                  </Row>

                  <Row className="mechanis-section">
                    <Col xs="12" md="6">
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
                                        <div className="text-white">{t("home.userhospilaty")} {userName}</div>
                                      </div>
                                      <div className="profil-text-section">
                                        <Button onClick={logout} variant="outline-danger" className="btn btn-alert">{t("home.isnotyouquestion")}</Button>
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
                          <Button disabled={googleAuth.isLoading ? true : false} onClick={() => login()} className="btn-google w-100">
                            {googleAuth && googleAuth.isSuccess ?
                              <>
                                <Spinner animation="grow" role="status" />
                              </>
                              :
                              <>
                                <img src={googleIcon} className="btn-google-icon" />
                              </>
                            }
                            <span className="btn-google-text" >{t("home.followgoogle")}</span>
                          </Button>
                        </>
                      }
                    </Col>
                    <Col >
                      <Social />
                    </Col>
                  </Row>
                  <Row className='mt-10'>
                    <Col md="4" xs="6">
                      <div className="icon_section m-auto">
                        <Row>
                          <Col><span>{t("home.onestep")}</span></Col>
                        </Row>
                        <Row>
                          <Col md="4" xs="2" >
                            <div className="icon_box">
                              <img className="icon_image" src={uploadImage} />
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col md="4" xs="6" >
                      <div className="icon_section">
                        <Row>
                          <Col><span>{t("home.twostep")} </span></Col>
                        </Row>
                        <Row>
                          <Col>
                            <div className="icon_box"><img className="icon_image" src={downloadImage} /></div>
                          </Col>
                        </Row>

                      </div>
                    </Col>
                    <Col md="4" xs="12" >
                      <div className="icon_section">
                        <Row>
                          <Col><span>{t("home.thireestep")}</span></Col>
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
