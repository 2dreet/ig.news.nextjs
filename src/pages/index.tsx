import { GetStaticProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string,
    amount: number
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
    {/* aqui definimos o head desse componente */}
    <Head>
      {/* aqui colocamos qual vai ser o title desse componente */}
      <title> Home | ig.news </title>
    </Head>

    <main className={styles.contentContainer}>
      <section className={styles.hero}> 
        <span>👏 Hey, welcome</span>
        <h1>News about the <span>React</span> world.</h1>
        <p>
          Get access to all the publications <br />
          <span>for {product.amount} month</span>
        </p>

        <SubscribeButton priceId={product.priceId} />
      </section>

      <img src="/images/avatar.svg" alt="Girl coding" />
    </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // aqui faz a chamada ao stripe usando a SKD passando o id do produto
  const price = await stripe.prices.retrieve('price_1JiOW8G1uXqCJysSUtUveYUh', {
    // aqui fala que quer trazer todos os dados do produto
    expand: ['product']
  });

  // aqui monta o objeto para passar como props da pagina
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format((price.unit_amount / 100)),
  }

  // aqui retorna o props da pagina
  return {
    props: {
      product
    },
    // aqui define o tempo para gerar um novo html para a pagina em segundos
    revalidate: 60 * 60 * 24, // 24 horas
  }
}

/*
// aqui definimos o SSR props da pagina, vai sempre executar no servidor
// antes de reenderizar para o usuario
export const getServerSideProps: GetServerSideProps = async () => {
  // aqui faz a chamada ao stripe usando a SKD passando o id do produto
  const price = await stripe.prices.retrieve('price_1JiOW8G1uXqCJysSUtUveYUh', {
    // aqui fala que quer trazer todos os dados do produto
    expand: ['product']
  });

  // aqui monta o objeto para passar como props da pagina
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format((price.unit_amount / 100)),
  }

  // aqui retorna o props da pagina
  return {
    props: {
      product
    }
  }
}

*/