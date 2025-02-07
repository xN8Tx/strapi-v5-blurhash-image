import type { Core } from '@strapi/strapi';
import middlewares from './middlewares';
import { PLUGIN_ID } from './constants';

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  // Config
  const isWebpEnabled = strapi.plugin(PLUGIN_ID).config('webp.enabled');
  const isBlurHashEnabled = strapi.plugin(PLUGIN_ID).config('blurHash.enabled');

  // Add webp converter middleware
  if (isWebpEnabled) {
    strapi.server.use(middlewares.webpConverter({ strapi }));
  }

  // Add subscriptions to blurHashGenerate
  if (isBlurHashEnabled) {
    const update = async (event: any) => {
      return await strapi.plugin(PLUGIN_ID).service('blurHashService').registerBlurHash(event);
    };

    strapi.db.lifecycles.subscribe({
      models: ['plugin::upload.file'],
      beforeCreate: async (event) => update(event),
    });
  }
};

export default bootstrap;
