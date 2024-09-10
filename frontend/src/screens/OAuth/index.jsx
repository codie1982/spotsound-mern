import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { getMe, rese } from "../../features/auth/authSlice"

import { Row, Col, Spinner, Form, ButtonGroup, Button } from "react-bootstrap"
import { useNavigate, useSearchParams } from "react-router-dom";
import Lottie from "lottie-react";
import heartAnimation from "../../assets/images/heart.json";
import { useTranslation } from "react-i18next"
export default function OAuth() {
    const [t, i18n] = useTranslation("global")
    const [token, setToken] = useState()
    const [username, setusername] = useState("")
    const [profileImage, setProfileImage] = useState("")
    const [email, setEmail] = useState("")
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { data, isLoading, isError, isSuccess, message } = useSelector(
        (state) => {
            return state.auth
        }
    )
    useEffect(() => {

        //console.log(searchParams.get("token"))

     }, [])

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token)
          //  dispatch(getMe(token))
        }
    }, [token])
    useEffect(() => {
        if (data) {
            setusername(data.name)
            setProfileImage(data.image)
            setEmail(data.email)
        }
    }, [data])

    if (isLoading) {
        return (
            <div className="container ms-auto">
                <div className="main-body">
                    <Spinner />
                </div>
            </div>
        )
    }
    return (
        <>
            <div className="container ms-auto">
                <div className="main-body">
                    <Row>
                        <Col md="12">
                            <div className="row">
                                <div className="col-lg-12 col-sm-offset-3">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex flex-column align-items-center text-center">
                                                <img src={profileImage} alt="Admin" className="rounded-circle p-1 bg-primary" width="110" />
                                                <p className="text-secondary mb-1">{email}</p>
                                                <div className="mt-3">
                                                    <h4>{username}</h4>

                                                    <ButtonGroup aria-label="Basic example">
                                                        <Lottie animationData={heartAnimation} />
                                                    </ButtonGroup>
                                                    <ButtonGroup aria-label="Basic example">
                                                        <Button onClick={() => { navigate("/") }} variant="danger">{t("oauth.backhome")}</Button>
                                                    </ButtonGroup>
                                                </div>
                                                <p className="text-secondary mb-1">{t("oauth.thankyou")}{"Bizi Takip ettiğin için teşekkür ederiz. Seni SpotSound Gelişmelerinden haberdar etmeye devam edeceğiz."}</p>

                                               {/* 
                                                <p className="text-secondary mb-1">{"Bizi Takip ettiğin için teşekkür ederiz. Seni SpotSound Gelişmelerinden haberdar etmeye devam edeceğiz."}</p>
                                                <p className="text-secondary mb-1">{"Çok yakında Şarkılarını yükleyebileceğin bir profil sayfası ve yüklediğin şarkıları çevrimdışı olarak dinleyebilmen için bir mobil uygulama ile karşına çıkmaya hazırlanıyoruz."}</p>
                                                <p className="text-secondary mb-1">{"Potansiyel gelişmelerden haberdar olman için onayını istiyoruz. Eğer bizden haber veya mail almak istemiyorsan istemiyorum checkbox'unu işaretleyebilirsin."}</p>
 */}
                                                {/* <Form>
                                                    <div className="mb-3">
                                                        <Form.Check type={"checkbox"} id={`check-api-${"checkbox"}`}>
                                                            <Form.Check.Input type={"checkbox"} isValid />
                                                            <Form.Check.Label>{`Gelişmelerden haberdar olmak istiyorum`}</Form.Check.Label>
                                                            <Form.Control.Feedback type="valid">
                                                                Evet !!!
                                                            </Form.Control.Feedback>
                                                        </Form.Check>
                                                    </div>
                                                </Form> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}
