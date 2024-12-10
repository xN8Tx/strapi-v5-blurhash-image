import { encode, decode } from 'blurhash';
import { Buffer } from 'buffer';
import { PNG } from 'pngjs';
import axios from 'axios';
import sharp from 'sharp';

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
  const image = sharp(buffer);
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

const generateBlurHashDataUrl = async (blurHash: string) => {
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
  registerBlurHash: async (event: any) => {
    const mime = event?.params?.data.mime as string;
    const url = event?.params?.data.url as string;

    if (event && mime.startsWith('image')) {
      const blurHash = await generateBlurHash(url);
      const blurHashDataUrl = await generateBlurHashDataUrl(blurHash);
      event.params.data.blurHash = {
        code: blurHash,
        url: blurHashDataUrl,
      };
    }
  },
});

export default service;
