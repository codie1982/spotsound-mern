import React, { useState, useEffect, useCallback } from 'react'
import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap'
import contactImage from "../../assets/images/contact-background.jpg"
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
import googleIcon from "../../assets/images/Google__G__logo.png"
import xLogo from "../../assets/images/X_icon.png"
import intagramLogo from "../../assets/images/instagram_icon.png"
import facebookLogo from "../../assets/images/facebook_icon.png"
import logo from "../../assets/images/logo.png"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from 'react-toastify'
import { useAuth } from '../../context/authContext'
import ManuelSpinner from '../../components/Spinner'
export default function Contact() {
  const { isLoading, isLogin, user } = useAuth()
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
  }, [isLogin, user])

  const onSubmit = () => { }
  const onChange = () => { }

  useEffect(() => {
    console.log('Form is submitted with reCAPTCHA token:', recaptchaToken);
    // Token başarılı bir şekilde oluşturuldu, sunucuya gönderin
  }, [recaptchaToken])

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!executeRecaptcha) {
      console.log('Execute recaptcha is not yet available');
      return;
    }

    const token = await executeRecaptcha('submit_form');
    setRecaptchaToken(token);
    if (token) {
      // Token başarılı bir şekilde oluşturuldu, sunucuya gönderin
    } else {
      toast.error("Lütfen reCAPTCHA doğrulamasını yapın.")
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

                    <Form.Select aria-label="Default select example">
                      <option>Konu Seçin</option>
                      <option value="1">Destek</option>
                      <option value="2">Öneri</option>
                      <option value="3">Şikayet</option>
                      <option value="4">Verilerimin Silinmesi</option>
                    </Form.Select>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Açıklama</Form.Label>
                      <Form.Control as="textarea" rows={3} />
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button type='submit' variant="primary" size="lg">
                        Gönder
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </> :
              <>
                <Card.Body>
                  <Card.Title>Bize Ulaşın</Card.Title>
                  <Card.Text>
                    Hertürlü görüş ve önerileriniz lütfen bizimle paylaşın!
                    Ama Öncelikle bizi takip edin.
                  </Card.Text>
                  <Button onClick={() => goHome()} className="btn-google">
                    <>
                      <img src={googleIcon} className="btn-google-icon" />
                    </>
                    <span className="btn-google-text" >Follow Us With Google Subscribe!</span>
                  </Button>
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
      <div className="contact-img-section" >
        {/*  <img src={contactImage} /> */}
      </div>
    </div>
  )
}
