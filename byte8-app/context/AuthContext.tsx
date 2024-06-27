import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import env from '../env.js';

interface User {
  name: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  userId: string;
  setUserId: (id: string) => void;
  userBag: Array<Object>;
  setUserBag: (bag: Array<Object>) => void;
  userAddress: Array<Object>;
  setUserAddress: (list: Array<Object>) => void;
  userOrders: Array<Object>;
  setUserOrders: (list: Array<Object>) => void;
  fetchBagData: () => void;
  isLogged: boolean;
  setIsLogged: (isLogged: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  const api = axios.create({
    baseURL: env.urlServer
  });


  const [user, setUser] = useState<User | null>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false)
  const [userId, setUserId] = useState('');
  const [userBag, setUserBag] = useState<Array<Object>>([])
  const [userAddress, setUserAddress] = useState<Array<Object>>([])
  const [userOrders, setUserOrders] = useState<Array<Object>>([])

  const fetchBagData = useCallback(async () => {
    if (userId) {
      try {
        const response = await api.get(`/api/get-bag?userId=${userId}`, {
          headers: {
            Accept: 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
          }
        });
        if (response.data.bag) {
          setUserBag(response.data.bag);
        }
      } catch (err: any) {
        console.log(err.response.data.error);
      }
    }
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      const token = await Cookies.get('token');
      if (token) {
        try {
          const response = await api.get('/auth', {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json;charset=utf-8',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            }
          })
          if (response.data.validToken) {
            setIsLogged(true)
            setUser(response.data.userName)
            setUserId(response.data.userId)
            setUserAddress(response.data.userAddress)
            setUserOrders(response.data.userOrders)
          }
        } catch (err: any) {
          console.log(err.response.data.error)
        }
      }
    }

    fetchData();
    fetchBagData();
  }, [fetchBagData])


  return (
    <AuthContext.Provider value={{userId, setUserId, userBag, setUserBag, userAddress, setUserAddress, userOrders, setUserOrders, fetchBagData, user, setUser, isLogged, setIsLogged }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
