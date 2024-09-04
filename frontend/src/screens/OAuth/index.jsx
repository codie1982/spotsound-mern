import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { getMe, reset } from "../../features/auth/authSlice"
import { Row, Col, Spinner } from "react-bootstrap"
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuth() {
    const [token, setToken] = useState()
    const [username, setusername] = useState("")
    const [profileImage, setProfileImage] = useState("")
    const [email, setEmail] = useState("")
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => {
            return state.auth
        }
    )
    useEffect(() => { setToken(searchParams.get("token")) }, [])
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token)
            dispatch(getMe(token))
        }
    }, [token])
    useEffect(() => {
        if (user) {
            setusername(user.name)
            setProfileImage(user.image)
            setEmail(user.email)
        }
    }, [user])

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
                                                <p class="text-secondary mb-1">{email}</p>
                                                <div className="mt-3">
                                                    <h4>{username}</h4>
                                                    <button className="btn btn-primary">Bu Hesap ile devam et</button>
                                                </div>
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
