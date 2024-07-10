import React, { useState, useEffect, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import styles from "../src/app/styles/homepage.module.css"
import env from "../env.js"
import Head from "next/head.js";

// IMAGES IMPORTS
import smartwatchPng from "../public/imgs/byte8-smartwatch8pro-black.webp";
import headsetPng from "../public/imgs/byte8-pulse8withmic.webp";
import bytePhone from "../public/imgs/byte8-bytephone8.webp";
import laptop from "../public/imgs/byte8-notepro8.webp";
import headsetSectionImg from "../public/imgs/byte8-bytesound8.webp"
import deliveryIcon from "../public/imgs/delivery-truck.png"
import cardDeliveryIcon from "../public/imgs/card-delivery.png"
import starCheckIcon from "../public/imgs/star-check.png"

// COMPONENTS IMPORTS
import Footer from  "../src/app/components/footer"
import TestimonialsSection from "../src/app/components/testimonials"
import NavBar from "../src/app/components/navbar"

interface ImagesProps {
  src: StaticImageData;
  alt: string;
  h1: string;
  p: string;
  id: string;
}

const images: ImagesProps[] = [
  {
    src: smartwatchPng,
    alt: "Smartwatch",
    h1: "Smartwatch8 Pro",
    p: "Monitoramento inteligente 24/7 no seu pulso.",
    id: "6671c8c317b69f0d5db398a7"
  },
  {
    src: headsetPng,
    alt: "Headset preto",
    h1: "Pulse8 Preto",
    p: "Alta perfomance. Máximo conforto.",
    id: "6671c8c317b69f0d5db398ae"
  },
  {
    src: bytePhone,
    alt: "Smartphone BytePhone8",
    h1: "BytePhone8 Plus",
    p: "Perfomance. Câmera incrível. Design elegante.",
    id: "6671c8c317b69f0d5db398a2"
  },
  {
    src: laptop,
    alt: "Headset",
    h1: "Notebook8",
    p: "Fino, leve, e peformático.",
    id: "6671c8c317b69f0d5db398aa"
  },
]

export default function HomePage() {

  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // PRODUCTS ANIMATION
  
  useEffect(() => {
    function handleScroll() {
      if (boxRef.current) {
        const boxTop = boxRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        const boxHeight = boxRef.current.clientHeight;
        const isBoxVisible = boxTop < windowHeight / 2 && boxTop + boxHeight > windowHeight / 2;

        if (isBoxVisible) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasAnimated]);


  return (
    <>

      <Head>
        <title>Byte8 | Transforme sua experiência tecnológica</title>
      </Head>

      {/* NAV BAR */}
      <NavBar />

      {/* HOME CONTENT */}


      {/* FIRST SECTION HOME */}
      <section className={styles.firstSectionHome}>
        <div className={styles.textHome}>
          <h1>
            <span>byte8:</span> Transformando o seu mundo digital.
          </h1>
          <p>Inovação e qualidade em cada byte.</p>
          {/* TODO: CHANGE TO <a> */}
          <a href={"/loja"} className={`${styles.btnLight} ${styles.btn}`}>Ver produtos <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#101010" viewBox="0 0 256 256"><path d="M218.83,130.83l-72,72a4,4,0,0,1-5.66-5.66L206.34,132H40a4,4,0,0,1,0-8H206.34L141.17,58.83a4,4,0,0,1,5.66-5.66l72,72A4,4,0,0,1,218.83,130.83Z"></path></svg></a>
        </div>
      </section>
      
      {/* PRODUCTS SECTION HOME */}
      <section className={styles.productsBoxHome} ref={boxRef}>
        {images.map((image) => (
          <div className={`${isVisible ? styles.visible : styles.invisible}`}>
            <picture>
              <Image 
              src={image.src}
              alt={image.alt}
              />
            </picture>
              <h1>{image.h1}</h1>
              <p>{image.p}</p>
              <a href={`${env.urlFront}/product/${image.id}`} className={`${styles.btnLight} ${styles.btn}`}>Comprar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#101010" viewBox="0 0 256 256"><path d="M218.83,130.83l-72,72a4,4,0,0,1-5.66-5.66L206.34,132H40a4,4,0,0,1,0-8H206.34L141.17,58.83a4,4,0,0,1,5.66-5.66l72,72A4,4,0,0,1,218.83,130.83Z"></path></svg></a>
          </div>
        ))}
      </section>
      
      {/* HEADSET SECTION */}
      <section className={styles.headsetSection}>
        <picture>
          <Image 
           src={headsetSectionImg}
           alt=""
           width={280}
           height={280}
          />
        </picture>
        <div>
          <h1>ByteSound8</h1>
          <p>Isolamento de ruído perfeito para você se concentrar no que realmente importa.</p>
          <a href={`${env.urlFront}/product/6671c8c317b69f0d5db398ac`} className={`${styles.btnLight} ${styles.btn}`}>Comprar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#101010" viewBox="0 0 256 256"><path d="M218.83,130.83l-72,72a4,4,0,0,1-5.66-5.66L206.34,132H40a4,4,0,0,1,0-8H206.34L141.17,58.83a4,4,0,0,1,5.66-5.66l72,72A4,4,0,0,1,218.83,130.83Z"></path></svg></a>
          </div>
        
      </section>

      {/* TESTIMONIALS SECTION */}

      <TestimonialsSection />

      
      {/* CALL CLIENT SECTION */}

      <section className={styles.callClient}>
        <div className={styles.callClientMain}>
          <h1>Transforme sua <span>Experiência Tecnológica</span> com Byte8!</h1>
          <div className={styles.callClientIcons}>
            <div className={styles.callClientIcon}>
              <Image src={deliveryIcon} alt="Entrega Rápida" width={24} height={24} />
              <div>
                <p>Entrega rápida</p>
                <p>Receba seus produtos rapidamente com nosso serviço de entrega expresso.</p>
              </div>
            </div>

            <div className={styles.callClientIcon}>
              <Image src={starCheckIcon} alt="Garantia de Qualidade" width={24} height={24} />
              <div>
                <p>Garantia de Qualidade</p>
                <p>Produtos de alta qualidade com garantia de satisfação.</p>
              </div>
            </div>

            <div className={styles.callClientIcon}>
              <Image src={cardDeliveryIcon} alt="Devolução Fácil" width={24} height={24} />
              <div>
                <p>Devolução Fácil</p>
                <p>Política de devolução sem complicações.</p>
              </div>
            </div>

          </div>
          <a href="/loja">Explore Agora <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#101010" viewBox="0 0 256 256"><path d="M218.83,130.83l-72,72a4,4,0,0,1-5.66-5.66L206.34,132H40a4,4,0,0,1,0-8H206.34L141.17,58.83a4,4,0,0,1,5.66-5.66l72,72A4,4,0,0,1,218.83,130.83Z"></path></svg></a>
        </div>
      </section>
      {/* FOOTER */}

      <Footer />

    </>
  )
}