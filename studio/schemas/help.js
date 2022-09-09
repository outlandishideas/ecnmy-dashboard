export default {
  title: 'Help',
  name: 'help',
  type: 'document',
  fields: [
    {
      title: 'Page',
      name: 'page',
      type: 'string',
      description: 'Short name of the page type on which to show this help. Must match the format in the codebase\'s "How" component.',
      required: true,
    },
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      description: "Optional larger title text",
      default: 'Help',
    },
    {
      title: 'Help',
      name: 'help',
      type: 'array',
      description: 'Items of help text to show in an "unordered" / un-numbered list – but in the order you define here!',
      of: [{ type: 'string' }],
      required: true,
    },
  ],
  preview: {
    select: {
      title: 'page',
    },
    prepare({ title }) {
      return {
        title: `${title} page(s)`,
      };
    }
  }
}
