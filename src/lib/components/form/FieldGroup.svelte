<div
  class=" flex flex-col border border-solid p-6 rounded border-gray-900/10 sm:mx-8 md:mx-0"
>
  <div class=" flex justify-between">
    <slot name="title" />
  </div>

  <div
    class=" grid mt-2 gap-2 md:grid-cols-2 md:gap-x-8 lg:gap-x-6 lg:grid-cols-3"
  >
    <slot name="fields" />
  </div>

  <div class=" mt-6 flex items-center justify-around">
    <slot name="actions" />
  </div>
</div>
