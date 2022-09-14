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
      return sanityClient.fetch(query);
    }

    const getHelp = async () => {
      const query = '*[_type == "help"] {page, title, help}';
      return sanityClient.fetch(query);
    }

    const getIndicators = async () => {
      const query = '*[_type == "indicator"] {name, tooltip}';
      return sanityClient.fetch(query);
    }

    Promise.all([
      getDataSources(),
      getHelp(),
      getIndicators(),
    ]).then(([dataSourcesQResult, help, indicators]) => {
      const dataSources = dataSourcesQResult[0].sources; // First + only item has the ordered sources array.

      setSanityPreloadsState({
        ...sanityPreloadsState,
        dataSources,
        help,
        indicators,
      })
    })
  }, [setSanityPreloadsState])

  return (
    <SanityPreloadsContext.Provider value={[sanityPreloadsState]}>
      {props.children}
    </SanityPreloadsContext.Provider>
  )
}

export const useSanityPreloads = () => useContext(SanityPreloadsContext)
