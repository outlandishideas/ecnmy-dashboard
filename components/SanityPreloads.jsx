// // Wraps all components to provide a small number of CMS strings we're likely to use multiple times throughout
// // an app-session, in advance and just once.
// // Loosely inspired by https://dev.to/alexmercedcoder/simple-setup-for-application-wide-state-in-react-5e7g
// // but without any update-as-we-go fn and by
// // https://stackoverflow.com/a/58198369/2803757
import { createContext, useState, useContext, useEffect } from 'react'

import sanityClient from '../utils/sanityClient'

const initialState = {
  dataSources: [],
  help: [],
  indicators: [],
};

const SanityPreloadsContext = createContext(null)

export default function SanityPreloadsState(props) {
  const [sanityPreloadsState, setSanityPreloadsState] = useState(initialState)

  useEffect(() => {
    const getDataSources = async () => {
      const query = '*[_type == "sources"] {sources}';
      const dataSources = (await sanityClient.fetch(query))[0]; // First/only item has sources array.
      setSanityPreloadsState({...sanityPreloadsState, dataSources})
    }

    const getHelp = async () => {
      const query = '*[_type == "help"] {page, title, help}';
      const help = await sanityClient.fetch(query);
      setSanityPreloadsState({...sanityPreloadsState, help})
    }

    const getIndicators = async () => {
      const query = '*[_type == "indicator"] {name, tooltip}';
      const indicators = await sanityClient.fetch(query);
      setSanityPreloadsState({...sanityPreloadsState, indicators})
    }

    getDataSources();
    getHelp();
    getIndicators();
  }, [])

  return (
    <SanityPreloadsContext.Provider value={[sanityPreloadsState]}>
      {props.children}
    </SanityPreloadsContext.Provider>
  )
}

export const useSanityPreloads = () => useContext(SanityPreloadsContext)
