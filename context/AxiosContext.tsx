import { Axios } from "axios";
import { createContext, useContext } from "react";
import axios from "axios";
import React from "react";
import * as SecureStore from "expo-secure-store";

//import {AuthContext} from './AuthContext'
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectAccessToken,
  setUser,
  AuthSate,
  selectUser,
} from "../store/features/auth/authSlice";

interface IAxioses {
  authAxios: Axios;
  publicAxios: Axios;
}

//const baseURL = 'http://localhost:8000'
//const baseURL = 'http://10.0.2.2:8000'
const baseURL = "http://192.168.8.101:8000";
//192.168.8.1

export type AxiosContextType = {
  authAxios: Axios;
  publicAxios: Axios;
};
const authAxios = axios.create({
  baseURL,
});

const publicAxios = axios.create({
  baseURL,
});
const initialData = {
  authAxios,
  publicAxios,
};
export const AxiosContext = createContext<AxiosContextType>(initialData);
//const { Provider } = AxiosContext;
interface Props {
  children?: React.ReactNode;
}
export const AxiosProvider: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);
  // const authContext = useContext(AuthContext);

  authAxios.interceptors.request.use(
    (config: any) => {
      if (!config.headers?.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const refreshAuthLogic = async (failedRequest: any) => {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");

    const options = {
      method: "GET",
      url: baseURL + "/auth/refresh",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    };

    // console.log(refreshToken)
    return axios(options)
      .then(async (tokenRefreshResponse) => {
        failedRequest.response.config.headers.Authorization =
          "Bearer " + tokenRefreshResponse.data.accessToken;

        const { user, refreshToken, accessToken } = tokenRefreshResponse.data;
        console.log(tokenRefreshResponse.data);
        const authSate: AuthSate = {
          user,
          accessToken,
          authenticated: true,
        };

        dispatch(setUser(authSate));
        await SecureStore.setItemAsync("refreshToken", refreshToken);
        return Promise.resolve();
      })
      .catch((e) => {
        console.log(e.response.data);
        dispatch(
          setUser({
            user: null,
            accessToken: "",
            authenticated: false,
          })
        );
      });
  };

  createAuthRefreshInterceptor(authAxios, refreshAuthLogic, {});

  return (
    <AxiosContext.Provider
      value={{
        authAxios,
        publicAxios,
      }}
    >
      {children}
    </AxiosContext.Provider>
  );
};

export default AxiosContext;
