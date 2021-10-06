import Document, { Html, Head, Main, NextScript} from 'next/document';

export default class MyDocument extends Document {
  
  render() {
    return (
      <Html lang="en">
          <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet" />
          </Head>
          <body>
            {/* aqui vai renderizar o app */}
            <Main />
            {/* É onde o next coloca todo os arquivos javascript que o app precisa para funcionar */}
            <NextScript />
          </body>
      </Html>
    )
  }
}