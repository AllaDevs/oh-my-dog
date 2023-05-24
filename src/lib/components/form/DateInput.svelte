<script lang="ts">
	type DateFormat = `${number}-${number}-${number}`;

	export let max: DateFormat | undefined = undefined;
	export let min: DateFormat | undefined = undefined;
	import type { FieldPath, UnwrapEffects } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import type { z, AnyZodObject } from 'zod';

	type T = $$Generic<AnyZodObject>;

	export let form: SuperForm<UnwrapEffects<T>, unknown>;
	export let field: (keyof z.infer<T> | FieldPath<z.infer<T>>) & string;

	export let label: string;
	export let readonly: boolean = false;
	export let info: string | undefined = undefined;

	const { path, value, errors, constraints } = formFieldProxy(form, field);
</script>

<div class=" mt-2">
	<div class="flex justify-between text-sm font-medium">
		<label for={field} class=" max-w-fit p-2 text-gray-900">
			{label}
		</label>
		{#if info} <span class="py-2 text-gray-500">{info}</span> {/if}
	</div>
	<div class="">
		<input
			type="date"
			name={field}
			id={field}
			autocomplete="off"
			{min}
			{max}
			{readonly}
			bind:value={$value}
			data-invalid={$errors}
			{...$constraints}
			{...$$restProps}
			class="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
		/>
		{#if $errors}
			<p class="mt-2 text-sm text-red-500">
				{$errors}
			</p>
		{/if}
	</div>
</div>

<style>
	div:has(+ div input[required]) > label::after {
		content: ' *';
		color: red;
	}
</style>
