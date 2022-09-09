export default {
  title: 'Indicator',
  name: 'indicator',
  type: 'document',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
      description: 'Must match the exact indicator name used in the dashboard. Sometimes simplified to an "indicator group" name, e.g. removing a parenthesised suffix.',
      required: true,
    },
    {
      title: 'Tooltip',
      name: 'tooltip',
      type: 'string',
      description: "Explanatory text you'd like behind an info icon wherever the indicator's prominent on a page",
    },
    {
      title: 'Detail',
      name: 'detail',
      type: 'text',
      description: 'A longer explanation of the indicator, for e.g. the indicator overview page',
    },
  ],
}
