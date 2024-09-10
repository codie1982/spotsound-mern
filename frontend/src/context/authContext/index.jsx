import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { getMe, logoutUser, resetAuth } from "../../features/auth/authSlice"
import { getConnection, connectionLanguage, resetConnection } from "../../features/connection/connectionSlice"
import { useTranslation } from "react-i18next"
import { Spinner } from "react-bootstrap";
const AuthContext = React.createContext();
export function useAuth() {
    return useContext(AuthContext);
}
export function AuthProvider({ children }) {
    const [t, i18n] = useTranslation("global")
    const [isLoading, setIsLoading] = useState(true)
    const [token, setToken] = useState("")
    const [value, setValue] = useState({
        userLoggedIn: false, user: {}, isLoading: false,
        logout: () => {
            let _token = localStorage.getItem("token")
            dispatch(logoutUser(_token))
        }
    })
    const dispatch = useDispatch()
    const { connection, auth } = useSelector(
        (state) => {
            return { connection: state.connection, auth: state.auth }
        }
    )

    const handleChangeLanguage = (lang) => {
        i18n.changeLanguage(lang)
        console.log("Dil değişti")
    }



    useEffect(() => {
        let _token = localStorage.getItem("token")
        if (_token == undefined) {
            dispatch(resetAuth())
            dispatch(resetConnection())
            dispatch(getConnection())

        } else {

            setToken(_token)
        }
    }, [])


    useEffect(() => {
        if (connection) {
            setIsLoading(connection.isLoading)
            if (connection.success) {

                if (connection.data != undefined || connection.data != null) {
                    setToken(connection.data.token)
                    localStorage.setItem("token", connection.data.token)
                }
            }
            if (connection.isSuccess && !connection.isLoading && connection.language != null)
                handleChangeLanguage(connection.language.toLowerCase())

        }
    }, [connection])
    useEffect(() => {

        if (token != null && token != "" && token != undefined) dispatch(getMe(token))
    }, [token])

    useEffect(() => {
        let isLogin = false;
        if (auth) {
            if (auth.isSuccess) {
                if (auth.data != null) {
                    isLogin = true;
                    setValue((prevState) => ({
                        ...prevState,
                        isLoading: connection.isLoading && auth.isLoading,
                        isLogin,
                        user: auth.data
                    }))
                } else {
                    //getMe servisinden kayıt gelmez ise
                    isLogin = false;
                    setValue((prevState) => ({
                        ...prevState,
                        isLoading: connection.isLoading && auth.isLoading,
                        isLogin,
                        user: {}
                    }))
                }
            }
        }

    }, [auth])


    /*   useEffect(() => {
          if (message) {
              console.log("context-message", message)
          }
         
          if (isSuccess) {
              console.log("context-isSuccess", isSuccess)
          }
          if (isError) {
              console.log("context-isError", isError)
          } else {
              if (result) {
                  console.log("context-result", result)
              }
          }
         
  
      }, [result, language, isError, isSuccess, message])
      useEffect(() => {
          if (isLoading) {
              console.log("context-isLoading", isLoading)
          }
      }, [isLoading]) */

    return (
        <AuthContext.Provider value={value}>
            {isLoading ? <Spinner /> :
                <>
                    {children}
                </>}

        </AuthContext.Provider>
    )
}

/**
 *   setValue((prevState) => ({
                ...prevState,
                ["userLoggedIn"]: true,
                ["isLoading"]: connection.isLoading,
            }))
 */