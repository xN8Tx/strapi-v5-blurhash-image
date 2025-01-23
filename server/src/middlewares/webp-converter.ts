import type { Context } from 'koa';
import type { Core } from '@strapi/strapi';
import type { Files, File } from 'formidable';

import { parse, join, dirname } from 'path';
import { unlink } from 'fs/promises';
import sharp from 'sharp';

import { PLUGIN_ID } from '../constants';

export default ({ strapi }: { strapi: Core.Strapi }) => {
  const convertMimeTypes = strapi.plugin(PLUGIN_ID).config('webp.convertMimeTypes') as string[];
  const webpConfig = strapi.plugin(PLUGIN_ID).config('webp.webpConfig') as any;
  const sharpConfig = strapi.plugin(PLUGIN_ID).config('webp.sharpConfig') as any;

  const generateWebp = async (file: File, ctx: Context) => {
    const initialMimeType = file.mimetype;
    let initialFilePath = file.filepath;
    const initialOriginalFileName = file.originalFilename;

    if (convertMimeTypes.includes(initialMimeType)) {
      const fileName = `${parse(initialOriginalFileName).name}.webp`;
      const filePath = join(dirname(initialFilePath), fileName);
      const fileInfo = { ...JSON.parse(ctx.request.body.fileInfo), name: fileName };

      // Add animation true if initial file is gig
      if (initialMimeType === 'image/gif') {
        sharpConfig['animated'] = true;
      }

      try {
        const webp = await sharp(initialFilePath, sharpConfig).webp(webpConfig).toFile(filePath);
        await unlink(initialFilePath);

        file.size = webp.size;
        file.filepath = filePath;
        file.originalFilename = fileName;
        file.mimetype = 'image/webp';

        ctx.request.body.fileInfo = JSON.stringify(fileInfo);
      } catch (error) {
        strapi.log.error(`Error converting ${file.originalFilename} to webp:`, error);
      }
    }
  };

  return async (ctx: Context, next) => {
    if (ctx.is('multipart')) {
      const files = ctx.request.files as Files;

      for (const key in files) {
        const fileOrFiles = files[key];

        if (Array.isArray(fileOrFiles)) {
          const files = fileOrFiles as File[];

          const webpFilesConverting = files.map(async (file) => await generateWebp(file, ctx));
          await Promise.all(webpFilesConverting);
        } else {
          const file = fileOrFiles as File;
          await generateWebp(file, ctx);
        }
      }
    }
    await next();
  };
};
