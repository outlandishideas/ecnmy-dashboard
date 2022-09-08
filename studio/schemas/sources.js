export default {
  title: 'Data Sources',
  name: 'sources',
  type: 'document',
  fields: [
    {
      title: 'Data Sources',
      name: 'sources',
      type: 'array',
      description: 'One big array of sources. This is structured to live in 1 big object so you can drag them into your preferred order.',
      required: true,
      of: [
        {
          type: 'object',
          title: 'Data Source',
          name: 'source',
          fields: [
            {
              title: 'Name',
              name: 'name',
              type: 'string',
              description: 'The organisation providing the data',
              required: true,
            },
            {
              title: 'Home URL',
              name: 'url',
              type: 'url',
              required: true,
            },
            {
              title: 'Logo',
              name: 'logo',
              type: 'image',
              description: 'A logo for the organisation',
              required: true,
            },
          ]
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'sources',
    },
    prepare({ title }) {
      return {
        title: 'Data Sources (should just be one of these!)',
      };
    },
  }
}
