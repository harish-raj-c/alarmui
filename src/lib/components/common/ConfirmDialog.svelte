<script lang="ts">
	import {
		Trash2,
		X
	} from '@lucide/svelte';

	let {
		title = 'Delete alarm?',
		message = 'This action cannot be undone.',
		onconfirm,
		oncancel
	}: {
		title?: string;
		message?: string;
		onconfirm: () => void;
		oncancel: () => void;
	} = $props();

	function handleOverlayClick(
		event: MouseEvent
	) {
		if (
			event.target ===
			event.currentTarget
		) {
			oncancel();
		}
	}

	function handleOverlayKeydown(
		event: KeyboardEvent
	) {
		if (event.key === 'Escape') {
			oncancel();
		}
	}
</script>

<div
	class="overlay"
	role="presentation"
	onclick={handleOverlayClick}
	onkeydown={handleOverlayKeydown}
>

	<div
		class="dialog"
		role="alertdialog"
		aria-modal="true"
		aria-label={title}
		tabindex="-1"
	>

		<div class="icon">
			<Trash2
				size={22}
				strokeWidth={1.7}
			/>
		</div>

		<h2>
			{title}
		</h2>

		<p>
			{message}
		</p>

		<div class="dialog-actions">

			<button
				type="button"
				class="cancel"
				onclick={oncancel}
			>
				<X size={16} />

				Cancel
			</button>

			<button
				type="button"
				class="confirm"
				onclick={onconfirm}
			>
				<Trash2 size={16} />

				Delete
			</button>

		</div>

	</div>

</div>

<style>
	.overlay {
		position: absolute;
		inset: 0;
		z-index: 50;

		display: grid;
		place-items: center;

		padding: 18%;

		background:
			rgba(0, 0, 0, 0.52);

		backdrop-filter:
			blur(12px);
	}

	.dialog {
		width: 100%;

		padding:
			22px 20px;

		border:
			1px solid
			rgba(255, 255, 255, 0.14);

		border-radius: 28px;

		outline: none;

		background:
			linear-gradient(
				145deg,
				rgba(38, 45, 58, 0.95),
				rgba(15, 20, 30, 0.94)
			);

		text-align: center;

		box-shadow:
			0 25px 60px
			rgba(0, 0, 0, 0.4);
	}

	.icon {
		width: 46px;
		height: 46px;

		margin:
			0 auto 12px;

		display: grid;
		place-items: center;

		border-radius: 50%;

		color:
			var(--danger);

		background:
			rgba(255, 107, 122, 0.1);

		border:
			1px solid
			rgba(255, 107, 122, 0.2);
	}

	h2 {
		margin: 0;

		font-size: 1.05rem;
	}

	p {
		margin:
			7px 0 18px;

		font-size: 0.68rem;

		line-height: 1.5;

		color:
			var(--text-secondary);
	}

	.dialog-actions {
		display: flex;

		justify-content: center;

		gap: 10px;
	}

	.dialog-actions button {
		display: flex;

		align-items: center;
		justify-content: center;

		gap: 6px;

		padding:
			9px 14px;

		border-radius: 999px;

		cursor: pointer;
	}

	.cancel {
		border:
			1px solid
			rgba(255, 255, 255, 0.12);

		background:
			rgba(255, 255, 255, 0.06);

		color: white;
	}

	.confirm {
		border:
			1px solid
			rgba(255, 107, 122, 0.25);

		background:
			rgba(255, 107, 122, 0.13);

		color:
			#ff9ba5;
	}
</style>