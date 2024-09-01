import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from './authService'
//const user = JSON.parse(localStorage.getItem('user'))
//const url = JSON.parse(localStorage.getItem('url'))

const initialState = {
  user:  null,
  googleurl:null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}
// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    try {
      return await authService.register(user)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)
// Register user
export const registerWithGoogle = createAsyncThunk(
  'auth/registerWithGoogle',
  async (_, thunkAPI) => {
    try {
    return await  authService.registerWithGoogle()
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)
// get User information
export const getMe = createAsyncThunk(
  'auth/me',
  async (token, thunkAPI) => {
    try {
      return await authService.me(token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled,(state,action)=>{
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.user = action.payload
      })
      .addCase(register.rejected,(state,action)=>{
        state.isLoading = false
        state.isSuccess = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(registerWithGoogle.fulfilled,(state,action)=>{
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.googleurl = action.payload
      })
      .addCase(getMe.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getMe.fulfilled,(state,action)=>{
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.user = action.payload
      })

  }
})


export const { reset } = authSlice.actions
export default authSlice.reducer


/**
 *  (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
 */