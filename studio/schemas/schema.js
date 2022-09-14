// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

import help from './help'
import indicator from './indicator'
import sources from './sources'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  name: 'dashboard',
  types: schemaTypes.concat([
    help,
    indicator,
    sources,
  ]),
})
