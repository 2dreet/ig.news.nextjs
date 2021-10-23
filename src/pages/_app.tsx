import { AppProps } from 'next/app';
// aqui utilizamos o provider do next-auth para compartilar se o usuario
// esta logado ou nao
import { Provider as NextAuthProvider } from 'next-auth/client';
import {Header} from '../components/Header'

// aqui importamos o style global
import '../styles/global.scss';

function MyApp({ Component, pageProps } : AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  )
}

export default MyApp
