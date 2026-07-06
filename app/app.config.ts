export default defineAppConfig({
  ui: {
    colors: {
      primary: 'teal',
      neutral: 'neutral',
    },
    card: {
      variants: {
        variant: {
          solid: {
            root: 'bg-primary-500',
          },
        },
      },
    },
    pageCard: {
      slots: {
        container: 'overflow-x-auto',
      },
    },
  },
});
