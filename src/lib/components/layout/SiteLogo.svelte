<script lang="ts">
  export let link: string;
  export let onLink: boolean = false;
</script>

<a
  href={link}
  aria-current={onLink ? 'page' : false}
  class=" md:px-4 flex justify-center items-center py-1 underline-offset-2 rounded-md hover:underline"
>
  <img src="/bone.png" alt="¡Oh my dog! logo" class="h-10 w-10" />
  <strong class="text-xl mx-1">¡Oh my dog!</strong>
</a>
