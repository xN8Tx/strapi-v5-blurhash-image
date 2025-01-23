import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.contentType('plugin::upload.file').attributes.blurHash = {
    type: 'string',
  };
};

export default register;
