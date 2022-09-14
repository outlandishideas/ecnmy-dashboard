const sanityClient = require('@sanity/client')

// Note that we publish content in Studio and should need no token to access it. And to keep
// things secure, simply, `token` must NOT be set.
// https://www.sanity.io/help/js-client-browser-token
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '-',
  useCdn:
    typeof document !== 'undefined' && process.env.NODE_ENV === 'production',
  // useCdn == true gives fast, cheap responses using a globally distributed cache.
  // When in production the Sanity API is only queried on build-time, and on-demand when responding to webhooks.
  // Thus the data need to be fresh and API response time is less important.
  // When in development/working locally, it's more important to keep costs down as hot reloading can incurr a lot of API calls
  // And every page load calls getStaticProps.
  // To get the lowest latency, lowest cost, and latest data, use the Instant Preview mode
  apiVersion: '2022-03-13',
  // see https://www.sanity.io/docs/api-versioning for how versioning works
}

const client = sanityClient(config);
module.exports = client;
