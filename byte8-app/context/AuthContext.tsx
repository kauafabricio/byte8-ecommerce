import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import env from '../env.js';

interface ProductBag {
  productId: string;
  productName: string;
  productImg: string;
  productPrice: number;
  productQuantity: number;
}

export interface UserAddress {
  _id: string;
  streetAddress: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: number;
  country: string;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  individualPrice: number;
  totalPrice: number;
  productImg: string;
}

interface UserOrder {
  userId: string;
  orderNumber: number;
  orderDate: Date;
  shippingAddress: UserAddress;
  paymentMethod: string;
  totalAmount: number;
  status: string;
  shippingCost: number;
  discountAmount: number;
  items: OrderItem[];
  trackingNumber: number;
}

interface AuthContextType {
  user: string | null | undefined;
  setUser: (user: string | null | undefined) => void;
  userId: string;
  setUserId: (id: string) => void;
  userBag: ProductBag[];
  setUserBag: (bag: ProductBag[]) => void;
  userAddress: UserAddress[];
  setUserAddress: (list: UserAddress[]) => void;
  userOrders: UserOrder[];
  setUserOrders: (list: UserOrder[]) => void;
  fetchBagData: () => void;
  isLogged: boolean;
  setIsLogged: (isLogged: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  const api = axios.create({
    baseURL: env.urlServer
  });


  const [user, setUser] = useState<string | null | undefined>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false)
  const [userId, setUserId] = useState<string>('');
  const [userBag, setUserBag] = useState<ProductBag[]>([])
  const [userAddress, setUserAddress] = useState<UserAddress[]>([])
  const [userOrders, setUserOrders] = useState<UserOrder[]>([])

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
