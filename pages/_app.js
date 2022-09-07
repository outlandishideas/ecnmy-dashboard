import Layout from '../components/Layout';
import SanityPreloads from '../components/SanityPreloads';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <SanityPreloads>
        <Component {...pageProps} />
      </SanityPreloads>
    </Layout>
  );
}

export default MyApp;
