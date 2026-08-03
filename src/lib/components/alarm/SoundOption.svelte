<script lang="ts">
	import {
		Heart,
		Play,
		Square,
		Check
	} from '@lucide/svelte';

	import type {
		AlarmSound
	} from '$lib/data/sounds';

	let {
		sound,
		selected = false,
		playing = false,
		onselect,
		onpreview
	}: {
		sound: AlarmSound;
		selected?: boolean;
		playing?: boolean;
		onselect: () => void;
		onpreview: () => void;
	} = $props();

	function handlePreview(
		event: MouseEvent
	) {
		event.stopPropagation();

		onpreview();
	}
</script>

<div
	class="sound-option"
	class:selected
	role="button"
	tabindex="0"
	onclick={onselect}
	onkeydown={(event) => {
		if (
			event.key === 'Enter' ||
			event.key === ' '
		) {
			event.preventDefault();
			onselect();
		}
	}}
>

	<button
		type="button"
		class="preview-button"
		aria-label={
			playing
				? `Stop ${sound.name}`
				: `Preview ${sound.name}`
		}
		onclick={handlePreview}
	>

		{#if playing}

			<Square
				size={14}
				strokeWidth={1.8}
			/>

		{:else}

			<Play
				size={15}
				strokeWidth={1.8}
				fill="currentColor"
			/>

		{/if}

	</button>

	<div class="sound-info">

		<div class="name-row">

			<strong>
				{sound.name}
			</strong>

			{#if sound.isFavorite}

				<Heart
					size={12}
					strokeWidth={1.8}
					fill="currentColor"
				/>

			{/if}

		</div>

		<span>
			{sound.description}
		</span>

	</div>

	<div class="selection">

		{#if selected}

			<div class="check">

				<Check
					size={14}
					strokeWidth={2.2}
				/>

			</div>

		{/if}

	</div>

</div>

<style>
	.sound-option {
		width: 100%;

		display: grid;

		grid-template-columns:
			auto 1fr 28px;

		align-items: center;

		gap: 11px;

		padding:
			10px 12px;

		border:
			1px solid
			rgba(255, 255, 255, 0.08);

		border-radius: 18px;

		background:
			rgba(255, 255, 255, 0.035);

		cursor: pointer;

		outline: none;

		transition:
			background 160ms ease,
			border-color 160ms ease,
			transform 160ms ease;
	}

	.sound-option:hover {
		transform:
			translateY(-1px);

		background:
			rgba(255, 255, 255, 0.07);
	}

	.sound-option.selected {
		border-color:
			rgba(121, 232, 208, 0.28);

		background:
			rgba(121, 232, 208, 0.075);

		box-shadow:
			0 0 20px
			rgba(121, 232, 208, 0.04);
	}

	.preview-button {
		width: 38px;
		height: 38px;

		display: grid;
		place-items: center;

		padding: 0;

		border:
			1px solid
			rgba(255, 255, 255, 0.1);

		border-radius: 50%;

		background:
			rgba(255, 255, 255, 0.055);

		color:
			rgba(255, 255, 255, 0.65);

		cursor: pointer;

		transition:
			background 160ms ease,
			color 160ms ease,
			transform 160ms ease;
	}

	.preview-button:hover {
		transform:
			scale(1.06);

		color:
			var(--accent);

		background:
			rgba(121, 232, 208, 0.09);
	}

	.sound-info {
		min-width: 0;

		display: flex;

		flex-direction: column;

		gap: 3px;
	}

	.name-row {
		display: flex;

		align-items: center;

		gap: 5px;
	}

	.name-row strong {
		overflow: hidden;

		font-size: 0.7rem;

		font-weight: 500;

		white-space: nowrap;

		text-overflow: ellipsis;
	}

	.name-row svg {
		flex-shrink: 0;

		color:
			var(--accent);
	}

	.sound-info > span {
		font-size: 0.56rem;

		color:
			var(--text-secondary);
	}

	.selection {
		width: 28px;

		display: grid;
		place-items: center;
	}

	.check {
		width: 24px;
		height: 24px;

		display: grid;
		place-items: center;

		border-radius: 50%;

		background:
			var(--accent);

		color:
			#07130f;

		box-shadow:
			0 0 14px
			rgba(121, 232, 208, 0.18);
	}
</style>