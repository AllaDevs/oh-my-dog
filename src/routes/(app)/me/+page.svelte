<script lang="ts">
	import LinkCard from '$lib/components/LinkCard.svelte';

	export let data;
</script>

<h1>{data.me?.username}</h1>

<div class=" grid max-w-sm grid-cols-2 gap-6">
	<LinkCard
		href="/me/account"
		title="Mi cuenta"
		img={{ src: 'my_account.png', alt: 'Logo cuenta' }}
	/>
	<LinkCard href="/me/dog" title="Mis perros" img={{ src: 'my_dogs.png', alt: 'Logo perros' }} />
	<LinkCard
		href="/me/dog"
		title="Mis turnos"
		img={{ src: 'my_appointments.png', alt: 'Logo perros' }}
	/>
</div>
