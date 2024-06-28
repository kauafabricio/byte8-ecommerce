import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import env from "../../env";
import { useAuth } from "../../context/AuthContext";
import NavBar from "../../src/app/components/navbar"
import styles from  "../../src/app/styles/checkout.module.css"
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
import Footer from  "../../src/app/components/footer"
import PopUp from "../../src/app/components/popup"


// IMAGES IMPORTS

import creditCard from "../../public/imgs/credit-card.png"
import Head from "next/head";

// TYPES
import { UserAddress } from "../../context/AuthContext";
interface Cupom {
  code: string;
  quantity: number;
  discount: number;
  expire: Date;
}

export default function Checkout() {

  const api = axios.create({
    baseURL: env.urlServer
  });

  const router = useRouter();
  const { id } = router.query;

  const { userId, userBag, userAddress, setUserAddress, fetchBagData } = useAuth();

  // VERIFY USER

  const fetchBagDataCallback = useCallback(() => {
    fetchBagData();
  }, [fetchBagData]);

  useEffect(() => {

    const verifyUser = async () => {
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
            if (id !== response.data.userId) return window.location.href = `${env.urlFront}/loja`
            fetchBagDataCallback()
          }
        } catch (err: any) {
          window.location.href = `${env.urlFront}/login`
        }
      }
    }
    verifyUser()
  }, [fetchBagDataCallback])

  // CUPOM STATES
  const [userCupom, setUserCupom] = useState<Cupom>({
    code: '',
    quantity: 0,
    discount: 0,
    expire: new Date()
  });
  const [cupom, setCupom] = useState('')

  // INTERFACE STATES
  const [checkoutClass, setCheckoutClass] = useState(styles.checkoutContainer)
  const [stepsClass, setStepsClass] = useState(styles.Off)
  const [addressClass, setAddressClass] = useState(styles.addressContainer)
  const [shippingClass, setShippingClass] = useState(styles.Off)
  const [paymentClass, setPaymentClass] = useState(styles.Off)

  // POPUP STATES
  const [showPopUp, setShowPopUp] = useState(false);
  const [textPopUp, setTextPopUp] = useState('')
  const [popUpStatus, setPopUpStatus] = useState('')

  // BREADCRUMB STATES

  const [addressBreadcrumb, setAddressBreadcrumb] = useState(styles.steps)
  const [shippingBreadcrumb, setShippingBreadcrumb] = useState(`${styles.steps} ${styles.lowOpacity}`)
  const [paymentBreadcrumb, setPaymentBreadcrumb] = useState(`${styles.steps} ${styles.lowOpacity}`)

  // ADDRESS STATES
  
  const [selectedAddress, setSelectedAddress] = useState<UserAddress>({
    _id: '',
    streetAddress: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    postalCode: 0,
    country: ''
  })
  const [formAddress, setFormAddress] = useState<boolean>(false)
  const [streetAddressForm, setStreetAddressForm] = useState<string>('')
  const [complementForm, setComplementForm] = useState<string>('')
  const [neighborhoodForm, setNeighborhoodForm] = useState<string>('')
  const [cityForm, setCityForm] = useState<string>('')
  const [stateForm, setStateForm] = useState<string>('')
  const [postalCodeForm, setPostalCodeForm] = useState<string>('')
  const [countryForm, setCountryForm] = useState<string>('')

  // SHIPPING STATES
  const [selectedShipping, setSelectedShipping] = useState('')

  // PAYMENT STATES

  const [cardHolder, setCardHolder] = useState<string>('')
  const [cardNumber, setCardNumber] = useState<number | "">("")
  const [cardDateExp, setCardDateExp] = useState<Date | "">("")
  const [cardCVV, setCardCVV] = useState<number | "">("")

  // SYSTEM CODE


  const updateProductQuantity = async (productId: string, quantity: number) => {
    try {
      const formData = `userId=${userId}&productId=${productId}&quantity=${quantity}`
      const response = await api.put('/api/refresh-bag', formData);

      if (response.status === 200) {
        fetchBagDataCallback();
      }
    } catch (error) {
      setTextPopUp(`Erro ao atualizar a quantidade do produto: ${productId}`)
      setShowPopUp(true)
      setPopUpStatus("error")
    }
  };

  const handleIncreaseQuantity = (productId: string, currentQuantity: number) => {
    const newQuantity = currentQuantity + 1;
    updateProductQuantity(productId, newQuantity);
  };

  const handleDecreaseQuantity = (productId: string, currentQuantity: number) => {
    if (currentQuantity === 1) return;
    const newQuantity = currentQuantity - 1;
    updateProductQuantity(productId, newQuantity);
  };
  
  const deleteProductOnBag = async (name: string) => {
    try {
      const response = await api.delete('/api/delete-product', {
        data: {
          name: name,
          userid: userId
        },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json;charset=utf-8'
        }
      })

      if (response.data.message) {
        setTextPopUp(response.data.message)
        setShowPopUp(true)
        setPopUpStatus("success")
        fetchBagData()
      }
    } catch (err: any) {
      setTextPopUp(err.response?.data?.error || 'Erro ao deletar produto');
      setShowPopUp(true)
      setPopUpStatus("error")
    }
  }

  const totalCheckout = userBag.reduce((total: number, product): number => {
    return total + (product.productPrice * product.productQuantity);
  }, 0);

  const cupomDiscount = () => {
    if (userCupom) {
      const discountValue = totalCheckout * userCupom.discount / 100;
      return discountValue;
    }
  }

  const totalWithCupom = () => {
    if (userCupom && typeof userCupom.discount === 'number') {
      const discountValue = totalCheckout * userCupom.discount / 100;
      return totalCheckout - discountValue;
    }
    return totalCheckout;
  };

  const sendCupom = (cupom: string): void => {
    const sendData = async () => {
      const formData = `userId=${userId}&cupom=${cupom}`
      try {
        const response = await api.post('/api/cupom', formData, {
          headers: {
            Accept: 'application/json;charset=utf-8'
          }
        })
        if (response.status === 200) {
          setCupom('')
          setUserCupom(response.data.userCupom)
        }
      } catch (error: any) {
        setTextPopUp(error.response.data.error)
        setShowPopUp(true)
        setPopUpStatus("error")
      }
    }
    sendData();
  } 

  const payOrder = () => {
    if (userId) {
      const cardNumberStr = cardNumber.toString()
      const cardCVVStr = cardCVV.toString()
      if (cardNumberStr.length === 16 && cardCVVStr.length === 3) {
        const finishPayment = async () => {
          try {
            const totalPrice = totalWithCupom();
            const discount = cupomDiscount();
            const formData = {
              userId,
              items: userBag,
              address: selectedAddress,
              totalAmount: totalPrice,
              discountAmount: discount
            };
            const response = await api.post('/api/process-order', JSON.stringify(formData), {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json;charset=utf-8'
              }
            })
            if (response.status === 200) {
              setTextPopUp("Pedido realizado com sucesso!")
              setShowPopUp(true)
              setPopUpStatus("success")
              window.location.href = `${env.urlFront}/orders`
            }
          } catch (error: any) {
            setTextPopUp(error.response.data.error)
            setShowPopUp(true)
            setPopUpStatus("error")
          }
        }

        finishPayment();
      } else {
        setTextPopUp("Não foi possível realizar o pagamento com este cartão de crédito.")
        setShowPopUp(true)
        setPopUpStatus("error")
      }
    } else {
      window.location.href = `${env.urlFront}/login`
    }
  }

  const nextInterface = (): void => {
    if (checkoutClass === styles.checkoutContainer) {

      if (userBag.length === 0) {
        setTextPopUp("Não há nenhum produto na Sacola de Desejos para processar o pedido.")
        setShowPopUp(true)
        setPopUpStatus("error")
      } else {
        setCheckoutClass(styles.Off)
        setStepsClass(styles.stepsInterface)
        setAddressClass(styles.addressInterface)
        setShippingClass(styles.Off)
        setPaymentClass(styles.Off)
        setAddressBreadcrumb(styles.steps)
        setShippingBreadcrumb(`${styles.steps} ${styles.lowOpacity}`)
        setPaymentBreadcrumb(`${styles.steps} ${styles.lowOpacity}`)
      }
    }
    if (addressClass === styles.addressInterface) {
      if (selectedAddress && selectedAddress.streetAddress) {
        setAddressClass(styles.Off)
        setShippingClass(styles.shippingInterface)
        setAddressBreadcrumb(`${styles.steps} ${styles.lowOpacity}`)
        setShippingBreadcrumb(styles.steps)
      } else {
        setTextPopUp("Selecione o endereço de entrega.")
        setShowPopUp(true)
        setPopUpStatus("error")
      }
    }
    if (shippingClass === styles.shippingInterface) {
      if (selectedShipping) {
        setShippingClass(styles.Off)
        setPaymentClass(styles.paymentInterface)
        setShippingBreadcrumb(`${styles.steps} ${styles.lowOpacity}`)
        setPaymentBreadcrumb(styles.steps)
      } else {
        setTextPopUp("Selecione um método de entrega.")
        setShowPopUp(true)
        setPopUpStatus("error")
      }
    }
    if (paymentClass === styles.paymentInterface) {
      if (cardHolder && cardNumber && cardDateExp && cardCVV) {
        payOrder()
      } else {
        setTextPopUp("Preencha todos os campos para realizar o pagamento.")
        setShowPopUp(true)
        setPopUpStatus("error")
      }
    }
  }

  const backInterface = (): void => {
    if (addressClass === styles.addressInterface) {
      setStepsClass(styles.Off)
      setAddressClass(styles.Off)
      setCheckoutClass(styles.checkoutContainer)
    }
    if (shippingClass === styles.shippingInterface) {
      setShippingClass(styles.Off)
      setAddressClass(styles.addressInterface)
      setShippingBreadcrumb(`${styles.steps} ${styles.lowOpacity}`)
      setAddressBreadcrumb(styles.steps)
    }
    if (paymentClass === styles.paymentInterface) {
      setPaymentClass(styles.Off)
      setPaymentBreadcrumb(`${styles.steps} ${styles.lowOpacity}`)
      setShippingClass(styles.shippingInterface)
      setShippingBreadcrumb(styles.steps)
    }
  }

  const sendAddressForm = async () => {
    try {
      const formData = `userId=${userId}&street=${streetAddressForm}&complement=${complementForm}&neighborhood=${neighborhoodForm}&city=${cityForm}&state=${stateForm}&cep=${postalCodeForm}&country=${countryForm}`

      const response = await api.post('/api/add-address', formData, {
        headers: {
          Accept: 'application/json;charset=utf-8'
        }
      })
      if (response.status === 200) {
        setFormAddress(false)
        setStreetAddressForm('')
        setComplementForm('')
        setNeighborhoodForm('')
        setCityForm('')
        setStateForm('')
        setPostalCodeForm('')
        setCountryForm('')
        setTextPopUp("Endereço adicionado com sucesso!")
        setShowPopUp(true)
        setPopUpStatus("success")
        setUserAddress(response.data.userAddress)
      }
    } catch (error: any) {
      setTextPopUp(error.response.data.error)
      setShowPopUp(true)
      setPopUpStatus("error")
    }
  }

  const removeAddress = (id: string) => {
    const deleteAddress = async () => {
      try {
        const response = await api.delete('/api/delete-address', {
          headers: {
            addressid: id,
            userid: userId,
            Accept: 'application/json;charset=utf-8',
          }
        });
        if (response.status === 200) {
          setTextPopUp("Endereço removido com sucesso!");
          setShowPopUp(true);
          setPopUpStatus("success")
          setUserAddress(response.data.userAddress);
        }
      } catch (error: any) {
        setTextPopUp(error.response?.data?.error || "Erro ao remover endereço");
        setShowPopUp(true);
        setPopUpStatus("error")
      }
    };
  
    deleteAddress();
  };

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

  const handleDateChange = (value: string) => {
    if (value === "") {
      setCardDateExp("");
    } else {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setCardDateExp(date);
      }
    }
  };

  return(
    <>
      <Head>
        <title>Byte8 | Finalizar pedido</title>
      </Head>
      <NavBar />
      { showPopUp && <PopUp text={textPopUp} onClose={() => setShowPopUp(false)} status={popUpStatus} /> };
      { formAddress && (
          <div className={styles.formAddressMain}>
            <div className={styles.formAddressContainer}>
              <div className={styles.formAddressHeader}>
                <h1>Adicionar novo endereço</h1>
                <button onClick={() => setFormAddress(false)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffffff" viewBox="0 0 256 256"><path d="M202.83,197.17a4,4,0,0,1-5.66,5.66L128,133.66,58.83,202.83a4,4,0,0,1-5.66-5.66L122.34,128,53.17,58.83a4,4,0,0,1,5.66-5.66L128,122.34l69.17-69.17a4,4,0,1,1,5.66,5.66L133.66,128Z"></path></svg></button>
              </div>
              <form onSubmit={(e) => {e.preventDefault(); sendAddressForm()}} action="POST">
                <label htmlFor="street">*Endereço da rua:</label>
                <input id="street" placeholder="Rua Nossa Senhora, nº 35" type="text" value={streetAddressForm} onChange={(e) => setStreetAddressForm(e.target.value)} required/>
                <label htmlFor="complement">Complemento:</label>
                <input id="complement" placeholder="Ex: Perto da academia, perto do petshop..." type="text" value={complementForm} onChange={(e) => setComplementForm(e.target.value)} />
                <label htmlFor="neighborhood">*Bairro:</label>
                <input id="neighborhood" placeholder="Endereço do bairro" type="text" value={neighborhoodForm} onChange={(e) => setNeighborhoodForm(e.target.value)} required/>
                <section>
                  <div>
                    <label htmlFor="city">*Cidade:</label>
                    <input placeholder="Cidade" type="text" value={cityForm} onChange={(e) => setCityForm(e.target.value)} required/>
                  </div>
                  <div>
                    <label htmlFor="state">*Estado:</label>
                    <input id="state" placeholder="Estado" type="text" value={stateForm} onChange={(e) => setStateForm(e.target.value)} required />
                  </div>
                  <div>
                    <label htmlFor="CEP">*CEP:</label>
                    <input id="CEP" placeholder="CEP" type="number" value={postalCodeForm} onChange={(e) => setPostalCodeForm(e.target.value)} required />
                  </div>
                  <div>
                    <label htmlFor="country">*País:</label>
                    <input id="country" placeholder="País" type="text" value={countryForm} onChange={(e) => setCountryForm(e.target.value)} required/>
                  </div>

                </section>

                <button type="submit"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff" viewBox="0 0 256 256"><path d="M36,64a4,4,0,0,1,4-4H216a4,4,0,0,1,0,8H40A4,4,0,0,1,36,64Zm4,68H216a4,4,0,0,0,0-8H40a4,4,0,0,0,0,8Zm104,56H40a4,4,0,0,0,0,8H144a4,4,0,0,0,0-8Zm88,0H212V168a4,4,0,0,0-8,0v20H184a4,4,0,0,0,0,8h20v20a4,4,0,0,0,8,0V196h20a4,4,0,0,0,0-8Z"></path></svg> Adicionar endereço</button>
              </form>
            </div>
          </div>
            )}
      <main className={styles.checkoutMain}>
        {/* CHECKOUT INTERFACE */}
        <div className={checkoutClass}>
          <div className={styles.checkoutBag}>
            <p className={styles.paragraphBag}>Sacola de desejos</p>
            { userBag && userBag.length > 0 ? 
            userBag.map(product => (
              <>
              <div key={product.productId} className={styles.checkoutIndividualProduct}>

                <div key={product.productId} className={styles.individualProductInfo}>

                  <img src={product.productImg} alt="Imagem do produto" />
                  <div className={styles.individualProductInfoText}>
                    <p>{product.productName}</p>
                    <p>#{product.productId}</p>
                  </div>

                </div>

                <div className={styles.checkoutCounter}>
                  <button onClick={() => handleDecreaseQuantity(product.productId, product.productQuantity)}>-</button>
                  <p>{product.productQuantity}</p>
                  <button onClick={() => handleIncreaseQuantity(product.productId, product.productQuantity)}>+</button>
                </div>

                <p className={styles.checkoutIndividualProductPrice}>R$ {product.productPrice * product.productQuantity},00</p>

                <button onClick={() => deleteProductOnBag(product.productName)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="#cecece" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
               </button>

              </div>
              </>
            )) : (
              <p>Não há produtos no carrinho.</p>
            )}
          </div>

          <div className={styles.checkoutOrderSummary}>
            <p className={styles.checkoutSummaryText}>Resumo do pedido</p>
            <form action="POST" onSubmit={(e) => {e.preventDefault(); sendCupom(cupom)}}>
              <p>Cupom de desconto:</p>
              <label htmlFor="cupom"><input id="cupom" type="text" onChange={(event) => setCupom(event.target.value)} value={cupom} placeholder="Código do cupom"/><button type="submit">Aplicar</button></label>
            </form>

            <div className={styles.checkoutSubTotal}>
              <p>Subtotal</p>
              <p>R${totalCheckout},00</p>
            </div>
            { userCupom && userCupom.code && (
              <div className={styles.checkoutCupom}>
                <p>{userCupom.code}</p>
                <p>- R${cupomDiscount()},00</p>
              </div>
            )}
            <div className={styles.checkoutTotal}>
              <p>Total</p>
              <p>R${totalWithCupom()},00</p>
            </div>
            
            <button onClick={() => nextInterface()} className={styles.checkoutButton}>Finalizar pedido</button>
        
          </div>
        </div>
        
        {/* STEPS INTERFACE */}
        <div className={stepsClass}>
          <div className={styles.stepBreadcrumb}>
            {/* ADDRESS BREADCRUMB */}
            <div className={addressBreadcrumb}>
              <svg className={styles.stepsIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffffff" viewBox="0 0 256 256"><path d="M116,80a12,12,0,1,1,12,12A12,12,0,0,1,116,80ZM97.08,147.73C78.05,127.35,68,103.93,68,80a60,60,0,0,1,120,0c0,23.93-10.05,47.35-29.08,67.73A136.54,136.54,0,0,1,130,171.47a4,4,0,0,1-4,0A136.54,136.54,0,0,1,97.08,147.73ZM76,80c0,47.09,42.25,77,52,83.3,9.75-6.28,52-36.21,52-83.3A52,52,0,0,0,76,80Zm125.38,71.38a4,4,0,0,0-2.76,7.51c18.67,6.89,29.38,16,29.38,25.11,0,17.39-40.18,36-100,36S28,201.39,28,184c0-9.07,10.71-18.22,29.38-25.11a4,4,0,0,0-2.76-7.51C32.29,159.62,20,171.21,20,184c0,12.46,11.73,23.83,33,32,20.09,7.73,46.72,12,75,12s54.89-4.25,75-12c21.29-8.19,33-19.56,33-32C236,171.21,223.71,159.62,201.38,151.38Z"></path></svg>
              <div>
                <p>Passo 1</p>
                <p>Endereço</p>
              </div>
            </div>

            <svg className={styles.lineBreadcrumb} xmlns="http://www.w3.org/2000/svg" height="1" viewBox="0 0 224 1" fill="#fff">
            <line x1="2.18557e-08" y1="0.749992" x2="224" y2="0.750012" stroke="url(#paint0_linear_253_13395)" stroke-width="0.5" stroke-dasharray="3 3"/>
            <defs>
            <linearGradient id="paint0_linear_253_13395" x1="226.909" y1="1.00001" x2="0" y2="0.999992" gradientUnits="userSpaceOnUse">
            <stop offset="0.00551862" stop-color="#E6E6E6"/>
            <stop offset="0.461458"/>
            <stop offset="1" stop-color="#E6E6E6" stop-opacity="0.43"/>
            </linearGradient>
            </defs>
            </svg>
            {/* SHIPPING BREADCRUMB */}
            <div className={shippingBreadcrumb}>
             <svg className={styles.stepsIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffffff" viewBox="0 0 256 256"><path d="M251.71,118.52l-14-35A12,12,0,0,0,226.58,76H188V64a4,4,0,0,0-4-4H32A12,12,0,0,0,20,72V184a12,12,0,0,0,12,12H52.29a28,28,0,0,0,55.42,0h56.58a28,28,0,0,0,55.42,0H240a12,12,0,0,0,12-12V120A4,4,0,0,0,251.71,118.52ZM188,84h38.58a4,4,0,0,1,3.72,2.51L242.09,116H188ZM28,72a4,4,0,0,1,4-4H180v72H28ZM80,212a20,20,0,1,1,20-20A20,20,0,0,1,80,212Zm84.29-24H107.71a28,28,0,0,0-55.42,0H32a4,4,0,0,1-4-4V148H180v18.71A28.05,28.05,0,0,0,164.29,188ZM192,212a20,20,0,1,1,20-20A20,20,0,0,1,192,212Zm52-28a4,4,0,0,1-4,4H219.71A28,28,0,0,0,188,164.29V124h56Z"></path></svg>
             <div>
              <p>Passo 2</p>
              <p>Entrega</p>
             </div>
            </div>

            <svg className={styles.lineBreadcrumb} xmlns="http://www.w3.org/2000/svg" height="1" viewBox="0 0 224 1" fill="#fff">
            <line x1="2.18557e-08" y1="0.749992" x2="224" y2="0.750012" stroke="url(#paint0_linear_253_13395)" stroke-width="0.5" stroke-dasharray="3 3"/>
            <defs>
            <linearGradient id="paint0_linear_253_13395" x1="226.909" y1="1.00001" x2="0" y2="0.999992" gradientUnits="userSpaceOnUse">
            <stop offset="0.00551862" stop-color="#E6E6E6"/>
            <stop offset="0.461458"/>
            <stop offset="1" stop-color="#E6E6E6" stop-opacity="0.43"/>
            </linearGradient>
            </defs>
            </svg>
            {/* PAYMENT BREADCRUMB */}
            <div className={paymentBreadcrumb}>
              <svg className={styles.stepsIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffffff" viewBox="0 0 256 256"><path d="M242.12,63.39a4,4,0,0,0-3.88-.2c-44.37,21.68-75.77,11.64-109,1s-67.71-21.67-115,1.42A4,4,0,0,0,12,69.21v120a4,4,0,0,0,5.76,3.6c44.37-21.68,75.77-11.64,109-1,18.86,6,38.08,12.19,59.8,12.19,16.61,0,34.69-3.6,55.18-13.61a4,4,0,0,0,2.24-3.6v-120A4,4,0,0,0,242.12,63.39ZM236,184.27c-43.19,20.27-74.1,10.38-106.78-.08-18.86-6-38.08-12.18-59.8-12.18-15,0-31.28,3-49.42,10.94V71.73c43.19-20.27,74.1-10.38,106.78.08C158.7,82,191.67,92.57,236,73.05ZM128,100a28,28,0,1,0,28,28A28,28,0,0,0,128,100Zm0,48a20,20,0,1,1,20-20A20,20,0,0,1,128,148ZM52,96v48a4,4,0,0,1-8,0V96a4,4,0,0,1,8,0Zm152,64V112a4,4,0,0,1,8,0v48a4,4,0,0,1-8,0Z"></path></svg>
              <div>
                <p>Passo 3</p>
                <p>Pagamento</p>
              </div>
            </div>
          </div>
          {/* ADDRESS INTERFACE */}
          <div className={addressClass}>
            <h1>Selecione o endereço</h1>
              <div className={styles.userAddress}>
                <button onClick={() => setFormAddress(true)}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff" viewBox="0 0 256 256"><path d="M36,64a4,4,0,0,1,4-4H216a4,4,0,0,1,0,8H40A4,4,0,0,1,36,64Zm4,68H216a4,4,0,0,0,0-8H40a4,4,0,0,0,0,8Zm104,56H40a4,4,0,0,0,0,8H144a4,4,0,0,0,0-8Zm88,0H212V168a4,4,0,0,0-8,0v20H184a4,4,0,0,0,0,8h20v20a4,4,0,0,0,8,0V196h20a4,4,0,0,0,0-8Z"></path></svg> Adicionar novo endereço</button>
                { userAddress.length > 0 && (
                  userAddress.map((address, index) => (
                    <div className={styles.divAddress} key={index}>
                      <section>
                        <input
                          type="radio"
                          id={`address-${index}`}
                          name="deliveryAddress"
                          checked={selectedAddress === address}
                          onChange={() => setSelectedAddress(address)}
                        />
                        <div>
                          <p>{address.country}</p>
                          <label htmlFor={`address-${index}`}>
                          {address.streetAddress}, {address.neighborhood}, {address.city}, {address.state}, {address.postalCode}
                          </label>
                        </div>
                      </section>

                      <button onClick={() => removeAddress(address._id)}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff" viewBox="0 0 256 256"><path d="M202.83,197.17a4,4,0,0,1-5.66,5.66L128,133.66,58.83,202.83a4,4,0,0,1-5.66-5.66L122.34,128,53.17,58.83a4,4,0,0,1,5.66-5.66L128,122.34l69.17-69.17a4,4,0,1,1,5.66,5.66L133.66,128Z"></path></svg></button>
                    </div>
                  ))
                )}
                { userAddress.length == 0 && (
                  <p>Você não possui nenhum endereço salvo.</p>
                )}
              </div>
          </div>
          {/* SHIPPING INTERFACE */}
          <div className={shippingClass}>
            <h1>Método de entrega</h1>
            <div className={styles.freeShipping}>
              <div className={styles.freeShippingInfo}>
                <div>
                  <input
                    type="radio"
                    name="freeShipping"
                    onChange={() => setSelectedShipping('Free')}
                   />
                  <p>Free</p>
                </div>
                <p>Entrega regular</p>
              </div>
              <p>2-4 dias</p>
            </div>
          </div>
          {/* PAYMENT INTERFACE */}
          <div className={paymentClass}>

            <div className={styles.paymentSummary}>
              <h1>Resumo</h1>
              <div className={styles.paymentSummaryItems}>
                { userBag && (
                  userBag.map((product) => (
                    <div className={styles.paymentSummaryItem}>
                      <div className={styles.paymentSummaryItemsProductInfo}>
                        <img src={product.productImg} alt={product.productName} />
                        <p>{product.productName} x{product.productQuantity}</p>
                      </div>
                      <p>R$ {product.productPrice * product.productQuantity},00</p>
                    </div>
                  ))
                )}
              </div>

              <div className={styles.paymentSummaryAddress}>
                <p>Endereço de entrega</p>
                { selectedAddress && (
                  <p>{selectedAddress.streetAddress}, {selectedAddress.neighborhood}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.country}</p>
                )}
              </div>

              <div className={styles.paymentSummaryShipping}>
                <p>Método de entrega</p>
                { selectedShipping && (
                  <p>{selectedShipping}</p>
                )}
              </div>
              <div className={styles.paymentSummarySubTotal}>
              <p>Subtotal</p>
              <p>R${totalCheckout},00</p>
              </div>
              { userCupom && userCupom.code && (
                <div className={styles.paymentSummaryCupom}>
                  <p>{userCupom.code}</p>
                  <p>- R${cupomDiscount()},00</p>
                </div>
              )}
              <div className={styles.paymentSummaryTotal}>
                <p>Total</p>
                <p>R${totalWithCupom()},00</p>
              </div>
            </div>

            <div className={styles.paymentMethod}>
              <h1>Pagamento</h1>
              <button>Cartão de crédito</button>
              <Image src={creditCard} alt="Cartão de crédito" height={150} />

              <form action="POST">
                <input value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} type="text" placeholder="Titular do cartão" required/>
                <input
                  value={cardNumber === "" ? "" : cardNumber}
                  onChange={(e) => setCardNumber(e.target.value === "" ? "" : Number(e.target.value))}
                  type="number"
                  placeholder="Número do cartão"
                  required
                />
                <div>
                <input
                  value={cardDateExp === "" ? "" : cardDateExp.toISOString().substring(0, 10)}
                  onChange={(e) => handleDateChange(e.target.value)}
                  type="date"
                  placeholder="Data de Expiração"
                  required
                />
                  <input
                    value={cardCVV === "" ? "" : cardCVV}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCardCVV(value === "" ? "" : Number(value));
                    }}
                    type="number"
                    placeholder="CVV"
                    required
                  />
                </div>
              </form>
            </div>

          </div>

          { paymentClass !== styles.paymentInterface && (
            <div className={styles.buttonNextAndBack}>
              <button onClick={() => backInterface()}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.1,92.1,0,0,1,128,220Zm44-92a4,4,0,0,1-4,4H97.66l25.17,25.17a4,4,0,0,1-5.66,5.66l-32-32a4,4,0,0,1,0-5.66l32-32a4,4,0,0,1,5.66,5.66L97.66,124H168A4,4,0,0,1,172,128Z"></path></svg> Voltar</button>
              <button onClick={() => nextInterface()}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffffff" viewBox="0 0 256 256"><path d="M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.1,92.1,0,0,1,128,220Zm42.83-94.83a4,4,0,0,1,0,5.66l-32,32a4,4,0,0,1-5.66-5.66L158.34,132H88a4,4,0,0,1,0-8h70.34L133.17,98.83a4,4,0,0,1,5.66-5.66Z"></path></svg> Avançar</button>
            </div>
          )}
          { paymentClass === styles.paymentInterface && (
            <div className={styles.buttonNextAndBack}>
            <button onClick={() => backInterface()}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.1,92.1,0,0,1,128,220Zm44-92a4,4,0,0,1-4,4H97.66l25.17,25.17a4,4,0,0,1-5.66,5.66l-32-32a4,4,0,0,1,0-5.66l32-32a4,4,0,0,1,5.66,5.66L97.66,124H168A4,4,0,0,1,172,128Z"></path></svg> Voltar</button>
            <button onClick={() => nextInterface()}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffffff" viewBox="0 0 256 256"><path d="M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.1,92.1,0,0,1,128,220Zm42.83-94.83a4,4,0,0,1,0,5.66l-32,32a4,4,0,0,1-5.66-5.66L158.34,132H88a4,4,0,0,1,0-8h70.34L133.17,98.83a4,4,0,0,1,5.66-5.66Z"></path></svg> Realizar pagamento</button>
          </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}