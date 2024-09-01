import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice'
import connectionReducer from '../features/connection/connectionSlice'
export const store = configureStore({
    reducer:{
        auth:authReducer,
        connection:connectionReducer
    }
})