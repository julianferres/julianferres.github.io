# Julian's Running Blog

This repository contains a Hugo site published to GitHub Pages.

## Run locally

Install Hugo (extended edition) and Go, then run:

```sh
hugo server
```

PaperMod is loaded as a Hugo module and pinned in `go.mod`. Hugo downloads the
theme module the first time the site is built.

## Deploy

Push to the `hugo` branch to build and deploy the site with the workflow in
`.github/workflows/hugo.yaml`. In the repository's Pages settings, set the
publishing source to **GitHub Actions**.