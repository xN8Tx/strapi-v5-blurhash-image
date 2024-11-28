<h1 align="center">Strapi v5 Blurhash Image</h1>
<p align="center">Create a blurhash for images in strapi v5</p>

---

## ⚠️ Warning

Work only with npm installation

## 💻 Installation

```sh
npm install strapi-v5-blurhash
```

## 💫 Usage

To use this plugin, you need to install it, after which all further added or updated photos receive the key `blurHash` with string type.

```json
{
    // ... Response
    image: "cover": {
    "id": 1,
    "documentId": "j3hcil6gr7oqfxau00zfcypw",
    "name": "BLACK_II_desktop.jpg",
    "alternativeText": null,
    "caption": null,
    "width": 5120,
    "height": 2880,
    "formats": {
        // ... Formats
    },
    "hash": "BLACK_II_desktop_eceab96ccc",
    "ext": ".jpg",
    "mime": "image/jpeg",
    "size": 1154.02,
    "url": "/uploads/BLACK_II_desktop_eceab96ccc.jpg",
    "previewUrl": null,
    "provider": "local",
    "provider_metadata": null,
    "createdAt": "2024-11-28T07:33:04.613Z",
    "updatedAt": "2024-11-28T07:33:04.613Z",
    "publishedAt": "2024-11-28T07:33:04.680Z",
    "blurHash": "D01yLPt7D%Rjt7t7ayRjofof" // BlurHash key
  },
    // ... Response
```

## 🗒️ TODO:

- [ ] Fix yarn
- [ ] Add key blurhash generation for already added photos

## 💖 Thanks

This project inspired by [Emil Petraš](https://github.com/emil-petras) his [repository with blurHash creator](https://github.com/emil-petras/strapi-blurhash)
