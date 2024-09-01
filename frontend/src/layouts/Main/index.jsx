import React, { useEffect, useState } from "react"
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css'
import { useSelector, useDispatch } from "react-redux"
import { connectionLanguage, resetConnection } from "../../features/connection/connectionSlice"
import { useTranslation } from "react-i18next"
export function MainLayout() {
    const dispatch = useDispatch()
    const [t, i18n] = useTranslation("global")
    useEffect(() => {
        dispatch(resetConnection())
        dispatch(connectionLanguage())
    }, [])
    const connection = useSelector(
        (state) => {
            console.log("state", state)
            return state.connection
        }
    )
    const handleChangeLanguage = (lang) => {
        i18n.changeLanguage(lang)
    }
    useEffect(() => {
        if (connection) {
            console.log("connection LANG", connection.language)
            handleChangeLanguage(connection.language.toLowerCase())
        }
    }, [connection])

    return (
        <div>
            <div>
                <Outlet lang={global} />
            </div>
            <ToastContainer />
        </div>
    )
}