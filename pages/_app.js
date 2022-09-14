import Layout from '../components/Layout';
import SanityPreloads from '../components/SanityPreloads';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <SanityPreloads>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SanityPreloads>
  );
}

export default MyApp;
