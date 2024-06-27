import React, { useEffect, useState } from "react";
import styles from "@/app/styles/productDetail.module.css"
import { useRouter } from "next/router";
import axios from "axios";
import env from "../../env";
import Image from "next/image";

// IMPORT ICONS
import Delivery from "../../public/imgs/Delivery.png"
import Guaranteed from "../../public/imgs/Guaranteed.png"
import Stock from "../../public/imgs/Stock.png"
import bagIcon from "../../public/imgs/bag-icon.png"

// IMPORT COMPONENTS
import NavBar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { useAuth } from "../../context/AuthContext";
import PopUp from "@/app/components/popup";


export default function Product () {
  const api = axios.create({
    baseURL: env.urlServer
  })
  const router = useRouter();
  const { productId } = router.query;
  const [product, setProduct] = useState<Object>({})
  const { fetchBagData, isLogged, userId } = useAuth();

  // POPUP STATES
  const [popUpStatus, setPopUpStatus] = useState('')
  const [showPopUp, setShowPopUp] = useState(false);
  const [textPopUp, setTextPopUp] = useState('')

  // SYSTEM CODE

  const addProductToBag = async (id: string, name: string, img: string, price: Number) => {

    if (isLogged && userId) {
      try {
        const formData = `userId=${userId}&prodId=${id}&prodName=${name}&prodImg=${img}&prodPrice=${price}&prodQuantity=1`
        const response = await api.post('/api/save-product', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json;charset=utf-8'
          }
        });
        if (response.data.message) {
          fetchBagData()
          setTextPopUp(response.data.message)
          setShowPopUp(true)
          setPopUpStatus("success")
        }
        } catch (err: any) {
          setTextPopUp(err.response.data.error)
          setShowPopUp(true)
          setPopUpStatus("error")
        }
    } else {
      window.location.href = `${env.urlFront}/login`
    }
    
  }

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          const response = await api.get(`/api/products?id=${productId}`, {
            headers: {
              Accept: 'application/json;charset=utf-8'
            }
          })
          if (response.data.product) {
            setProduct(response.data.product)
          }
        } catch (err: any) {
          window.location.href = `${env.urlFront}/loja`
        }
      }
    }
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    let hideTimer: any;
    if (showPopUp) {
      hideTimer = setTimeout(() => {
        setShowPopUp(false);
        setPopUpStatus('')
      }, 5000);
    }

    return () => clearTimeout(hideTimer);
  }, [showPopUp]);

  return(
    <>
      <NavBar />
      { showPopUp && <PopUp text={textPopUp} onClose={() => setShowPopUp(false)} status={popUpStatus} /> };  
      <div className={styles.router}>
        {["Smartphone", "Smartwatch", "Notebook", "Headset"].includes(product.prodCategory) && (
          <p className={styles.routerParagraph}>
            <a href="/">Home</a> <span>{'>'}</span> <a href="/loja">{product.prodCategory}</a> <span>{'>'}</span> <a>{product.prodName}</a>
          </p>
        )}
      </div>

      {/* MAIN INFO */}

      <main className={styles.mainInfo}>
        <div className={styles.productImage}>
          <img src={product.prodImg} alt={product.prodName} />
        </div>

        <div className={styles.productInfo}>
          <h1>{product.prodName}</h1>
          <p>R$ {product.prodPrice},00</p>
          { product.prodCategory === "Smartphone" && (
            <div className={styles.productInfoCardsGrid}>
              <div className={styles.productInfoCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M196,80v32a4,4,0,0,1-8,0V84H160a4,4,0,0,1,0-8h32A4,4,0,0,1,196,80ZM96,172H68V144a4,4,0,0,0-8,0v32a4,4,0,0,0,4,4H96a4,4,0,0,0,0-8ZM228,56V200a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V56A12,12,0,0,1,40,44H216A12,12,0,0,1,228,56Zm-8,0a4,4,0,0,0-4-4H40a4,4,0,0,0-4,4V200a4,4,0,0,0,4,4H216a4,4,0,0,0,4-4Z"></path></svg>
                <div>
                  <p>Tamanho da tela</p>
                  <p>{product.details.prodScreenSize}</p>
                </div>
              </div>
              <div className={styles.productInfoCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M152,100H104a4,4,0,0,0-4,4v48a4,4,0,0,0,4,4h48a4,4,0,0,0,4-4V104A4,4,0,0,0,152,100Zm-4,48H108V108h40Zm84,0H212V108h20a4,4,0,0,0,0-8H212V56a12,12,0,0,0-12-12H156V24a4,4,0,0,0-8,0V44H108V24a4,4,0,0,0-8,0V44H56A12,12,0,0,0,44,56v44H24a4,4,0,0,0,0,8H44v40H24a4,4,0,0,0,0,8H44v44a12,12,0,0,0,12,12h44v20a4,4,0,0,0,8,0V212h40v20a4,4,0,0,0,8,0V212h44a12,12,0,0,0,12-12V156h20a4,4,0,0,0,0-8Zm-28,52a4,4,0,0,1-4,4H56a4,4,0,0,1-4-4V56a4,4,0,0,1,4-4H200a4,4,0,0,1,4,4Z"></path></svg>
                <div>
                  <p>Processador</p>
                  <p>{product.details.prodCPU}</p>
                </div>
              </div>
              <div className={styles.productInfoCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M152,100H104a4,4,0,0,0-4,4v48a4,4,0,0,0,4,4h48a4,4,0,0,0,4-4V104A4,4,0,0,0,152,100Zm-4,48H108V108h40Zm84,0H212V108h20a4,4,0,0,0,0-8H212V56a12,12,0,0,0-12-12H156V24a4,4,0,0,0-8,0V44H108V24a4,4,0,0,0-8,0V44H56A12,12,0,0,0,44,56v44H24a4,4,0,0,0,0,8H44v40H24a4,4,0,0,0,0,8H44v44a12,12,0,0,0,12,12h44v20a4,4,0,0,0,8,0V212h40v20a4,4,0,0,0,8,0V212h44a12,12,0,0,0,12-12V156h20a4,4,0,0,0,0-8Zm-28,52a4,4,0,0,1-4,4H56a4,4,0,0,1-4-4V56a4,4,0,0,1,4-4H200a4,4,0,0,1,4,4Z"></path></svg>
                <div>
                  <p>Número de Cores</p>
                  <p>{product.details.prodCPUCores}</p>
                </div>
              </div>
              <div className={styles.productInfoCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M176,20H80A20,20,0,0,0,60,40V216a20,20,0,0,0,20,20h96a20,20,0,0,0,20-20V40A20,20,0,0,0,176,20Zm12,196a12,12,0,0,1-12,12H80a12,12,0,0,1-12-12V40A12,12,0,0,1,80,28h96a12,12,0,0,1,12,12ZM136,60a8,8,0,1,1-8-8A8,8,0,0,1,136,60Z"></path></svg>
                <div>
                  <p>Câmera traseira</p>
                  <p>{product.details.prodMainCam}</p>
                </div>
              </div>
              <div className={styles.productInfoCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M176,20H80A20,20,0,0,0,60,40V216a20,20,0,0,0,20,20h96a20,20,0,0,0,20-20V40A20,20,0,0,0,176,20Zm12,196a12,12,0,0,1-12,12H80a12,12,0,0,1-12-12V40A12,12,0,0,1,80,28h96a12,12,0,0,1,12,12ZM136,60a8,8,0,1,1-8-8A8,8,0,0,1,136,60Z"></path></svg>
                <div>
                  <p>Câmera Frontal</p>
                  <p>{product.details.prodFrontCam}</p>
                </div>
              </div>
              <div className={styles.productInfoCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M200,60H32A20,20,0,0,0,12,80v96a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V80A20,20,0,0,0,200,60Zm12,116a12,12,0,0,1-12,12H32a12,12,0,0,1-12-12V80A12,12,0,0,1,32,68H200a12,12,0,0,1,12,12Zm40-80v64a4,4,0,0,1-8,0V96a4,4,0,0,1,8,0ZM135.4,125.9a4,4,0,0,1,.18,3.89l-16,32A4,4,0,0,1,116,164a4.12,4.12,0,0,1-1.79-.42,4,4,0,0,1-1.79-5.37L125.53,132H100a4,4,0,0,1-3.58-5.79l16-32a4,4,0,1,1,7.16,3.58L106.47,124H132A4,4,0,0,1,135.4,125.9Z"></path></svg>
                <div>
                  <p>Bateria</p>
                  <p>{product.details.prodBattery}</p>
                </div>
              </div>
            </div>
          )}

          { product.prodCategory === "Notebook" && (
            <div className={styles.productInfoCardsGrid}>
              <div className={styles.productInfoCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M152,100H104a4,4,0,0,0-4,4v48a4,4,0,0,0,4,4h48a4,4,0,0,0,4-4V104A4,4,0,0,0,152,100Zm-4,48H108V108h40Zm84,0H212V108h20a4,4,0,0,0,0-8H212V56a12,12,0,0,0-12-12H156V24a4,4,0,0,0-8,0V44H108V24a4,4,0,0,0-8,0V44H56A12,12,0,0,0,44,56v44H24a4,4,0,0,0,0,8H44v40H24a4,4,0,0,0,0,8H44v44a12,12,0,0,0,12,12h44v20a4,4,0,0,0,8,0V212h40v20a4,4,0,0,0,8,0V212h44a12,12,0,0,0,12-12V156h20a4,4,0,0,0,0-8Zm-28,52a4,4,0,0,1-4,4H56a4,4,0,0,1-4-4V56a4,4,0,0,1,4-4H200a4,4,0,0,1,4,4Z"></path></svg>
                <div>
                  <p>Processador</p>
                  <p>{product.details.prodCPU}</p>
                </div>
              </div>
              <div className={styles.productInfoCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M196,80v32a4,4,0,0,1-8,0V84H160a4,4,0,0,1,0-8h32A4,4,0,0,1,196,80ZM96,172H68V144a4,4,0,0,0-8,0v32a4,4,0,0,0,4,4H96a4,4,0,0,0,0-8ZM228,56V200a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V56A12,12,0,0,1,40,44H216A12,12,0,0,1,228,56Zm-8,0a4,4,0,0,0-4-4H40a4,4,0,0,0-4,4V200a4,4,0,0,0,4,4H216a4,4,0,0,0,4-4Z"></path></svg>
                <div>
                  <p>Tamanho da tela</p>
                  <p>{product.details.prodScreenSize}</p>
                </div>
              </div>
              <div className={styles.productInfoCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M152,100H104a4,4,0,0,0-4,4v48a4,4,0,0,0,4,4h48a4,4,0,0,0,4-4V104A4,4,0,0,0,152,100Zm-4,48H108V108h40Zm84,0H212V108h20a4,4,0,0,0,0-8H212V56a12,12,0,0,0-12-12H156V24a4,4,0,0,0-8,0V44H108V24a4,4,0,0,0-8,0V44H56A12,12,0,0,0,44,56v44H24a4,4,0,0,0,0,8H44v40H24a4,4,0,0,0,0,8H44v44a12,12,0,0,0,12,12h44v20a4,4,0,0,0,8,0V212h40v20a4,4,0,0,0,8,0V212h44a12,12,0,0,0,12-12V156h20a4,4,0,0,0,0-8Zm-28,52a4,4,0,0,1-4,4H56a4,4,0,0,1-4-4V56a4,4,0,0,1,4-4H200a4,4,0,0,1,4,4Z"></path></svg>
                <div>
                  <p>Número de Cores</p>
                  <p>{product.details.prodCPUCores}</p>
                </div>
              </div>
              <div className={styles.productInfoCard}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M232,60H24A12,12,0,0,0,12,72V200a4,4,0,0,0,8,0V180H44v20a4,4,0,0,0,8,0V180H76v20a4,4,0,0,0,8,0V180h24v20a4,4,0,0,0,8,0V180h24v20a4,4,0,0,0,8,0V180h24v20a4,4,0,0,0,8,0V180h24v20a4,4,0,0,0,8,0V180h24v20a4,4,0,0,0,8,0V72A12,12,0,0,0,232,60ZM20,72a4,4,0,0,1,4-4H232a4,4,0,0,1,4,4V172H20Zm92,76a4,4,0,0,0,4-4V96a4,4,0,0,0-4-4H48a4,4,0,0,0-4,4v48a4,4,0,0,0,4,4ZM52,100h56v40H52Zm92,48h64a4,4,0,0,0,4-4V96a4,4,0,0,0-4-4H144a4,4,0,0,0-4,4v48A4,4,0,0,0,144,148Zm4-48h56v40H148Z"></path></svg>
                <div>
                  <p>Memória RAM</p>
                  <p>{product.details.prodRAM}</p>
                </div>
              </div>
              <div className={styles.productInfoCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M192.14,42.55C174.94,33.17,152.16,28,128,28S81.06,33.17,63.86,42.55C45.89,52.35,36,65.65,36,80v96c0,14.35,9.89,27.65,27.86,37.45,17.2,9.38,40,14.55,64.14,14.55s46.94-5.17,64.14-14.55c18-9.8,27.86-23.1,27.86-37.45V80C220,65.65,210.11,52.35,192.14,42.55ZM212,176c0,11.29-8.41,22.1-23.69,30.43C172.27,215.18,150.85,220,128,220s-44.27-4.82-60.31-13.57C52.41,198.1,44,187.29,44,176V149.48c4.69,5.93,11.37,11.34,19.86,16,17.2,9.38,40,14.55,64.14,14.55s46.94-5.17,64.14-14.55c8.49-4.63,15.17-10,19.86-16Zm0-48c0,11.29-8.41,22.1-23.69,30.43C172.27,167.18,150.85,172,128,172s-44.27-4.82-60.31-13.57C52.41,150.1,44,139.29,44,128V101.48c4.69,5.93,11.37,11.34,19.86,16,17.2,9.38,40,14.55,64.14,14.55s46.94-5.17,64.14-14.55c8.49-4.63,15.17-10,19.86-16Zm-23.69-17.57C172.27,119.18,150.85,124,128,124s-44.27-4.82-60.31-13.57C52.41,102.1,44,91.29,44,80s8.41-22.1,23.69-30.43C83.73,40.82,105.15,36,128,36s44.27,4.82,60.31,13.57C203.59,57.9,212,68.71,212,80S203.59,102.1,188.31,110.43Z"></path></svg>
                <div>
                  <p>Armazenamento</p>
                  <p>{product.details.prodStorage}</p>
                </div>
              </div>
              <div className={styles.productInfoCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M216,44H40A12,12,0,0,0,28,56V200a12,12,0,0,0,12,12H216a12,12,0,0,0,12-12V56A12,12,0,0,0,216,44Zm4,156a4,4,0,0,1-4,4H40a4,4,0,0,1-4-4V56a4,4,0,0,1,4-4H216a4,4,0,0,1,4,4ZM76,84a8,8,0,1,1-8-8A8,8,0,0,1,76,84Zm40,0a8,8,0,1,1-8-8A8,8,0,0,1,116,84Z"></path></svg>
                <div>
                  <p>Sistema Operacional</p>
                  <p>{product.details.prodOS}</p>
                </div>
              </div>
            </div>
          )}

          { product.prodCategory === "Smartwatch" && (
            <div className={styles.productInfoCardsGrid}>
              <div className={styles.productInfoCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M162.83,197.17a4,4,0,0,1,0,5.66l-32,32a4,4,0,0,1-5.66,0l-32-32a4,4,0,0,1,5.66-5.66L124,222.34V33.66L98.83,58.83a4,4,0,0,1-5.66-5.66l32-32a4,4,0,0,1,5.66,0l32,32a4,4,0,0,1-5.66,5.66L132,33.66V222.34l25.17-25.17A4,4,0,0,1,162.83,197.17Z"></path></svg>
                <div>
                  <p>Altura</p>
                  <p>{product.details.prodHeight}</p>
                </div>
              </div>
              <div className={styles.productInfoCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M234.83,130.83l-32,32a4,4,0,0,1-5.66-5.66L222.34,132H33.66l25.17,25.17a4,4,0,0,1-5.66,5.66l-32-32a4,4,0,0,1,0-5.66l32-32a4,4,0,0,1,5.66,5.66L33.66,124H222.34L197.17,98.83a4,4,0,0,1,5.66-5.66l32,32A4,4,0,0,1,234.83,130.83Z"></path></svg>
                <div>
                  <p>Largura</p>
                  <p>{product.details.prodWidth}</p>
                </div>
              </div>
              <div className={styles.productInfoCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M192.14,42.55C174.94,33.17,152.16,28,128,28S81.06,33.17,63.86,42.55C45.89,52.35,36,65.65,36,80v96c0,14.35,9.89,27.65,27.86,37.45,17.2,9.38,40,14.55,64.14,14.55s46.94-5.17,64.14-14.55c18-9.8,27.86-23.1,27.86-37.45V80C220,65.65,210.11,52.35,192.14,42.55ZM212,176c0,11.29-8.41,22.1-23.69,30.43C172.27,215.18,150.85,220,128,220s-44.27-4.82-60.31-13.57C52.41,198.1,44,187.29,44,176V149.48c4.69,5.93,11.37,11.34,19.86,16,17.2,9.38,40,14.55,64.14,14.55s46.94-5.17,64.14-14.55c8.49-4.63,15.17-10,19.86-16Zm0-48c0,11.29-8.41,22.1-23.69,30.43C172.27,167.18,150.85,172,128,172s-44.27-4.82-60.31-13.57C52.41,150.1,44,139.29,44,128V101.48c4.69,5.93,11.37,11.34,19.86,16,17.2,9.38,40,14.55,64.14,14.55s46.94-5.17,64.14-14.55c8.49-4.63,15.17-10,19.86-16Zm-23.69-17.57C172.27,119.18,150.85,124,128,124s-44.27-4.82-60.31-13.57C52.41,102.1,44,91.29,44,80s8.41-22.1,23.69-30.43C83.73,40.82,105.15,36,128,36s44.27,4.82,60.31,13.57C203.59,57.9,212,68.71,212,80S203.59,102.1,188.31,110.43Z"></path></svg>
                <div>
                  <p>Capacidade</p>
                  <p>{product.details.prodCapacity}</p>
                </div>
              </div>
            </div>
          )}

          { product.prodCategory === "Headset" && (
            <div className={styles.productInfoCardsGrid}>
              <div className={styles.productInfoCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M194.4,172.8,134.67,128,194.4,83.2a4,4,0,0,0,0-6.4l-64-48A4,4,0,0,0,124,32v88L66.4,76.8a4,4,0,0,0-4.8,6.4L121.33,128,61.6,172.8a4,4,0,0,0,4.8,6.4L124,136v88a4,4,0,0,0,6.4,3.2l64-48a4,4,0,0,0,0-6.4ZM132,40l53.33,40L132,120Zm0,176V136l53.33,40ZM60,136a8,8,0,1,1,8-8A8,8,0,0,1,60,136Zm152-8a8,8,0,1,1-8-8A8,8,0,0,1,212,128Z"></path></svg>
                <div>
                  <p>Tecnologia de Conexão</p>
                  <p>{product.details.prodConnectionTechnology}</p>
                </div>
              </div>
              <div className={styles.productInfoCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M162.83,197.17a4,4,0,0,1,0,5.66l-32,32a4,4,0,0,1-5.66,0l-32-32a4,4,0,0,1,5.66-5.66L124,222.34V33.66L98.83,58.83a4,4,0,0,1-5.66-5.66l32-32a4,4,0,0,1,5.66,0l32,32a4,4,0,0,1-5.66,5.66L132,33.66V222.34l25.17-25.17A4,4,0,0,1,162.83,197.17Z"></path></svg>
                <div>
                  <p>Altura</p>
                  <p>{product.details.prodHeight}</p>
                </div>
              </div>
              <div className={styles.productInfoCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M234.83,130.83l-32,32a4,4,0,0,1-5.66-5.66L222.34,132H33.66l25.17,25.17a4,4,0,0,1-5.66,5.66l-32-32a4,4,0,0,1,0-5.66l32-32a4,4,0,0,1,5.66,5.66L33.66,124H222.34L197.17,98.83a4,4,0,0,1,5.66-5.66l32,32A4,4,0,0,1,234.83,130.83Z"></path></svg>
                <div>
                  <p>Largura</p>
                  <p>{product.details.prodWidth}</p>
                </div>
              </div>
            </div>
          )}

          <p>{product.prodDetail}</p>
          <button onClick={() => addProductToBag(product._id, product.prodName, product.prodImg, product.prodPrice)}><Image src={bagIcon} alt="Adicionar na sacola" width={16} height={16}/>Adicionar na sacola</button>

          <div className={styles.icons}>
            <div className={styles.iconInfo}>
              <Image src={Delivery} alt="Entrega grátis" />
              <div>
                <p>Frete grátis</p>
                <p>1-2 dias</p>
              </div>
            </div>
            <div className={styles.iconInfo}>
              <Image src={Stock} alt="Em estoque" />
              <div>
                <p>Em estoque</p>
                <p>Hoje</p>
              </div>
            </div>
            <div className={styles.iconInfo}>
              <Image src={Guaranteed} alt="1 ano de garantia" />
              <div>
                <p>Garantia</p>
                <p>1 ano</p>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </>
  )
}