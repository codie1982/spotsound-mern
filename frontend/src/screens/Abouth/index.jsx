import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import googleIcon from "../../assets/images/Google__G__logo.png"
import xLogo from "../../assets/images/X_icon.png"
import intagramLogo from "../../assets/images/instagram_icon.png"
import facebookLogo from "../../assets/images/facebook_icon.png"
import logo from "../../assets/images/logo.png"
export default function Abouth() {
    return (
        <div className="flex-row-section" >
            <div className="abouth-section-img" />
            <div className="abouth-section-description" >
                <div className="container-fluid">
                    <Row>
                        <Col md="12">
                            <div className="text-section">
                                <h1 className="main-title text-uppercase text-white display-1">Upload, Play, and Enjoy Your Music Offline with SpotSound</h1>
                            </div>
                            <Row>
                                <Col>
                                    <div className="abouth-description-content">
                                        <p className="text-white abouth-description-text">SpotSound is a revolutionary music application designed to provide users with a personalized music experience. Our platform allows users to effortlessly upload their favorite songs from their computers, create custom playlists, and enjoy their music offline on any device. With SpotSound, we are bridging the gap between a traditional music app and a social platform, enabling users to share their musical journey with friends and the community. Additionally, our upcoming feature will allow users to broadcast their own live radio stations, bringing a dynamic, interactive element to the music experience. At SpotSound, we prioritize ease of use, music discovery, and community engagement, making us the perfect choice for anyone looking to enhance their listening experience. Join us today and be a part of the SpotSound revolution, where your music journey begins.</p>

                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="logo_section">
                                <img src={logo} />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="4" md="4">
                            <div className="icon-content right">
                                <a className='right' href="https://twitter.com/SpotSoundMusic" target="_blank"><img src={xLogo} /></a>
                            </div>
                        </Col>
                        <Col xs="4" md="4">
                            <div className="icon-content">
                                <a className='center' href="https://www.instagram.com/spotsoundoffical/" target="_blank"><img src={intagramLogo} /></a>
                            </div>
                        </Col>
                        <Col xs="4" md="4">
                            <div className="icon-content left">
                                <a className='left' href="https://www.facebook.com/profile.php?id=61564695863328&locale=tr_TR" target="_blank"><img src={facebookLogo} /></a>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
