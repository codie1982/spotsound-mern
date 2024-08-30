import React,{useState} from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import brand from "../../assets/images/brand.png"
import xLogo from "../../assets/images/X_icon.png"
import intagramLogo from "../../assets/images/instagram_icon.png"
import facebookLogo from "../../assets/images/facebook_icon.png"
import downloadIcon from "../../assets/images/download_icon.png"
import uploadIcon from "../../assets/images/upload_icon.png"
import noInternetIcon from "../../assets/images/nointernet_icon.png"
import googleIcon from "../../assets/images/Google__G__logo.png"

import { GoogleOAuthProvider,GoogleLogin,useGoogleLogin } from '@react-oauth/google';

import logo from "../../assets/images/logo.png"
export default function HOME() {
  /* const login = useGoogleLogin({
    onSuccess: tokenResponse => console.log(tokenResponse),
  });  */

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
                      <Col  md="9">
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
                      <Col md="6">
                      <GoogleOAuthProvider clientId="621103493987-9g9m1jl5sagdl8hid6hqm35ppc3q3qcl.apps.googleusercontent.com">
                      <GoogleLogin
                          onSuccess={credentialResponse => {
                            console.log(credentialResponse);
                          }}
                          onError={() => {
                            console.log('Login Failed');
                          }}
                        />
                        {/* <Button  onClick={() => login()} className="btn-google">
                          <img src={googleIcon} className="btn-google-icon" />
                          <span className="btn-google-text" >Follow Us With Google Subscribe!</span>
                        </Button> */}
                      </GoogleOAuthProvider>
                      
                          </Col>
                      <Col md="1"><a href="#" target="_blank"><img src={xLogo} /></a></Col>
                      <Col md="1"><a href="#" target="_blank"><img src={intagramLogo} /></a></Col>
                      <Col md="1"><a href="#" target="_blank"><img src={facebookLogo} /></a></Col>
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
