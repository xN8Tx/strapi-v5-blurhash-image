import type { Core } from '@strapi/strapi';

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.db.lifecycles.subscribe({
    models: ['plugin::upload.file'],
    beforeCreate: async (event) =>
      await strapi.plugin('strapi-v5-blurhash-image').service('service').registerBlurHash(event),
  });
};

export default bootstrap;
