import { encode, decode } from 'blurhash';
import { Buffer } from 'buffer';
import { PNG } from 'pngjs';
import axios from 'axios';
import sharp from 'sharp';

import { PLUGIN_ID } from '../constants';

const WIDTH = 32;
const HEIGHT = 32;

const loadImage = async (url: string) => {
  const baseURL = `http://${process.env.HOST}:${process.env.PORT}`;

  const response = await axios.get(`${baseURL}${url}`, {
    responseType: 'arraybuffer',
  });

  const buffer = Buffer.from(response.data, 'binary');
  return buffer;
};

const encodeImage = async (buffer: Buffer): Promise<string> => {
  try {
    const image = sharp(buffer).png();
    const { width, height } = await image.metadata();

    let w = WIDTH;
    let h = HEIGHT;

    if (width > height) {
      w = Math.round((w * width) / height);
    } else {
      h = Math.round((h * height) / width);
    }

    const { data, info } = await image
      .raw()
      .ensureAlpha()
      .resize(w, h, { fit: 'fill' })
      .toBuffer({ resolveWithObject: true });

    let kernw = 3;
    let kernh = 2;

    if (info.width > info.height) {
      kernw = Math.round((kernw * info.width) / info.height);
    } else {
      kernh = Math.round((kernh * info.height) / info.width);
    }

    const buf = new Uint8ClampedArray(data);

    return encode(buf, info.width, info.height, kernw, kernh);
  } catch (error) {
    strapi.log.error(`Plugin ${PLUGIN_ID}: Error generating blurHash`, error);
    return null;
  }
};

const generateBlurHash = async (url: string) => {
  try {
    const image = await loadImage(url);
    const hash = await encodeImage(image);

    return hash;
  } catch (error) {
    strapi.log.error(`Plugin ${PLUGIN_ID}: Error generating blurHash`, error);
    return null;
  }
};

const generateBlurHashDataUrl = (blurHash: string) => {
  if (!blurHash) {
    return null;
  }

  const pixels = decode(blurHash, WIDTH, HEIGHT); // Uint8ClampedArray
  const png = new PNG({ width: WIDTH, height: HEIGHT });

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const idx = (y * WIDTH + x) * 4;
      png.data[idx] = pixels[idx]; // Red
      png.data[idx + 1] = pixels[idx + 1]; // Green
      png.data[idx + 2] = pixels[idx + 2]; // Blue
      png.data[idx + 3] = 255; // Alpha
    }
  }

  const buffer = PNG.sync.write(png);
  return `data:image/png;base64,${buffer.toString('base64')}`;
};

const service = () => ({
  async updateBlurHash() {
    strapi.log.info(
      'Plugin "strapi-v5-blurhash-image": Start update blurHash on images without blurHash'
    );

    const images = await strapi.documents('plugin::upload.file').findMany({
      filters: {
        mime: { $startsWith: 'image' },
        blurHash: { $null: true },
      },
    });

    const blurHashUpdate = images.map(async (image) => {
      const blurHash = await generateBlurHash(image.url);
      const blurHashDataUrl = generateBlurHashDataUrl(blurHash);

      await strapi.documents('plugin::upload.file').update({
        documentId: image.documentId,
        data: {
          // @ts-ignore
          blurHash: blurHashDataUrl,
        },
      });
    });

    await Promise.all(blurHashUpdate);
    strapi.log.info(
      'Plugin "strapi-v5-blurhash-image": Successfully updated blurHash on images without blurHash'
    );
  },
  async registerBlurHash(event: any) {
    const mime = event?.params?.data.mime as string;
    const url = event?.params?.data.url as string;

    if (event && mime.startsWith('image')) {
      try {
        const blurHash = await generateBlurHash(url);
        const blurHashDataUrl = generateBlurHashDataUrl(blurHash);
        event.params.data.blurHash = blurHashDataUrl;
      } catch (error) {
        event.params.data.blurHash = null;
      }
    }
  },
});

export default service;
