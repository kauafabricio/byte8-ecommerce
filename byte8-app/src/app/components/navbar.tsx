import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import styles from "../styles/navbar.module.css"
import logo from "../../../public/imgs/logo.png"
import env from "../../../env";
import { useAuth } from "../../../context/AuthContext";
import Cookies from "js-cookie";
import Link from "next/link";

const NavBar= () => {

  const api = axios.create({
    baseURL: env.urlServer
  })

  const { user, isLogged, setIsLogged, userId, userBag, fetchBagData } = useAuth();


  const [flyoutClass, setFlyoutClass] = useState( `${styles.flyoutBox} ${styles.flyoutOff} ${styles.Off}`);
  const [flyoutContent, setFlyoutContent] = useState('')
  const [flyoutOn, setFlyoutOn] = useState(false)

  const [menu, setMenu] = useState<boolean>(false)
  
  const showBag = () => {

    fetchBagData();

    if (flyoutClass === `${styles.flyoutBox} ${styles.flyoutOff} ${styles.Off}`) {
      setFlyoutClass(`${styles.flyoutBox} ${styles.On}`)
    } else if (flyoutClass === `${styles.flyoutBox} ${styles.flyoutOff}`) {
      setFlyoutClass(`${styles.flyoutBox} ${styles.On}`)
    } else {
      setFlyoutClass(`${styles.flyoutBox} ${styles.flyoutOff}`)
    }
    flyoutOn ? setFlyoutOn (false) : setFlyoutOn(true)
    setFlyoutContent('bag')
  }

  const showUser = () => {
    
    if (flyoutClass === `${styles.flyoutBox} ${styles.flyoutOff} ${styles.Off}`) {
      setFlyoutClass(`${styles.flyoutBox} ${styles.On}`)
    } else if (flyoutClass === `${styles.flyoutBox} ${styles.flyoutOff}`) {
      setFlyoutClass(`${styles.flyoutBox} ${styles.On}`)
    } else {
      setFlyoutClass(`${styles.flyoutBox} ${styles.flyoutOff}`)
    }
    flyoutOn ? setFlyoutOn (false) : setFlyoutOn(true)
    setFlyoutContent('user')
  }

  const showMenu = () => {
    if (menu) {
      setMenu(false)
    } else {
      setMenu(true)
    }
  }

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
        fetchBagData()
      }
    } catch (err: any) {
      window.alert(err.response?.data?.error || 'Erro ao deletar produto');
    }
  }


  const logout = () => {
    Cookies.remove('token');
    setIsLogged(false);
    window.location.href = `${env.urlFront}/`
  }

  return (
    <>
    <nav className={styles.navBar}>
      <div>
        <a href="/">
        <Image
        src={logo}
        alt="Logo"
        width={28}
        height={28}
        /></a>
      </div>
      <div className={styles.navOption}>
        <ul>
          <li>
            <a href="/loja?filter=smartphones">Smartphones</a>  </li>
          <li>
            <a href="/loja?filter=smartwatches">Smartwatches</a>  </li>
          <li>
            <a href="/loja?filter=notebooks">Notebooks</a>  </li>
          <li>
            <a href="/loja?filter=headsets">Headsets</a>  </li>
        </ul>
      </div>

      <div className={styles.navIcons}>
          <button onClick={showBag}>
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="#ddd" viewBox="0 0 256 256"><path d="M216,68H172V64a44,44,0,0,0-88,0v4H40A12,12,0,0,0,28,80V200a12,12,0,0,0,12,12H216a12,12,0,0,0,12-12V80A12,12,0,0,0,216,68ZM92,64a36,36,0,0,1,72,0v4H92ZM220,200a4,4,0,0,1-4,4H40a4,4,0,0,1-4-4V80a4,4,0,0,1,4-4H84V96a4,4,0,0,0,8,0V76h72V96a4,4,0,0,0,8,0V76h44a4,4,0,0,1,4,4Z"></path></svg>
          </button>
          <button onClick={showUser}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ddd" viewBox="0 0 256 256"><path d="M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28ZM68.87,198.42a68,68,0,0,1,118.26,0,91.8,91.8,0,0,1-118.26,0Zm124.3-5.55a75.61,75.61,0,0,0-44.51-34,44,44,0,1,0-41.32,0,75.61,75.61,0,0,0-44.51,34,92,92,0,1,1,130.34,0ZM128,156a36,36,0,1,1,36-36A36,36,0,0,1,128,156Z"></path></svg>
          </button>
          <button className={styles.menuIcon} onClick={showMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff" viewBox="0 0 256 256"><path d="M220,128a4,4,0,0,1-4,4H40a4,4,0,0,1,0-8H216A4,4,0,0,1,220,128ZM40,68H216a4,4,0,0,0,0-8H40a4,4,0,0,0,0,8ZM216,188H40a4,4,0,0,0,0,8H216a4,4,0,0,0,0-8Z"></path></svg>
          </button>

        </div> 

    </nav>

    <div className={styles.spaceNav}></div>
    { menu && (
      <div className={styles.menu}>
        <div className={styles.menuOptions}>
          <ul>
            <li>
              <a href="/">Home</a>  </li>
            <li>
              <a href="/loja?filter=smartphones">Smartphones</a>  </li>
            <li>
              <a href="/loja?filter=smartwatches">Smartwatches</a>  </li>
            <li>
              <a href="/loja?filter=notebooks">Notebooks</a>  </li>
            <li>
              <a href="/loja?filter=headsets">Headsets</a>  </li>
          </ul>
        </div>
      </div>
    )}
    <div className={flyoutClass}>
      {flyoutOn && flyoutContent === 'bag' && !isLogged &&
        <div className={styles.bagNoLogged}>
          <h1>Sua sacola está vazia.</h1>
          <p><a href="/login">Faça login</a> para verificar se salvou algo</p>
        </div>
      }
      {flyoutOn && flyoutContent === 'user' && !isLogged &&
        <div className={styles.userFlyout}>
          
          <h1>Meu perfil</h1>
          <hr></hr>
          <div className={styles.userOptionsFlyout}>
            <Link href={`${env.urlFront}/orders`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff" viewBox="0 0 256 256"><path d="M223.05,70.5a4,4,0,0,0-6.42-1.44l-41.82,38.6L153,103l-4.68-21.79,38.6-41.82a4,4,0,0,0-1.44-6.43A68,68,0,0,0,98.94,126L36.4,180l-.21.2a28,28,0,0,0,39.6,39.6l.2-.21,54-62.54A68,68,0,0,0,228,96,67.51,67.51,0,0,0,223.05,70.5ZM160,156a60,60,0,0,1-29-7.47,4,4,0,0,0-5,.89L70,214.25A20,20,0,0,1,41.75,186l64.82-56a4,4,0,0,0,.89-5,60,60,0,0,1,69.46-86.59L141.05,77.29a4,4,0,0,0-1,3.55l5.66,26.35a4,4,0,0,0,3.07,3.07l26.35,5.66a4,4,0,0,0,3.55-1l38.87-35.87A60.05,60.05,0,0,1,160,156Z"></path></svg> Configurações</Link>
              <Link href={`${env.urlFront}/orders`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff" viewBox="0 0 256 256"><path d="M216,44H40A12,12,0,0,0,28,56V200a12,12,0,0,0,12,12H216a12,12,0,0,0,12-12V56A12,12,0,0,0,216,44Zm4,156a4,4,0,0,1-4,4H40a4,4,0,0,1-4-4V56a4,4,0,0,1,4-4H216a4,4,0,0,1,4,4ZM172,88a44,44,0,0,1-88,0,4,4,0,0,1,8,0,36,36,0,0,0,72,0,4,4,0,0,1,8,0Z"></path></svg>
              Meus pedidos
              </Link>
              <Link href={`${env.urlFront}/login`}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff" viewBox="0 0 256 256"><path d="M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28ZM68.87,198.42a68,68,0,0,1,118.26,0,91.8,91.8,0,0,1-118.26,0Zm124.3-5.55a75.61,75.61,0,0,0-44.51-34,44,44,0,1,0-41.32,0,75.61,75.61,0,0,0-44.51,34,92,92,0,1,1,130.34,0ZM128,156a36,36,0,1,1,36-36A36,36,0,0,1,128,156Z"></path></svg> Fazer login</Link>
          </div>
          
        </div>
      }

      {flyoutOn && flyoutContent === 'user' && isLogged &&
        <div className={styles.userFlyout}>
          <h1>Olá, { user ? user.split(' ')[0] : null}</h1>
          <hr></hr>
          <div className={styles.userOptionsFlyout}>
            <Link href={`${env.urlFront}/orders`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff" viewBox="0 0 256 256"><path d="M223.05,70.5a4,4,0,0,0-6.42-1.44l-41.82,38.6L153,103l-4.68-21.79,38.6-41.82a4,4,0,0,0-1.44-6.43A68,68,0,0,0,98.94,126L36.4,180l-.21.2a28,28,0,0,0,39.6,39.6l.2-.21,54-62.54A68,68,0,0,0,228,96,67.51,67.51,0,0,0,223.05,70.5ZM160,156a60,60,0,0,1-29-7.47,4,4,0,0,0-5,.89L70,214.25A20,20,0,0,1,41.75,186l64.82-56a4,4,0,0,0,.89-5,60,60,0,0,1,69.46-86.59L141.05,77.29a4,4,0,0,0-1,3.55l5.66,26.35a4,4,0,0,0,3.07,3.07l26.35,5.66a4,4,0,0,0,3.55-1l38.87-35.87A60.05,60.05,0,0,1,160,156Z"></path></svg> Configurações</Link>

            <Link href={`${env.urlFront}/orders`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff" viewBox="0 0 256 256"><path d="M216,44H40A12,12,0,0,0,28,56V200a12,12,0,0,0,12,12H216a12,12,0,0,0,12-12V56A12,12,0,0,0,216,44Zm4,156a4,4,0,0,1-4,4H40a4,4,0,0,1-4-4V56a4,4,0,0,1,4-4H216a4,4,0,0,1,4,4ZM172,88a44,44,0,0,1-88,0,4,4,0,0,1,8,0,36,36,0,0,0,72,0,4,4,0,0,1,8,0Z"></path></svg>
              Meus pedidos
              </Link>

            <div>
              <button onClick={logout}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff" viewBox="0 0 256 256"><path d="M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28ZM68.87,198.42a68,68,0,0,1,118.26,0,91.8,91.8,0,0,1-118.26,0Zm124.3-5.55a75.61,75.61,0,0,0-44.51-34,44,44,0,1,0-41.32,0,75.61,75.61,0,0,0-44.51,34,92,92,0,1,1,130.34,0ZM128,156a36,36,0,1,1,36-36A36,36,0,0,1,128,156Z"></path></svg> Sair</button>
              </div>
          </div>
        </div>
      }
      
      {flyoutOn && flyoutContent === 'bag' && userBag.length > 0 && isLogged &&
        <div className={styles.bagContainer}>
          <h1>Sacola de desejos</h1>
          <div className={styles.bag}>
            {userBag.map((product) => (
              <div className={styles.productInBag}>
                <div className={styles.productInfo}>
                  <img src={product.productImg} alt={product.productName} />
                  <div>
                    <p>{product.productName}</p>
                    <p>R$ {product.productPrice},00</p>
                  </div>
                </div>
                <button onClick={() => deleteProductOnBag(product.productName)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff" viewBox="0 0 256 256"><path d="M216,52H172V40a20,20,0,0,0-20-20H104A20,20,0,0,0,84,40V52H40a4,4,0,0,0,0,8H52V208a12,12,0,0,0,12,12H192a12,12,0,0,0,12-12V60h12a4,4,0,0,0,0-8ZM92,40a12,12,0,0,1,12-12h48a12,12,0,0,1,12,12V52H92ZM196,208a4,4,0,0,1-4,4H64a4,4,0,0,1-4-4V60H196ZM108,104v64a4,4,0,0,1-8,0V104a4,4,0,0,1,8,0Zm48,0v64a4,4,0,0,1-8,0V104a4,4,0,0,1,8,0Z"></path></svg>
               </button>
              </div>
            ))}
          </div>
        <Link href={`${env.urlFront}/checkout/${userId}`}>Finalizar compra <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.1,92.1,0,0,1,128,220Zm42.83-94.83a4,4,0,0,1,0,5.66l-32,32a4,4,0,0,1-5.66-5.66L158.34,132H88a4,4,0,0,1,0-8h70.34L133.17,98.83a4,4,0,0,1,5.66-5.66Z"></path></svg></Link>
        </div>
      }

      {flyoutOn && flyoutContent === 'bag' && isLogged && userBag.length === 0 &&
        <div className={styles.bagNoLogged}>
        <h1>Sua sacola está vazia.</h1>
        <p>Você pode adicionar produtos na sacola para lembrar de comprar depois.</p>
        </div>
      }
    </div>
    </>
  )
}

export default NavBar;