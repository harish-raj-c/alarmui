<script lang="ts">
	import type {
		Component
	} from 'svelte';

	let {
		icon: Icon,
		label,
		active = false,
		onclick
	}: {
		icon: Component;
		label: string;
		active?: boolean;
		onclick?: () => void;
	} = $props();
</script>

<button
	class:active
	type="button"
	aria-label={label}
	onclick={onclick}
>
	<Icon
		size={22}
		strokeWidth={1.8}
	/>
</button>

<style>
	button {
		width: 52px;
		height: 52px;

		display: grid;
		place-items: center;

		padding: 0;

		border-radius: 50%;

		border:
			1px solid
			rgba(255, 255, 255, 0.1);

		background:
			rgba(255, 255, 255, 0.045);

		color:
			rgba(255, 255, 255, 0.48);

		backdrop-filter:
			blur(18px);

		cursor: pointer;

		transition:
			transform 180ms ease,
			background 180ms ease,
			color 180ms ease;
	}

	button:hover {
		transform:
			scale(1.08);

		background:
			rgba(255, 255, 255, 0.1);

		color:
			white;
	}

	button:active {
		transform:
			scale(0.94);
	}

	button.active {
		color:
			var(--accent);

		background:
			rgba(121, 232, 208, 0.1);

		border-color:
			rgba(121, 232, 208, 0.3);
	}
</style>