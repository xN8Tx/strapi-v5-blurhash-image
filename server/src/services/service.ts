import { encode } from 'blurhash';
import axios from 'axios';
import sharp from 'sharp';

const loadImage = async (url: string) => {
  const baseURL = `http://${process.env.HOST}:${process.env.PORT}`;

  const response = await axios.get(`${baseURL}${url}`, {
    responseType: 'arraybuffer',
  });

  const buffer = Buffer.from(response.data, 'binary');
  return buffer;
};

const encodeImage = async (buffer: Buffer): Promise<string> => {
  const image = sharp(buffer);
  const { width, height } = await image.metadata();

  let w = 32;
  let h = 32;

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
};

const generateBlurHash = async (url: string) => {
  try {
    const image = await loadImage(url);
    const hash = await encodeImage(image);

    return hash;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const service = () => ({
  registerBlurHash: async (event: any) => {
    const mime = event?.params?.data.mime as string;
    const url = event?.params?.data.url as string;

    if (event && mime.startsWith('image')) {
      const blurHash = await generateBlurHash(url);
      event.params.data.blurHash = blurHash;
    }
  },
});

export default service;
