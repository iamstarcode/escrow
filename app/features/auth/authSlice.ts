import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'

export interface AuthSate {
  user: {
    id: number
    email: string
  } | null
  authenticated: boolean
  accessToken: string
}

const initialState: AuthSate = {
  user: null,
  authenticated: false,
  accessToken: '',
}
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthSate>) => {
      state.user  = action.payload.user
      state.authenticated = action.payload.authenticated
      state.accessToken = action.payload.accessToken
    },
  },
})

export const { setUser } = authSlice.actions
export const selectAuthenticated = (state: RootState) => state.auth.authenticated
export const selectUser = (state: RootState) => state.auth.user
export const selectAccessToken = (state:RootState)=> state.auth.accessToken

export default authSlice.reducer
