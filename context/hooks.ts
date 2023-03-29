import { useContext } from "react";
//import { AuthContext } from './AuthContext';
import { AxiosContext } from "./AxiosContext";

const { authAxios, publicAxios } = useContext(AxiosContext);

//export const useAuth = () => useContext(AuthContext);
export const useAxios = () => useContext(AxiosContext); // { authAxios, publicAxios }
