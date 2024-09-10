import React, { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import xicon from "../../assets/images/xicon.png"
import instagram from "../../assets/images/instagram.png"
import tiktok from "../../assets/images/tiktok.png"
export default function Social() {
    const [xLink, setXLink] = useState("https://twitter.com/SpotSoundMusic")
    const [instagramLink, setinstagramLink] = useState("https://www.instagram.com/spotsoundappoffical/")
    const [tiktokLink, setTiktokLink] = useState("https://www.tiktok.com/@spotsoundmusic?lang=tr-TR")
    return (
        <Row >
            <Col xs="4" md="4">
                <div className='social-icon-content'>
                    <div className="icon-content right">
                        <a className='right' href={xLink} target="_blank"><img src={xicon} /></a>
                    </div>
                </div>
            </Col>
            <Col xs="4" md="4">
                <div className='social-icon-content'>
                    <div className="icon-content">
                        <a href={instagramLink} target="_blank"><img src={instagram} /></a>
                    </div>
                </div>
            </Col>
            <Col xs="4" md="4">
                <div className='social-icon-content'>
                    <div className="icon-content left">
                        <a href={tiktokLink} target="_blank"><img src={tiktok} /></a>
                    </div>
                </div>
            </Col>
        </Row>
    )
}
