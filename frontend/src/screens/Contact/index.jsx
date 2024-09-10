import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Container, Row, Col, Button, Card, Form, Spinner } from 'react-bootstrap'
import contactImage from "../../assets/images/contact-background.jpg"
import { useNavigate, } from "react-router-dom";
import { addSupport } from "../../features/support/supportSlice"
import googleIcon from "../../assets/images/Google__G__logo.png"
import Social from "../../components/Social"

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from 'react-toastify'
import { useAuth } from '../../context/authContext'
import ManuelSpinner from '../../components/Spinner'
import { useTranslation } from "react-i18next"

export default function Contact() {
  const [t, i18n] = useTranslation("global")
  const { isLoading, isLogin, user } = useAuth()
  const [isSuppoertloading, setIsSuppoertloading] = useState(false)
  const [isSuccess, setisSuccess] = useState(false)
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
  const [formData, setFormData] = useState({ subject: 0, description: "" })
  const [description, setDescription] = useState()
  const [subject, setSubject] = useState()
  const [lenghtLimitText, setLenghtLimitText] = useState("0/1024")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const supportResponse = useSelector(
    (state) => {
      return state.support
    }
  )
  useEffect(() => {
  }, [isLogin, user])
  useEffect(() => {
    if (isLogin) {
      console.log("supportResponse", supportResponse)
      if (supportResponse.isLoading) {
        setIsSuppoertloading(true)
      } else {
        setIsSuppoertloading(false)
        if (!supportResponse.isSuccess) {
          if (supportResponse.data == null) {
            toast.error("Destek isteğinde bir hata oluştu. Lütfen daha sonra tekrar deneyin")
          }
        } else {
          if (supportResponse.data != null) {
            setisSuccess(true)
            toast.success("Destek isteğiniz Başarı ile kayıt altına alındı")

          }
        }
      }
    }
  }, [supportResponse])

  useEffect(() => {
    setLenghtLimitText(`${formData.description.length}/1024`)
    if (formData.description.length >= 1024) {
      setLenghtLimitText(`Maximum karater limitini aştınız.`)
    }
  }, [formData])

  useEffect(() => {

    // Token başarılı bir şekilde oluşturuldu, sunucuya gönderin
    if (recaptchaToken && formData) {
      let { subject, description } = formData
      console.log('Form is submitted with reCAPTCHA token:', recaptchaToken, formData, subject, description);
      dispatch(addSupport({ recaptchaToken, subject, description }))
    }
  }, [recaptchaToken])

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!executeRecaptcha) {
      console.log('Execute recaptcha is not yet available');
      return;
    }

    if (!formData) {
      toast.error("Lütfen alanları doldurun.")
      return
    }
    if (!formData.subject) {
      toast.error("Lütfen Konu Seçimi yapın.")
      return
    }
    if (!formData.description) {
      toast.error("Lütfen Talebinizi giriniz.")
      return
    }
    if (formData.description.length >= 1024) {
      toast.error("Maximum 1024 karakter olmalı.")
      return
    }
    if (formData.description != null && formData.description != "" && formData.subject != null && formData.subject != 1 || formData.subject != 2 || formData.subject != 3 || formData.subject != 4) {
      const token = await executeRecaptcha('submit_form');
      if (token) {
        // Token başarılı bir şekilde oluşturuldu, sunucuya gönderin
        setRecaptchaToken(token);
      } else {
        toast.error("Lütfen reCAPTCHA doğrulamasını yapın.")
      }
    } else {
      toast.error("Lütfen alanları doldurun.")
    }
  };
  const goHome = () => {
    navigate("/")
  }
  if (isLoading) {
    return <ManuelSpinner />
  }

  return (
    <div className="flex-row-section" >
      <div className="contact-form-section" >
        <div className='contact-section'>
          <Card className='shadow p-3 mb-5 bg-body-tertiary rounded support-card'>
            {isLogin ?
              <>
                {isSuppoertloading ?
                  <>
                    <Spinner animation="grow" role="status" />
                  </>
                  :
                  <>
                    {isSuccess ?
                      <>
                        <Card.Body>
                          <Card.Title>{t("contact.contactustitle")}</Card.Title>
                          <Card.Text>
                            {t("contact.contactusdesc")}
                          </Card.Text>
                          <Card.Text>
                            <div className="profil-section">
                              <div className="profil-body">
                                <img className="raunded" src={user.image} />
                                <div className="profil-text-body">
                                  <div className="profil-text-section">
                                    <div className="text-black"> {t("contact.hello")} {user.name}</div>
                                  </div>
                                  <div className="profil-text-section">
                                    <div className="text-black">{user.email}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card.Text>
                        </Card.Body>
                      </>
                      :
                      <>
                        <Card.Body>
                          <Card.Title>{t("contact.contactustitle")}</Card.Title>
                          <Card.Text>
                            {t("contact.contactusdesc")}
                          </Card.Text>
                          <Card.Text>
                            <div className="profil-section">
                              <div className="profil-body">
                                <img className="raunded" src={user.image} />
                                <div className="profil-text-body">
                                  <div className="profil-text-section">
                                    <div className="text-black"> {t("contact.hello")} {user.name}</div>
                                  </div>
                                  <div className="profil-text-section">
                                    <div className="text-black">{user.email}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card.Text>
                          <Form onSubmit={handleSubmit}>
                            <Form.Select name="subject" onChange={(e) => {
                              setFormData((prevState) => {
                                return { ...prevState, "subject": parseInt(e.target.value) }
                              })
                            }} aria-label="Default select example">
                              <option>{t("contact.selected.title")}</option>
                              <option value="1">{t("contact.selected.one")}</option>
                              <option value="2">{t("contact.selected.two")}</option>
                              <option value="3">{t("contact.selected.three")}</option>
                              <option value="4">{t("contact.selected.four")}</option>
                            </Form.Select>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                              <Form.Label>{t("contact.selectedsupportdescription")}</Form.Label>
                              <Form.Control name="description" as="textarea" onChange={(e) => {
                                setFormData((prevState) => {
                                  return { ...prevState, "description": e.target.value }
                                })
                              }} rows={3} ></Form.Control>
                            </Form.Group>
                            <Card.Text>{lenghtLimitText}</Card.Text>
                            <div className="d-grid gap-2">
                              <Button type='submit' variant="primary" size="lg">
                                {t("contact.selectedsupportbutton")}
                              </Button>
                            </div>
                          </Form>
                        </Card.Body>
                      </>}
                    <Card.Body>
                      <Card.Title>{t("contact.contactustitle")}</Card.Title>
                      <Card.Text>
                        {t("contact.contactusdesc")}
                      </Card.Text>
                      <Card.Text>
                        <div className="profil-section">
                          <div className="profil-body">
                            <img className="raunded" src={user.image} />
                            <div className="profil-text-body">
                              <div className="profil-text-section">
                                <div className="text-black">{t("contact.hello")} {user.name}</div>
                              </div>
                              <div className="profil-text-section">
                                <div className="text-black">{user.email}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card.Text>
                      <Form onSubmit={handleSubmit}>
                        <Form.Select name="subject" onChange={(e) => {
                          setFormData((prevState) => {
                            return { ...prevState, "subject": parseInt(e.target.value) }
                          })
                        }} aria-label="Default select example">
                          <option>{t("contact.selected.title")}</option>
                          <option value="1">{t("contact.selected.one")}</option>
                          <option value="2">{t("contact.selected.two")}</option>
                          <option value="3">{t("contact.selected.three")}</option>
                          <option value="4">{t("contact.selected.four")}</option>
                        </Form.Select>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                          <Form.Label>{t("contact.selectedsupportdescription")}</Form.Label>
                          <Form.Control name="description" as="textarea" onChange={(e) => {
                            setFormData((prevState) => {
                              return { ...prevState, "description": e.target.value }
                            })
                          }} rows={3} ></Form.Control>
                        </Form.Group>
                        <Card.Text>{lenghtLimitText}</Card.Text>
                        <div className="d-grid gap-2">
                          <Button type='submit' variant="primary" size="lg">
                            {t("contact.selectedsupportbutton")}
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </>}
              </> :
              <>
                <Card.Body>
                  <Card.Title>{t("contact.contactustitle")}</Card.Title>
                  <Card.Text>
                    {t("contact.contactusdesc")}
                  </Card.Text>
                  <Row>
                    <Col xs="12" md="12">
                      <div className="d-grid gap-2">
                        <Button onClick={() => goHome()} className="btn-google btn-block w-100">
                          <>
                            <img src={googleIcon} className="btn-google-icon" />
                          </>
                          <span className="btn-google-text" >{t("contact.followgoogle")}</span>
                        </Button>
                      </div>
                    </Col>
                    <Col xs="12">
                      <div className='d-flex aling-items-center text-center or-text-content'><span>{t("contact.or")}</span></div>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12">
                      <Row>
                        <Col xs="12">
                          <div className='d-flex aling-items-center text-center mt-3 '>
                            <span className='text-center w-100'>{t("contact.sendustext")}</span>
                          </div>
                        </Col >
                        <Col xs="12">
                          <div className='d-flex aling-items-center text-center mt-3 '>
                            <a href="mailto:support@spotsoundmusic.com" className='text-center w-100 ms-1' target='_blank'>support@spotsoundmusic.com</a>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                </Card.Body></>
            }
          </Card>
          <Social />
        </div>
      </div>
      <div className="contact-img-section" >
      </div>
    </div>
  )
}
