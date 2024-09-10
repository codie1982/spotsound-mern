import React, { useEffect, useState } from "react"
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom";
//Components
import Header from "../Header"
import Footer from "../Footer"

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from '../../context/authContext';


//import { connectionLanguage, resetConnection } from "../../features/connection/connectionSlice"

export function MainLayout() {
    const dispatch = useDispatch()
    const [t, i18n] = useTranslation("global")

    useEffect(() => {
        //dispatch(resetConnection())
        //dispatch(connectionLanguage())
    }, [])
  /*   const connection = useSelector(
        (state) => {
            return state.connection
        }
    )
    const handleChangeLanguage = (lang) => {
        i18n.changeLanguage(lang)
        console.log("Dil değişti")
    }
    useEffect(() => {

        if (connection) {
            if (connection.isSuccess && !connection.isLoading && connection.language != null)
                handleChangeLanguage(connection.language.toLowerCase())
        }
    }, [connection]) */

    return (
        <AuthProvider>
            <div data-bs-spy="scroll" data-bs-target="#navbar-example">
                <Container className="section" fluid>
                    <Header />
                    <Outlet lang={global} />
                    {/* <Footer /> */}
                </Container>
                <ToastContainer />
            </div>
        </AuthProvider>
    )
}