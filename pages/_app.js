import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>LOCALAID - Conectando Comunidades</title>
        <meta name="description" content="Plataforma para conectar oferentes y solicitantes de servicios locales" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <Component {...pageProps} />
      </div>
    </>
  )
}

