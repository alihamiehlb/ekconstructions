# Replace gallery with your Instagram photos

Instagram blocks automated downloads, so add your images manually (you've given permission to use them):

1. Open [@ekconstructions](https://www.instagram.com/ekconstructions/) on your phone or browser.
2. Save your **5 best project posts** as images.
3. Copy them into:

```
public/instagram/
  1.jpg
  2.jpg
  3.jpg
  4.jpg
  5.jpg
```

4. Refresh the site — the gallery will automatically use these instead of the placeholders.

**Profile photo for logo:** If your Instagram profile picture is your brand logo, save it as `public/images/logo.png` and update `components/brand/Logo.tsx` to use an `<Image>` instead of SVG.

## Regenerate hero illustration

The hero uses a high-resolution generated illustration at `public/images/hero-building.png`. Replace it anytime with your own asset.

## Re-run mockup asset extraction

```
node scripts/extract-mockup-assets.mjs
```
