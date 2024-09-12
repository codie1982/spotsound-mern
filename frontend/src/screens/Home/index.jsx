import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { register, registerWithGoogle, resetAuth } from "../../features/auth/authSlice"
import { useNavigate, } from "react-router-dom";
import ManuelSpinner from '../../components/Spinner'
import Social from "../../components/Social"
import { Row, Col, Button, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'



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
                        <img src={"https://spotsound-cdn.s3.eu-central-1.amazonaws.com/logo.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaDGV1LWNlbnRyYWwtMSJHMEUCIQDN9il%2BeDe8utUtjMU9dF30QdixWsKMqc3ippM6BwhgeAIgda5MBJ2LU%2FuDLysBrIY0SbakFVttHeFaZYh1HmgQisAq8QIIo%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2OTI4NTk5MTY2MzciDE0vCwBFwpBmob02CCrFApZ2Rqr7W9elo6BEXVXuN1wmFXY8SKYDkaRNBz7ZzVWNEgb58H3iZc%2BjpM1IkDR0hxFvulGf0vg%2Fvh1yhg6oJB%2BFM%2FRw18OzVYtYLdLYOoJ4HAX8qXGxzMYIXpbckzzEQ%2BAKI%2F2DyV7FqSo1GSmgBjNKbLDEKkXIcn7naMpHP%2FrvY%2BMUYN4K3M4PXqaNVP7RuxaIBPdhicn%2FepS6m0YdblG29zrjl4dTGkhZ1YCEDKlMD6l6QHAuQIY4H80xHFSDQM1Tm9nbdRdbp8R7%2BISlS4JtMTswKyusuNh7N%2FYkkmPPbPTu0%2Bf8QXJuw7PhoHmp2%2FSkq%2FPoEOf%2BMy%2FM9jdE2rvrmdkY9OMs4%2Fc9pHI8b4R%2Fy4qNa0KhPMaDID91dZ5O%2BDDGlBKKYu%2BwfTGLWwCKAjrb0RzlefEgTFFisa%2BrZBbFvRnR2ZYwxemKtwY6swJTWRDqgHTd0bKbt0e5b9GeUV5FKNg9Rv%2BXTsXvLHysFMhk2oTpNQOXa9%2FsAG21n54QJdDel3KCuGLOXvJF7qaQdF1MM5KHBWa8GsvQwOqIGG2CPp0PwNdIBJI8LtPx3To4o1%2Bjg3nYvt3Fvdjtr4URArGiZKUuOC9XYsW3wxHqViQ8cs4Cd4c2PZSKlCxb6xFSPeqzmiiB8MM6fRL61fZ2zD8j3%2FiWH20jIPXhn%2BVTQMBpP9J89vQV%2Ft1iWBm6GUXSGaWrQfwkOz7l7%2FU5Vu2XiRWo%2BO%2BpQb9DQYUs92Nhw169IFd7sSIVDyrNbqtrTn2KOChbxaPqoAGplSipxPuxonZQWc%2FJyCWVzPzPBWdWef0GX%2FnIZIc98vEhsNta5Ljw8eJmdVOOg7ylJl%2FsuK35DdXD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240912T093254Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIA2CUNLKFO6GAMUIG6%2F20240912%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Signature=1c97d6684f3aa2d8231f9d49dcb3ff910c66957685f9bce19edd809f53070110"} />
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
                                <img src={"../../assets/images/Google__G__logo.png"} className="btn-google-icon" />
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
                              <img className="icon_image" src={"../../assets/images/upload.jpg"} />
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
                            <div className="icon_box"><img className="icon_image" src={"../../assets/images/download.jpg"} /></div>
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
                              <img className="icon_image" src={"../../assets/images/listentomusic.jpg"} />
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
