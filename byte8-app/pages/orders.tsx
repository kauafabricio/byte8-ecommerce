import NavBar from "@/app/components/navbar";
import { useAuth } from "../context/AuthContext";
import styles from "@/app/styles/orders.module.css"
import { useEffect } from "react";
import env from "../env";
import Cookies from "js-cookie";
import axios from "axios";
import Footer from "@/app/components/footer";
import { format } from "date-fns"
import Link from "next/link";
import Head from "next/head";

const Orders = () => {
  const { userId, isLogged, userOrders } = useAuth()
  const api = axios.create({
    baseURL: env.urlServer
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = await Cookies.get('token');
      if (token) {
        try {
          const response = await api.get('/auth', {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json;charset=utf-8'
            }
          })
          if (response.data.validToken) {
            console.log('Confirmed!')
          }
        } catch (err: any) {
          window.location.href = `${env.urlFront}/login`
        }
      } else {
        window.location.href = `${env.urlFront}/login`
      }
    }

    fetchData();
  }, [])

  const formatDate = (date: Date) => {
    const newDate = new Date(date)
    return format(newDate, "dd/MM/yyyy")
  }

  return(
    <>
      <Head>
        <title>Byte8 | Meus pedidos</title>
      </Head>
      <NavBar />
      { userId && isLogged && (
        <div className={styles.ordersMain}>
          <div className={styles.ordersContainer}>
            <h1>Meus pedidos</h1>
            { userOrders && userOrders.length > 0 && (
              <div className={styles.userOrdersContainer}>
                { userOrders.map(order => (
                  <div className={styles.orderDiv}>

                    <div className={styles.orderHeader}>
                      <div>
                        <p>Pedido realizado</p>
                        <p>{formatDate(order.orderDate)}</p>
                      </div>
                      
                      <div>
                        <p>Total</p>
                        <p>R$ {order.totalAmount}</p>
                      </div>

                    </div>

                    {order.items.map(item => (
                      <div className={styles.orderItem}>
                        <img src={item.productImg} alt={item.productName} />
                        <div>
                          <p>{item.productName}</p>
                          <p>#{item.productId}</p>
                          <Link className={styles.linkWithIcon} href={`${env.urlFront}/product/${item.productId}`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffffff" viewBox="0 0 256 256"><path d="M216,44H40A12,12,0,0,0,28,56V200a12,12,0,0,0,12,12H216a12,12,0,0,0,12-12V56A12,12,0,0,0,216,44Zm4,156a4,4,0,0,1-4,4H40a4,4,0,0,1-4-4V56a4,4,0,0,1,4-4H216a4,4,0,0,1,4,4ZM172,88a44,44,0,0,1-88,0,4,4,0,0,1,8,0,36,36,0,0,0,72,0,4,4,0,0,1,8,0Z"></path></svg> Comprar novamente</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            { userOrders && userOrders.length == 0 && (
              <>
              <p className={styles.noOrders}>Você não realizou nenhum pedido.</p>
              <Link className={styles.linkWithIcon} href={`${env.urlFront}/loja`}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff" viewBox="0 0 256 256"><path d="M227.07,61.44A4,4,0,0,0,224,60H59.34L52.66,23.28A4,4,0,0,0,48.73,20H24a4,4,0,0,0,0,8H45.39l6.69,36.8h0L71.49,171.58A20,20,0,0,0,79,183.85,24,24,0,1,0,109.87,188h60.26A24,24,0,1,0,188,180H91.17a12,12,0,0,1-11.8-9.85l-4-22.15H196.1a20,20,0,0,0,19.68-16.42l12.16-66.86A4,4,0,0,0,227.07,61.44ZM108,204a16,16,0,1,1-16-16A16,16,0,0,1,108,204Zm96,0a16,16,0,1,1-16-16A16,16,0,0,1,204,204Zm3.91-73.85A12,12,0,0,1,196.1,140H73.88L60.79,68H219.21Z"></path></svg> Ver produtos</Link>
              </>
            )}
          </div>
        </div>
      )}
      <Footer />
    </>
  )
}

export default Orders;