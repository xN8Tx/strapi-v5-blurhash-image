import { PLUGIN_ID } from '../constants';

const defaultConfig = {
  webp: {
    enabled: true,
    convertMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'],
    sharpConfig: {},
    webpConfig: {
      lossless: true,
    },
  },
  blurHash: {
    enabled: true,
  },
};

export default {
  default: defaultConfig,
  validator(config: typeof defaultConfig) {
    if (typeof config.webp !== 'object') {
      throw new Error(`Plugin ${PLUGIN_ID}:The config.webp must be an object`);
    }

    if (typeof config.blurHash !== 'object') {
      throw new Error(`Plugin ${PLUGIN_ID}:The config.blurHash must be an object`);
    }

    if (typeof config.webp.enabled !== 'boolean') {
      throw new Error(`Plugin ${PLUGIN_ID}:The config.webp.enabled must be a boolean`);
    }

    if (typeof config.blurHash.enabled !== 'boolean') {
      throw new Error(`Plugin ${PLUGIN_ID}:The config.blurHash.enabled must be a boolean`);
    }

    if (!Array.isArray(config.webp.convertMimeTypes)) {
      throw new Error(`Plugin ${PLUGIN_ID}:The config.webp.convertMimeTypes must be an array`);
    }

    if (typeof config.webp.sharpConfig !== 'object') {
      throw new Error(`Plugin ${PLUGIN_ID}:The config.webp.sharpConfig must be an object`);
    }

    if (typeof config.webp.webpConfig !== 'object') {
      throw new Error(`Plugin ${PLUGIN_ID}:The config.webp.webpConfig must be an object`);
    }
  },
};
