# Project setup

This file contains the steps to setup the project from scratch, at least the important ones.

> **Note 1:** This file is not meant to be used as a guide, but rather as a reference for the future.
>
> **Note 2:** If you are cloning this repo, you can skip this file.

```bash
# create sveltekit project
npm create svelte@latest my-app
cd my-app
npm install

# follow up with tailwindcss setup and continue with the rest of the steps
# https://tailwindcss.com/docs/guides/sveltekit

# add prisma
npm i @prisma/client
npm i prisma -D
npx prisma init

# add lucia-auth
npm i lucia-auth
npm i @lucia-auth/adapter-prisma

# add nodemailer
npm i nodemailer

# add svelte libraries
npm i -D sveltekit-superforms zod svelte-french-toast

# add cloudinary
npm i cloudinary
```

This project is meant to be deployed to vercel, so we need to add the following script into the `package.json` in order to generate the prisma client before the builded project starts:

```json
"scripts": {
    // other scripts
    "postinstall": "prisma generate"
}
```


## Authentication

Resources:

- [lucia-auth](https://lucia-auth.com/)
- [lucia-auth tutorial](https://www.youtube.com/watch?v=UMpKaZy0Rpc&t=1164s&ab_channel=Huntabyte)
- [protected routes](https://www.youtube.com/watch?v=K1Tya6ovVOI&ab_channel=Huntabyte)


## Mailing

Resources:

- [nodemailer](https://github.com/nodemailer/nodemailer)
- [sendgrid](https://docs.sendgrid.com/)


## Svelte libraries

Resources:

- [superforms](https://superforms.vercel.app/)
- [superforms tutorial](https://youtu.be/MiKzH3kcVfs)
- [svelte-french-toast](https://svelte-french-toast.com/)


## Cloudinary

Resources:

- [cloudinary](https://cloudinary.com/documentation/node_integration)
- [upload image api reference](https://cloudinary.com/documentation/image_upload_api_reference)


## For later?

- [form spam protection](https://www.cloudflare.com/products/turnstile/)
