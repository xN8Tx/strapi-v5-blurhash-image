<h1 align="center">✨ Strapi v5 BlurHash Plugin ✨</h1>
<p align="center">Automatically generate stunning BlurHash placeholders for images in Strapi v5.</p>

---

## 🚀 Installation

Install the plugin using your favorite package manager:

```sh
npm install strapi-v5-blurhash-image
```

or

```sh
yarn add strapi-v5-blurhash-image
```

---

## 🌟 Usage

Once installed, all newly added images will automatically include a `blurHash` object with the following keys:

- **`code`**: The BlurHash string.
- **`url`**: A Data URL representing the decoded BlurHash as a small image.

This feature provides visually appealing blurred placeholders for images while they load. Here’s an example of an image object with the added `blurHash`:

```json
{
  "image": {
    "cover": {
      "id": 1,
      "documentId": "j3hcil6gr7oqfxau00zfcypw",
      "name": "BLACK.jpg",
      "alternativeText": null,
      "caption": null,
      "width": 5120,
      "height": 2880,
      "hash": "BLACK",
      "ext": ".jpg",
      "mime": "image/jpeg",
      "size": 1154.02,
      "url": "/uploads/BLACK.jpg",
      "previewUrl": null,
      "provider": "local",
      "provider_metadata": null,
      "createdAt": "2024-11-28T07:33:04.613Z",
      "updatedAt": "2024-11-28T07:33:04.613Z",
      "publishedAt": "2024-11-28T07:33:04.680Z",
      "blurHash": {
        "code": "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
        "url": "data:image/png;base64,..."
      }
    }
  }
}
```

### 🔄 Updating Existing Photos

To add BlurHash to already uploaded photos, execute the following command in any controller (use it once, then remove it):

```js
await strapi.plugin('strapi-v5-blurhash-image').services.service.updateBlurHash();
```

---

## 💖 Acknowledgments

This plugin is inspired by the work of [Emil Petraš](https://github.com/emil-petras) and his [BlurHash generator repository](https://github.com/emil-petras/strapi-blurhash).
