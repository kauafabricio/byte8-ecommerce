import NavBar from "../src/app/components/navbar"
import React, { useState, useEffect } from "react";
import styles from "../src/app/styles/login.module.css"
import axios from "axios";
import env from "../env";
import Cookies from "js-cookie"
import PopUp from "../src/app/components/popup"
import Head from "next/head";

export default function Login() {

  const api = axios.create({
    baseURL: env.urlServer
  });

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
            window.location.href = `${env.urlFront}/loja`
          }
        } catch (err: any) {
          window.location.href = `${env.urlFront}/login`
        }
      }
    }
    verifyUser()
  }, [])


  // PopUp States
  const [showPopUp, setShowPopUp] = useState(false);
  const [textPopUp, setTextPopUp] = useState('')
  const [popUpStatus, setPopUpStatus] = useState('')

  // Login States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [loginClass, setLoginClass] = useState(styles.containerForm);
  const [registerClass, setRegisterClass] = useState(styles.Off);


  // SYSTEM CODE

  const showRegisterForm = () => {
    setLoginClass(styles.Off)
    setRegisterClass(styles.containerForm)
    setEmail('')
    setPassword('')
  }

  const showLoginForm = () => {
    setRegisterClass(styles.Off)
    setLoginClass(styles.containerForm)
    setEmail('')
    setPassword('')
  }

  const registerAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = `userName=${userName}&registerEmail=${email}&registerPassword=${password}&repeatPassword=${repeatPassword}`;
    try {
      const response = await api.post('/register', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json;charset=utf-8'
        }
      })
      if (response) {
        setTextPopUp(response.data.message)
        setShowPopUp(true)
        setPopUpStatus('success')
        setEmail('')
        setPassword('')
        setUserName('')
        setRepeatPassword('')
      }
    } catch (err: any) {
      setTextPopUp(err.response.data.error)
      setShowPopUp(true)
      setPopUpStatus('error')
    }
  }

  const loginAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = `loginEmail=${email}&loginPassword=${password}`;
    try {
      const response = await api.post('/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json;charset=utf-8'
        }
      })
      if (response) {
        if (response.data.token) {
          await Cookies.set('token', response.data.token, { expires: 1 / 24 });
          window.location.href = `${env.urlFront}/loja`;
        }
      }
    } catch (err: any) {
      setTextPopUp(err.response.data.error);
      setShowPopUp(true);
      setPopUpStatus('error')
    }
  }

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
      <Head>
        <title>Byte8 | Login</title>
      </Head>
      <NavBar />
      { showPopUp && <PopUp text={textPopUp} onClose={() => setShowPopUp(false)} status={popUpStatus} /> };
      <main className={styles.loginMain}>
        <div className={styles.loginContainer}>

          {/* LOGIN */}
          <div className={loginClass}>
            <h1>Faça login na Byte8</h1>
            <hr></hr>
            <form onSubmit={loginAccount} action="POST" className={styles.formArea}>
              <label>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000" viewBox="0 0 256 256"><path d="M224,52H32a4,4,0,0,0-4,4V192a12,12,0,0,0,12,12H216a12,12,0,0,0,12-12V56A4,4,0,0,0,224,52Zm-10.28,8L128,138.57,42.28,60ZM216,196H40a4,4,0,0,1-4-4V65.09L125.3,147a4,4,0,0,0,5.4,0L220,65.09V192A4,4,0,0,1,216,196Z"></path></svg>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Digite seu e-mail"/>
              </label>
              
              <label>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000000" viewBox="0 0 256 256"><path d="M213.74,42.26A76,76,0,0,0,88.51,121.84l-57,57A11.93,11.93,0,0,0,28,187.31V216a12,12,0,0,0,12,12H72a4,4,0,0,0,4-4V204H96a4,4,0,0,0,4-4V180h20a4,4,0,0,0,2.83-1.17l11.33-11.34A75.72,75.72,0,0,0,160,172h.1A76,76,0,0,0,213.74,42.26Zm14.22,56c-1.15,36.22-31.6,65.72-67.87,65.77H160a67.52,67.52,0,0,1-25.21-4.83,4,4,0,0,0-4.45.83l-12,12H96a4,4,0,0,0-4,4v20H72a4,4,0,0,0-4,4v20H40a4,4,0,0,1-4-4V187.31a4.06,4.06,0,0,1,1.17-2.83L96,125.66a4,4,0,0,0,.83-4.45A67.51,67.51,0,0,1,92,95.91C92,59.64,121.55,29.19,157.77,28A68,68,0,0,1,228,98.23ZM188,76a8,8,0,1,1-8-8A8,8,0,0,1,188,76Z"></path></svg>
                <input value={password} onChange={(e) => setPassword(e.target.value)}  type="password" placeholder="Digite sua senha"/>
              </label>
              
              <button>Entrar <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="#000000" viewBox="0 0 256 256"><path d="M218.83,130.83l-72,72a4,4,0,0,1-5.66-5.66L206.34,132H40a4,4,0,0,1,0-8H206.34L141.17,58.83a4,4,0,0,1,5.66-5.66l72,72A4,4,0,0,1,218.83,130.83Z"></path></svg></button>
            </form>
            <hr></hr>
            <p>Não possui uma conta? <button onClick={showRegisterForm} type="button">Criar uma conta</button></p>
          </div>

          {/* REGISTER */}
          <div className={registerClass}>
            <h1>Registrar uma conta</h1>
            <hr></hr>
            <form onSubmit={registerAccount} action="POST" className={styles.formArea}>
              <label>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000000" viewBox="0 0 256 256"><path d="M216,44H40A12,12,0,0,0,28,56V200a12,12,0,0,0,12,12H216a12,12,0,0,0,12-12V56A12,12,0,0,0,216,44ZM66,204a68,68,0,0,1,124,0Zm154-4a4,4,0,0,1-4,4H198.67a76.17,76.17,0,0,0-50.06-45.14,44,44,0,1,0-41.22,0A76.17,76.17,0,0,0,57.33,204H40a4,4,0,0,1-4-4V56a4,4,0,0,1,4-4H216a4,4,0,0,1,4,4Zm-92-44a36,36,0,1,1,36-36A36,36,0,0,1,128,156Z"></path></svg>
                <input value={userName} onChange={(e) => setUserName(e.target.value)}  type="text" placeholder="Digite seu nome"/>
              </label>
              <label>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000" viewBox="0 0 256 256"><path d="M224,52H32a4,4,0,0,0-4,4V192a12,12,0,0,0,12,12H216a12,12,0,0,0,12-12V56A4,4,0,0,0,224,52Zm-10.28,8L128,138.57,42.28,60ZM216,196H40a4,4,0,0,1-4-4V65.09L125.3,147a4,4,0,0,0,5.4,0L220,65.09V192A4,4,0,0,1,216,196Z"></path></svg>
                <input value={email} onChange={(e) => setEmail(e.target.value)}  type="text" placeholder="Digite seu e-mail"/>
              </label>
              <label>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000000" viewBox="0 0 256 256"><path d="M213.74,42.26A76,76,0,0,0,88.51,121.84l-57,57A11.93,11.93,0,0,0,28,187.31V216a12,12,0,0,0,12,12H72a4,4,0,0,0,4-4V204H96a4,4,0,0,0,4-4V180h20a4,4,0,0,0,2.83-1.17l11.33-11.34A75.72,75.72,0,0,0,160,172h.1A76,76,0,0,0,213.74,42.26Zm14.22,56c-1.15,36.22-31.6,65.72-67.87,65.77H160a67.52,67.52,0,0,1-25.21-4.83,4,4,0,0,0-4.45.83l-12,12H96a4,4,0,0,0-4,4v20H72a4,4,0,0,0-4,4v20H40a4,4,0,0,1-4-4V187.31a4.06,4.06,0,0,1,1.17-2.83L96,125.66a4,4,0,0,0,.83-4.45A67.51,67.51,0,0,1,92,95.91C92,59.64,121.55,29.19,157.77,28A68,68,0,0,1,228,98.23ZM188,76a8,8,0,1,1-8-8A8,8,0,0,1,188,76Z"></path></svg>
                <input value={password} onChange={(e) => setPassword(e.target.value)}  type="password" placeholder="Digite sua senha"/>
              </label>
              <label >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000000" viewBox="0 0 256 256"><path d="M208,84H172V56a44,44,0,0,0-88,0V84H48A12,12,0,0,0,36,96V208a12,12,0,0,0,12,12H208a12,12,0,0,0,12-12V96A12,12,0,0,0,208,84ZM92,56a36,36,0,0,1,72,0V84H92ZM212,208a4,4,0,0,1-4,4H48a4,4,0,0,1-4-4V96a4,4,0,0,1,4-4H208a4,4,0,0,1,4,4Zm-84-92a24,24,0,0,0-4,47.66V184a4,4,0,0,0,8,0V163.66A24,24,0,0,0,128,116Zm0,40a16,16,0,1,1,16-16A16,16,0,0,1,128,156Z"></path></svg>
                <input value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)}  type="password" placeholder="Repita sua senha"/>
              </label>
              
              <button>Registrar</button>
            </form>
            <hr></hr>
            <p>Já possui uma conta? <button onClick={showLoginForm} type="button">Fazer login</button></p>
          </div>
        </div>
      </main>
    </>
  )
}