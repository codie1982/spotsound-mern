import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import supporService from './supportService'
//const user = JSON.parse(localStorage.getItem('user'))
//const url = JSON.parse(localStorage.getItem('url'))
const initialState = {
  data: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  statusCode: ""
}
// checkFirstConnection
export const addSupport = createAsyncThunk(
  'contact/add',
  async (data, thunkAPI) => {
    try {

      return await supporService.add(data.recaptchaToken, data.subject, data.description)
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
export const supportSlice = createSlice({
  name: 'support/',
  initialState,
  reducers: {
    resetSupport: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addSupport.pending, (state) => {
        //console.log("pending", state)
        state.isLoading = true
      })
      .addCase(addSupport.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.data = action.payload.data
        state.statusCode = action.payload.status
      })
      .addCase(addSupport.rejected, (state, action) => {
        //console.log("rejected", state, action)
        state.isLoading = false
        state.isSuccess = false
        state.isError = true
        state.message = action.payload
        state.result = null
      })
  }
})


export const { resetSupport } = supportSlice.actions
export default supportSlice.reducer