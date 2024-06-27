import React, { useEffect, useState } from "react";
import NavBar from "../src/app/components/navbar"
import Footer from "../src/app/components/footer"
import styles from "../src/app/styles/store.module.css"
import env from "../env.js"
import axios from "axios";
import { useRouter } from "next/router.js";
import Head from "next/head.js";

interface Product {
  _id: string;
  prodName: string;
  prodPrice: Number;
  prodCategory: string;
  prodImg: string;
}

const Loja = () => {

  const router = useRouter();
  const { filter } = router.query;

  const api = axios.create({
    baseURL: env.urlServer
  })

  const [productsArray, setProductsArray] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const filterProducts = (category:string): void => {

    let produtosFiltrados = productsArray.filter(produto => {
      const categoryMatch = category.length > 0 && category !== "All" ? produto.prodCategory === category : true;
      return categoryMatch;
    });
    setFilteredProducts(produtosFiltrados);
  };

  useEffect(() => {
    switch (filter) {
      case "smartphones":
        setSelectedCategory("Smartphone");
        filterProducts("Smartphone");
        break;
      case "smartwatches":
        setSelectedCategory("Smartwatch");
        filterProducts("Smartwatch");
        break;
      case "notebooks":
        setSelectedCategory("Notebook");
        filterProducts("Notebook");
        break;
      case "headsets":
        setSelectedCategory("Headset");
        filterProducts("Headset");
        break;
      default:
        setSelectedCategory("");
        filterProducts("");
        break;
    }
  }, [filter, productsArray]);
  

  useEffect(() => {
    const getProducts = async (): Promise<void> => {
      try {
        const response = await api.get('/api/products', {
          headers: {
            Accept: 'application/json;charset=utf-8'
          }
        })
        if (response) {
          const shuffledProducts = response.data.sort(() => Math.random() - 0.5);
          setProductsArray(shuffledProducts);
          setFilteredProducts(shuffledProducts);
        }
      } catch (err) {
        window.alert(err)
      }
    }
    getProducts();
  }, [])

  useEffect(() => {
    filterProducts(selectedCategory)
  }, [selectedCategory, filter]);
  
  return(
    <>
      <Head>
        <title>Byte8 | Loja</title>
      </Head>

      <NavBar />

      {/* MAIN PRODUCTS */}
      <main className={styles.mainStore}>
        <div className={styles.routerStore}>
            <p className={styles.routerStoreParagraph}>
              <a href="/">Home</a> <span>{'>'} </span> <a href="/loja">Loja</a>
            </p>
        </div>
        <div className={styles.mainContent}>

            {filteredProducts.length === 0 ?
            (<div className={styles.refreshingProducts}>
              <p>Carregando produtos...</p>
              </div>) :
            <div className={styles.productsContainer}>
              {filteredProducts.map((product) => (
                <div className={styles.productCart}>
                  <img src={product.prodImg} alt={product.prodName} />
                  <p className={styles.productName}>{product.prodName}</p>
                  <p className={styles.productPrice}>R$ {product.prodPrice.toString()},00</p>                    <button onClick={() => window.location.href = `${env.urlFront}/product/${product._id}`}>Comprar</button>
                </div>
              ))}
            </div> }
        </div>
        
      </main>
      <Footer />
    </>
  )
}

export default Loja;