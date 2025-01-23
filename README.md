<h1 align="center">Image optimizer for Strapi v5</h1>
<p align="center">Automatically generate stunning BlurHash placeholders for images in Strapi v5.</p>

---

## 🚀 Installation

Install the plugin using your favorite package manager:

```sh
npm install strapi-v5-image-optimizer
```

or

```sh
yarn add strapi-v5-image-optimizer
```

---

## 🚀 Features

### 📦 WebP conversion

This plugin automatically convert uploaded images to `WebP` format. To achieve this, it uses the `sharp` library, which is a powerful image processing tool. The conversion process is optimized to provide a high quality image while maintaining a small file size.

To configure the plugin, you need to add the following configuration to your `config/plugins.js` file:

```ts
export default () => ({
  // ...
  'strapi-v5-image-optimizer': {
    enabled: true,
    config: {
      // Configurate this options(All values here is default)
      webp: {
        enabled: true,
        convertMimeTypes: ['image/jpeg', 'image/png'],
        sharpConfig: {},
        webpConfig: {
          lossless: true,
        },
      },
    },
  },
  // ...
});
```

If you want conver `.gif` to `.webp` you need to turn off `Size optimization` in `Settings => Media Library` in your strapi admin panel. After that in config for `webp.convertMimeTypes` add `image/gif` to another mime types which you want convert to `.webp`.

### 🌟 BlurHash Generation

This plugin automatically generate `blurHash` for uploaded images. To optimize image loading time, the plugin uses `blurhash` library. The generation process is optimized to provide a high quality image while maintaining a small file size.

To configure the plugin, you need to add the following configuration to your `config/plugins.js` file:

```ts
export default () => ({
  // ...
  'strapi-v5-image-optimizer': {
    enabled: true,
    config: {
      // Configurate this options(All values here is default)
      blurHash: {
        enabled: true,
      },
    },
  },
  // ...
});
```

## 🔄 Updating BlurHash for Existing Photos

To add BlurHash to already uploaded photos, execute the following command in bootstrap your app(`src/index.ts`) (use it once, then remove it):

```ts
export default {
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await strapi.plugin('strapi-v5-image-optimizer').service('blurHashService').updateBlurHash();
  },
};
```

## 🆕 Migrate from 'strapi-v5-blurhash-generator' version to 'strapi-v5-image-optimizer'

In strapi-v5-image-optimizer, the plugin generates a 'blurHash' key with a string type, whereas in the strapi-v5-blurhash-generator it generated a JSON object. To migrate from the first version to the second, add this function to your src/index.ts and run it during the bootstrap phase of your application. Once it has been applied, you can remove it.

```ts
const migrateFromFirstVersion = async (strapi: Core.Strapi) => {
  const files = await strapi.documents('plugin::upload.file').findMany({
    filters: {
      blurHash: {
        $startsWith: '{',
      },
    },
    limit: 99999,
  });

  const fileUpdates = files.map(async (file) => {
    const documentId = file.documentId;

    if (typeof file.blurHash !== 'string') {
      return;
    }

    const blurHashObject = JSON.parse(file.blurHash);
    const blurHash = blurHashObject['url'];

    await strapi.documents('plugin::upload.file').update({
      documentId,
      data: {
        blurHash,
      },
    });
  });

  await Promise.all(fileUpdates);
};
```

---

## 💖 Acknowledgments

This plugin is inspired by the work of [Emil Petraš](https://github.com/emil-petras) and his [BlurHash generator repository](https://github.com/emil-petras/strapi-blurhash).
