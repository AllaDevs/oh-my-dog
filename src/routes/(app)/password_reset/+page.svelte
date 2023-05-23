<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import Form from '$lib/components/form/Form.svelte';
	import EmailInput from '$lib/components/form/EmailInput.svelte';
	import SubmitButton from '$lib/components/form/SubmitButton.svelte';

	export let data;

	const { form, errors, constraints, message, enhance } = superForm(data.form);
</script>

<Form method="POST" {enhance} class=" max-w-sm">
	<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 pb-4">
		<EmailInput
			label="Direccion de email"
			name="email"
			autocomplete={true}
			constraints={$constraints.email}
			bind:value={$form.email}
			errors={$errors.email}
		>
			<div class="mt-2">
				<a href="/login" class="text-sm font-medium text-gray-500 hover:text-gray-800"
					>¿Recuerdas la contraseña?</a
				>
			</div>
		</EmailInput>
	</div>

	<div class="mt-6 grid place-items-center">
		<SubmitButton>Enviar email de restableciemiento</SubmitButton>
	</div>

	<p
		class="w-sm mt-10 w-full px-6 text-center text-sm text-gray-600 opacity-0"
		style:opacity={$message ? 1 : 0}
		style="transition: opacity 0.3s ease-in-out;"
	>
		El email de restablecimiento ha sido enviado a <b>{$form.email}</b>, revisa la bandeja de
		entrada.
	</p>
</Form>
