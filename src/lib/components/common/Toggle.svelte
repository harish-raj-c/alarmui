<script lang="ts">
	let {
		checked = false,
		label = 'Toggle',
		onchange
	}: {
		checked?: boolean;
		label?: string;
		onchange?: (checked: boolean) => void;
	} = $props();

	function handleClick(event: MouseEvent) {
		event.stopPropagation();

		onchange?.(!checked);
	}
</script>

<button
	type="button"
	class="toggle"
	class:checked
	aria-label={label}
	aria-pressed={checked}
	onclick={handleClick}
>
	<span class="thumb"></span>
</button>

<style>
	.toggle {
		position: relative;

		width: 42px;
		height: 24px;

		flex-shrink: 0;

		padding: 0;

		border:
			1px solid
			rgba(255, 255, 255, 0.12);

		border-radius: 999px;

		background:
			rgba(255, 255, 255, 0.08);

		cursor: pointer;

		transition:
			background 180ms ease,
			border-color 180ms ease,
			box-shadow 180ms ease;
	}

	.thumb {
		position: absolute;

		top: 3px;
		left: 3px;

		width: 16px;
		height: 16px;

		border-radius: 50%;

		background:
			rgba(255, 255, 255, 0.72);

		box-shadow:
			0 2px 6px
			rgba(0, 0, 0, 0.3);

		transition:
			transform 180ms ease,
			background 180ms ease;
	}

	.toggle.checked {
		background:
			rgba(121, 232, 208, 0.18);

		border-color:
			rgba(121, 232, 208, 0.4);

		box-shadow:
			0 0 16px
			rgba(121, 232, 208, 0.1);
	}

	.toggle.checked .thumb {
		transform:
			translateX(18px);

		background:
			var(--accent);
	}
</style>