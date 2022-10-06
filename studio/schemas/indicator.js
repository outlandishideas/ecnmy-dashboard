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
      title: 'Details',
      name: 'details',
      type: 'array',
      description: 'A longer explanation of the indicator, for e.g. the indicator overview page. This is a block field, so you can add multiple paragraphs, images, etc.',
      of: [
        {
          type: 'block'
        }
      ],
    },
    {
      title: 'Detail (deprecated)',
      name: 'detail',
      type: 'text',
      description: '(We should move content out of this field, and can delete it totally when all done.)',
    },
  ],
}
