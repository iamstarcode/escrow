import { useContext } from 'react';
import { AxiosContext } from '../context/AxiosContext';

export default function useAxios() {
  return useContext(AxiosContext);
}
