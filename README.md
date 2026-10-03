# ImageKit — A better frame.

A local image studio and independent portfolio concept by **Thomas Ginting**. Resize, crop and convert images with an interactive view of the original, crop and export.

**Live site:** https://jokojoyo.github.io/imagekit-studio/

## Features

- JPG, PNG and WebP import, including drag and drop.
- Crop ratios, zoom, position sliders, pointer dragging and keyboard controls.
- Linked or independent dimensions, quality adjustment and real image downloads.
- Exact export preview with dimensions and encoded file size.
- Three.js image layers, pause/rotate controls and a precise 2D editor.
- Responsive layout, light/dark themes and reduced-motion support.
- Photos stay in the browser. There are no image uploads, accounts, analytics or paid APIs. Only the theme preference is stored; reloading clears the image session.

## Run locally

Requires Node.js 22.12+ or a compatible modern LTS version.

```sh
npm install
npm run dev
```

Open the Vite address followed by `/dev.html`.

```sh
npm test
npm run build
```

The build creates `dist/` and copies the production files to the repository root, with `dev.html` renamed to `index.html`. GitHub Pages serves the root of `main`; all asset URLs are relative, so the site works at its repository path.

## Limits and behavior

One image at a time, up to 20 MB and 32 megapixels decoded. Exports support 1–4,096 pixels per side and at most 16 megapixels. Animated inputs export one still frame. Image metadata is not copied. JPG places transparent areas on white; PNG is lossless; JPG and WebP use the quality slider. Enlarging an image cannot recover detail and encoded size can increase. Browser format support and encoding can vary.

The generated pear sample is illustrative. The default export enlarges its crop; the preview explains the potential loss of fine detail. If WebGL is unavailable, the image tools remain usable in 2D. Mobile starts in 2D and loads 3D on request.

## Source

`ImageKit.jsx` owns the editor and export flow, `image-tools.js` contains crop/validation helpers, and `Layers.jsx` renders the image planes. `dev.css` is the design stylesheet. Self-hosted fonts and image assets live in the repository root. Generated-image prompts and derivations are recorded in adjacent JSON files and `ASSET-PROMPTS.md`. See `THIRD-PARTY-NOTICES.md` for dependency and font licenses.

This project is an independent portfolio demonstration, with no affiliation to other services that use the name ImageKit.
