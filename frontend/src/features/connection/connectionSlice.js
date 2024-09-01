import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import connectionService from './connectionService'
//const user = JSON.parse(localStorage.getItem('user'))
//const url = JSON.parse(localStorage.getItem('url'))

const initialState = {
    result: null,
    language:"",
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}
// checkFirstConnection
export const check = createAsyncThunk(
    'connection/check',
    async (thunkAPI) => {
        try {
            return await connectionService.checkConnection()
        } catch (error) {
            console.log("connectionService.checkConnection ",error)
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
export const connectionLanguage = createAsyncThunk(
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
)
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
            .addCase(check.pending, (state) => {
                state.isLoading = true
            })
            .addCase(check.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.result = action.payload.data
            })
            .addCase(check.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
                state.result = null
            })
            .addCase(connectionLanguage.pending, (state, action) => {
              state.isLoading = true
          })
            .addCase(connectionLanguage.fulfilled, (state, action) => {
              state.isLoading = false
              state.isSuccess = true
              state.isError = false
              state.language = action.payload.data.lang
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