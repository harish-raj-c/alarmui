<script lang="ts">
	import type {
		Component
	} from 'svelte';

	import {
		ChevronRight
	} from '@lucide/svelte';

	let {
		icon: Icon,
		label,
		value,
		onclick
	}: {
		icon: Component;
		label: string;
		value: string;
		onclick: () => void;
	} = $props();
</script>

<button
	type="button"
	class="setting-row"
	onclick={onclick}
>

	<div class="icon">

		<Icon
			size={17}
			strokeWidth={1.7}
		/>

	</div>

	<div class="text">

		<span>
			{label}
		</span>

		<strong>
			{value}
		</strong>

	</div>

	<ChevronRight
		size={16}
		strokeWidth={1.7}
	/>

</button>

<style>
	.setting-row {
		width: 100%;

		display: grid;

		grid-template-columns:
			auto 1fr auto;

		align-items: center;

		gap: 10px;

		padding:
			10px 12px;

		border:
			1px solid
			rgba(
				255,
				255,
				255,
				0.09
			);

		border-radius: 17px;

		background:
			rgba(
				255,
				255,
				255,
				0.045
			);

		color: inherit;

		text-align: left;

		cursor: pointer;

		transition:
			background 160ms ease,
			transform 160ms ease;
	}

	.setting-row:hover {
		background:
			rgba(
				255,
				255,
				255,
				0.085
			);

		transform:
			translateY(-1px);
	}

	.icon {
		width: 34px;
		height: 34px;

		display: grid;
		place-items: center;

		border-radius: 50%;

		color:
			var(--accent);

		background:
			rgba(
				121,
				232,
				208,
				0.07
			);
	}

	.text {
		min-width: 0;

		display: flex;

		flex-direction:
			column;

		gap: 2px;
	}

	.text span {
		font-size:
			0.57rem;

		font-weight: 600;

		letter-spacing:
			0.08em;

		color:
			var(--text-secondary);
	}

	.text strong {
		overflow: hidden;

		font-size:
			0.7rem;

		font-weight: 500;

		white-space: nowrap;

		text-overflow:
			ellipsis;
	}
</style>