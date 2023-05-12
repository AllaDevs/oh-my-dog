<script context="module" lang="ts">
  // TODO: Update this CDN to the latest version
  const TAILWIND_CDN = "https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css"
</script>

<script lang="ts">
  export let title = '¡OhMyDog!';
</script>

<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>{title}</title>
    <link
      href={TAILWIND_CDN}
      rel="stylesheet"
    />
  </head>
  <body>
    <slot />
  </body>
</html>
