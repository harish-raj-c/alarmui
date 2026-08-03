<script lang="ts">
	let { children } = $props();
</script>

<div class="stage">

	<div class="device">

		<div class="metal-ring">

			<div class="display">

				<div class="ambient-glow"></div>

				<div class="content">
					{@render children()}
				</div>

			</div>

		</div>

	</div>

</div>

<style>
	.stage {
		width: 100vw;
		height: 100vh;

		display: grid;
		place-items: center;

		background:
			radial-gradient(
				circle at 50% 35%,
				#202b43 0%,
				#101725 35%,
				#070a11 70%
			);
	}

	.device {
		width: min(88vw, 620px);
		aspect-ratio: 1;

		border-radius: 50%;

		filter:
			drop-shadow(
				0 40px 45px
				rgba(0, 0, 0, 0.55)
			);
	}

	.metal-ring {
		width: 100%;
		height: 100%;

		padding: 12px;

		border-radius: 50%;

		background:
			linear-gradient(
				145deg,
				#c7ccd2,
				#3b424c 35%,
				#161b22 70%,
				#89919b
			);

		box-shadow:
			inset 0 2px 3px
				rgba(255, 255, 255, 0.5),
			inset 0 -3px 5px
				rgba(0, 0, 0, 0.8);
	}

	.display {
		position: relative;

		width: 100%;
		height: 100%;

		border-radius: 50%;

		overflow: hidden;

		background:
			radial-gradient(
				circle at 35% 18%,
				rgba(255, 255, 255, 0.12),
				transparent 28%
			),
			radial-gradient(
				circle at 60% 65%,
				rgba(74, 113, 140, 0.2),
				transparent 45%
			),
			rgba(6, 10, 17, 0.9);

		backdrop-filter: blur(30px);

		box-shadow:
			inset 0 0 50px
				rgba(0, 0, 0, 0.7);
	}

	.ambient-glow {
		position: absolute;

		width: 55%;
		height: 55%;

		left: 15%;
		top: 5%;

		border-radius: 50%;

		background:
			rgba(100, 200, 220, 0.08);

		filter: blur(60px);

		pointer-events: none;
	}

	.content {
		position: relative;

		width: 100%;
		height: 100%;

		z-index: 1;
	}
</style>