export default {
  title: 'Indicator',
  name: 'indicator',
  type: 'document',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
      description: 'Must match the exact indicator name used in the dashboard',
      required: true,
    },
    {
      title: 'Tooltip',
      name: 'tooltip',
      type: 'string',
      description: "Explanatory text you'd like behind an info icon wherever the indicator's prominent on a page",
    },
  ],
}
