import styles from '../styles/testimonials.module.css';
import React from 'react';
import Image from 'next/image';

// IMAGES IMPORTS

import abstractForm from "../../../public/imgs/abstract-form-1.webp"
import abstractForm2 from "../../../public/imgs/abstract-form-2.webp"
import ana from "../../../public/imgs/ana-mazarotti.png"
import livia from "../../../public/imgs/livia.png"
import roberto from "../../../public/imgs/roberto.png"
import mariana from "../../../public/imgs/mariana.png"
import julia from "../../../public/imgs/julia.png"

const testimonials = [
  {
    name: 'Ana Mazarotti',
    location: 'São Paulo, SP',
    img: ana,
    feedback: 'Comprei um headset no Byte8 e estou extremamente satisfeita com a qualidade e o atendimento! Recomendo a todos.',
  },
  {
    name: 'Roberto',
    location: 'Rio de Janeiro, RJ',
    img: roberto,
    feedback: 'O smartwatch que comprei superou minhas expectativas. Ótima experiência de compra e entrega rápida.',
  },
  {
    name: 'Lívia',
    location: 'Belo Horizonte, MG',
    img: livia,
    feedback: 'Encontrei os melhores preços no Byte8. O suporte ao cliente foi incrível e o produto chegou muito bem embalado.',
  },
  {
    name: 'Mariana',
    location: 'Recife, PE',
    img: mariana,
    feedback: 'A variedade de produtos é excelente e a navegação no site é muito intuitiva. Meu pedido chegou dentro do prazo.',
  },
  {
    name: 'Júlia',
    location: 'Porto Alegre, RS',
    img: julia,
    feedback: 'Adorei a experiência de compra no Byte8! A qualidade dos produtos é excepcional e o site é muito fácil de usar.',
  },
];

const TestimonialsSection = () => {
  return (
    <section className={styles.testimonialsSection}>
      <Image className={styles.abstractForm} src={abstractForm} alt={"Abstract form"} />
      <Image className={styles.abstractForm2} src={abstractForm2} alt={"Abstract form"} /> 
      <p className={styles.headingP}>testemunhos</p>
      <h1 className={styles.headingH1}>O que nossos clientes dizem</h1>
      <div className={styles.testimonialsContainer}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className={styles.testimonialCard}>
            <Image src={testimonial.img} alt={testimonial.name} width={87} height={87}/>
            <p className={styles.feedback}>"{testimonial.feedback}"</p>
            <p className={styles.name}>{testimonial.name}, {testimonial.location}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
