# Solutions for bugs encountered during development

## “.prisma/client/index-browser”. Relative module specifiers must start with “./”, “../” or “/”.

This erros occurs when you import generated prisma code at client code (svelte files sended to client). To fix this a possible solution is to add the following code to the `vite.config.ts` file:

```js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// fix for prisma client in vite, see issue https://github.com/prisma/prisma/issues/12504
// - fix start
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);

const prismaClient = require
    .resolve('@prisma/client')
    .replace(/@prisma(\/|\\)client(\/|\\)index\.js/, '.prisma/client/index-browser.js');

const prismaIndexBrowser = path.normalize(path.relative(process.cwd(), prismaClient));
// - fix end

export default defineConfig({
    plugins: [sveltekit()],
    // applied to both client and server
    resolve: {
        alias: {
            '.prisma/client/index-browser': prismaIndexBrowser
        }
    }
});
```
