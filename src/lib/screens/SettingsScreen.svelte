<script lang="ts">
	import {
		ArrowLeft,
		Settings
	} from'@lucide/svelte';

	import {
		navigate
	} from '$lib/stores/navigationStore';
</script>

<div class="screen">

	<button
		class="back"
		type="button"
		onclick={() =>
			navigate('home')
		}
	>
		<ArrowLeft size={24} />
	</button>

	<div class="center">

		<Settings
			size={32}
			strokeWidth={1.5}
		/>

		<h1>Settings</h1>

		<p>
			Settings screen coming later
		</p>

	</div>

</div>

<style>
	.screen {
		position: relative;

		width: 100%;
		height: 100%;
	}

	.center {
		width: 100%;
		height: 100%;

		display: flex;

		flex-direction:
			column;

		align-items: center;
		justify-content: center;

		text-align: center;
	}

	.back {
		position: absolute;

		z-index: 2;

		top: 13%;
		left: 18%;

		width: 46px;
		height: 46px;

		display: grid;
		place-items: center;

		border: none;

		border-radius: 50%;

		background:
			rgba(
				255,
				255,
				255,
				0.07
			);

		color: white;

		cursor: pointer;
	}

	h1 {
		margin:
			12px 0 4px;
	}

	p {
		color:
			var(
				--text-secondary
			);
	}
</style>