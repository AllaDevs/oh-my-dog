<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import EmailInput from '$lib/components/form/EmailInput.svelte';
	import PasswordInput from '$lib/components/form/PasswordInput.svelte';
	import SubmitButton from '$lib/components/form/SubmitButton.svelte';
	import SelectInput from '$lib/components/form/SelectInput.svelte';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import Form from '$lib/components/form/Form.svelte';

	export let data;

	const { form, errors, constraints, enhance } = superForm(data.form);
</script>

<SuperDebug data={$form} />

<Form method="POST" action="?/basic">
	<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 pb-4">
		<TextInput
			label="Texto libre"
			name="text"
			constraints={$constraints.text}
			bind:value={$form.text}
			errors={$errors.text}
		/>
		<EmailInput
			label="Correo electronico"
			name="email"
			constraints={$constraints.email}
			bind:value={$form.email}
			errors={$errors.email}
		/>
		<PasswordInput
			label="Contraseña"
			name="password"
			isNew={false}
			autocomplete={true}
			constraints={$constraints.password}
			bind:value={$form.password}
			errors={$errors.password}
		/>
		<SelectInput
			label="Ciudad"
			unselectedLabel="Sin seleccionar"
			name="city"
			constraints={$constraints.city}
			bind:value={$form.city}
			errors={$errors.city}
			options={[
				{ value: 'bsas', label: 'Buenos aires' },
				{ value: 'med', label: 'Medellin' },
				{ value: 'bar', label: 'Barcelona' }
			]}
		/>
	</div>

	<div class="mt-6 flex items-center justify-around gap-x-6">
		<SubmitButton />
	</div>
</Form>
