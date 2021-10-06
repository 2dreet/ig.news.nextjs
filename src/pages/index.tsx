import Head from 'next/head';

export default function Home() {
  return (
    <>
    {/* aqui definimos o head desse componente */}
    <Head>
      {/* aqui colocamos qual vai ser o title desse componente */}
      <title> Index | ig.news </title>
    </Head>

    <div>
      <h1> Hello World</h1>
    </div>
    </>
  )
}
