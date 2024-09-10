import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import googleIcon from "../../assets/images/Google__G__logo.png"
import Social from "../../components/Social"
import logo from "../../assets/images/logo.png"
import { useTranslation } from "react-i18next"
export default function Abouth() {
    const [t, i18n] = useTranslation("global")

    return (
        <div className="flex-row-section" >
            <div className="abouth-section-img" />
            <div className="abouth-section-description" >
                <div className="container-fluid">
                    <Row>
                        <Col xs="12" md="12">
                            <div className="text-section">
                                <h1 className="main-title text-uppercase text-white display-1">{t("abouth.title")}</h1>
                            </div>
                            <Row>
                                <Col xs="12">
                                    <div className="abouth-description-content">
                                        <p className="text-white abouth-description-text">{t("abouth.description")}</p>
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
                    <Social />
                </div>
            </div>
        </div>
    )
}
