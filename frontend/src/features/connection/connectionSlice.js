import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import connectionService from './connectionService'
//const user = JSON.parse(localStorage.getItem('user'))
//const url = JSON.parse(localStorage.getItem('url'))
const initialState = {
  data: null,
  language: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  statusCode: ""
}


// checkFirstConnection
export const getConnection = createAsyncThunk(
  'connection/get',
  async (thunkAPI) => {
    try {
      return await connectionService.checkConnection()
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

/* export const connectionLanguage = createAsyncThunk(
  'connection/language',
  async (thunkAPI) => {
    try {
      return await connectionService.getLanguage()
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
) */
export const connectionSlice = createSlice({
  name: 'connection/lang',
  initialState,
  reducers: {
    resetConnection: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConnection.pending, (state) => {
        //console.log("pending", state)
        state.isLoading = true
      })
      .addCase(getConnection.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.data = action.payload.data
        state.statusCode = action.payload.status
        state.language = action.payload.data.language.lang
      })
      .addCase(getConnection.rejected, (state, action) => {
        //console.log("rejected", state, action)
        state.isLoading = false
        state.isSuccess = false
        state.isError = true
        state.message = action.payload
        state.result = null
      })
  }
})


export const { resetConnection } = connectionSlice.actions
export default connectionSlice.reducer


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