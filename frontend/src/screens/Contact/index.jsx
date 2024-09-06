import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Container, Row, Col, Button, Card, Form, Spinner } from 'react-bootstrap'
import contactImage from "../../assets/images/contact-background.jpg"
import { useNavigate, } from "react-router-dom";
import { addSupport } from "../../features/support/supportSlice"
import googleIcon from "../../assets/images/Google__G__logo.png"
import xLogo from "../../assets/images/X_icon.png"
import intagramLogo from "../../assets/images/instagram_icon.png"
import facebookLogo from "../../assets/images/facebook_icon.png"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from 'react-toastify'
import { useAuth } from '../../context/authContext'
import ManuelSpinner from '../../components/Spinner'

export default function Contact() {
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
          <Card className='shadow p-3 mb-5 bg-body-tertiary rounded' style={{ width: '30rem' }}>
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
                          <Card.Title>Bize Ulaşın</Card.Title>
                          <Card.Text>
                            Destek talebiniz başarı ile kayıt altına alınmıştır!
                          </Card.Text>
                          <Card.Text>
                            <div className="profil-section">
                              <div className="profil-body">
                                <img className="raunded" src={user.image} />
                                <div className="profil-text-body">
                                  <div className="profil-text-section">
                                    <div className="text-black">Merhaba {user.name}</div>
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
                          <Card.Title>Bize Ulaşın</Card.Title>
                          <Card.Text>
                            Hertürlü görüş ve öenrilerinizi litfen bizimle paylaşın!
                          </Card.Text>
                          <Card.Text>
                            <div className="profil-section">
                              <div className="profil-body">
                                <img className="raunded" src={user.image} />
                                <div className="profil-text-body">
                                  <div className="profil-text-section">
                                    <div className="text-black">Merhaba {user.name}</div>
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
                              <option>Konu Seçin</option>
                              <option value="1">Destek</option>
                              <option value="2">Öneri</option>
                              <option value="3">Şikayet</option>
                              <option value="4">Verilerimin Silinmesi</option>
                            </Form.Select>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                              <Form.Label>Açıklama</Form.Label>
                              <Form.Control name="description" as="textarea" onChange={(e) => {
                                setFormData((prevState) => {
                                  return { ...prevState, "description": e.target.value }
                                })
                              }} rows={3} ></Form.Control>
                            </Form.Group>
                            <Card.Text>{lenghtLimitText}</Card.Text>
                            <div className="d-grid gap-2">
                              <Button type='submit' variant="primary" size="lg">
                                Gönder
                              </Button>
                            </div>
                          </Form>
                        </Card.Body>
                      </>}
                    <Card.Body>
                      <Card.Title>Bize Ulaşın</Card.Title>
                      <Card.Text>
                        Hertürlü görüş ve öenrilerinizi litfen bizimle paylaşın!
                      </Card.Text>
                      <Card.Text>
                        <div className="profil-section">
                          <div className="profil-body">
                            <img className="raunded" src={user.image} />
                            <div className="profil-text-body">
                              <div className="profil-text-section">
                                <div className="text-black">Merhaba {user.name}</div>
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
                          <option>Konu Seçin</option>
                          <option value="1">Destek</option>
                          <option value="2">Öneri</option>
                          <option value="3">Şikayet</option>
                          <option value="4">Verilerimin Silinmesi</option>
                        </Form.Select>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                          <Form.Label>Açıklama</Form.Label>
                          <Form.Control name="description" as="textarea" onChange={(e) => {
                            setFormData((prevState) => {
                              return { ...prevState, "description": e.target.value }
                            })
                          }} rows={3} ></Form.Control>
                        </Form.Group>
                        <Card.Text>{lenghtLimitText}</Card.Text>
                        <div className="d-grid gap-2">
                          <Button type='submit' variant="primary" size="lg">
                            Gönder
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </>}
              </> :
              <>
                <Card.Body>
                  <Card.Title>Bize Ulaşın</Card.Title>
                  <Card.Text>
                    Hertürlü görüş ve önerileriniz lütfen bizimle paylaşın!
                    Ama Öncelikle bizi takip edin.
                  </Card.Text>
                  <Row>
                    <Col md="10">
                      <div className="d-grid gap-2">
                        <Button onClick={() => goHome()} className="btn-google">
                          <>
                            <img src={googleIcon} className="btn-google-icon" />
                          </>
                          <span className="btn-google-text" >Follow Us With Google Subscribe!</span>
                        </Button>
                      </div>
                    </Col>
                    <Col>
                      <div className='d-flex aling-items-center text-center or-text-content'><span>OR</span></div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className='d-flex aling-items-center text-center mt-3'>
                        {"You send us with :"}
                        <a href="mailto:support@spotsoundmusic.com" className='ms-1' target='_blank'>support@spotsoundmusic.com</a>
                      </div>
                    </Col>
                  </Row>

                </Card.Body></>
            }

          </Card>

          {/* <form onSubmit={onSubmit}>
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
          {/*   {userName ?
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
                            <Button variant="outline-danger" className="btn btn-alert">Bu sen değilmisin?</Button>
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
              <Button onClick={() => login()} className="btn-google">
                <img src={googleIcon} className="btn-google-icon" />
                <span className="btn-google-text" >Follow Us With Google Subscribe!</span>
              </Button>
            </>
          } */}
          <Row>
            <Col xs="4" md="4">
              <div className="icon-content right">
                <a className='right' href="https://twitter.com/SpotSoundMusic" target="_blank"><img src={xLogo} /></a>
              </div>
            </Col>
            <Col xs="4" md="4">
              <div className="icon-content">
                <a className='center' href="https://www.instagram.com/spotsoundappoffical/" target="_blank"><img src={intagramLogo} /></a>
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
      <div className="contact-img-section" >
      </div>
    </div>
  )
}
