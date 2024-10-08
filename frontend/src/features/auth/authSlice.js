import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from './authService'
//const user = JSON.parse(localStorage.getItem('user'))
//const url = JSON.parse(localStorage.getItem('url'))

const initialState = {
  redirecturl:null,
  data: null,
  statusCode: null,
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
// Register user With Google 
export const registerWithGoogle = createAsyncThunk(
  'auth/registerWithGoogle',
  async (_, thunkAPI) => {
    try {
      return await authService.registerWithGoogle()
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
// Logout user
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (token) => {
    try {
      return await authService.logoutUser(token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return message
    }
  }
)
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: (state) => {
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
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.data = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        state.isError = true
        state.message = action.payload
        state.data = null
      })
      .addCase(registerWithGoogle.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(registerWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.redirecturl = action.payload.data.url
        state.statusCode = action.payload.status
      })
      .addCase(getMe.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.data = action.payload.data
        state.statusCode = action.payload.status
      })
      .addCase(logoutUser.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.data = null
        state.statusCode = null
      })
  }
})


export const { resetAuth } = authSlice.actions
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