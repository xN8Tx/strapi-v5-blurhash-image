<h1 align="center">Strapi v5 Blurhash Image</h1>
<p align="center">Automatically generate a BlurHash for images in Strapi v5</p>

---

## 💻 Installation

Install the plugin using the following command:

```sh
npm install strapi-v5-blurhash
```

or

```sh
yarn add strapi-v5-blurhash
```

---

## 💫 Usage

Once the plugin is installed, all newly added or updated images will automatically receive a `blurHash` object. This object includes two keys:

- `code`: The BlurHash string.
- `url`: A Data URL representing the decoded BlurHash as a small image.

This feature allows you to display a visually appealing blurred placeholder for the image before it fully loads.

Here’s an example of the image object with the added `blurHash`:

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

---

## 🗒️ Roadmap

- [ ] Add support for generating `blurHash` keys for existing images.

---

## 💖 Acknowledgments

This project is inspired by the work of [Emil Petraš](https://github.com/emil-petras) and his [repository for a BlurHash generator](https://github.com/emil-petras/strapi-blurhash).
