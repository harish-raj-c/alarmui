<script lang="ts">
	import {
		ArrowLeft,
		Check,
		TimerReset,
		Minus,
		Plus
	} from '@lucide/svelte';

	import {
		alarmDraft
	} from '$lib/stores/alarmEditorStore';

	import {
		navigate
	} from '$lib/stores/navigationStore';

	const durations = [
		5,
		10,
		15,
		20,
		30
	];

	function setDuration(
		durationMinutes: number
	) {
		alarmDraft.update(
			(draft) => {
				if (!draft) {
					return draft;
				}

				return {
					...draft,

					snooze: {
						...draft.snooze,
						durationMinutes
					}
				};
			}
		);
	}

	function decreaseCount() {
		alarmDraft.update(
			(draft) => {
				if (!draft) {
					return draft;
				}

				const maxCount =
					Math.max(
						1,
						draft.snooze
							.maxCount - 1
					);

				return {
					...draft,

					snooze: {
						...draft.snooze,
						maxCount
					}
				};
			}
		);
	}

	function increaseCount() {
		alarmDraft.update(
			(draft) => {
				if (!draft) {
					return draft;
				}

				const maxCount =
					Math.min(
						5,
						draft.snooze
							.maxCount + 1
					);

				return {
					...draft,

					snooze: {
						...draft.snooze,
						maxCount
					}
				};
			}
		);
	}

	function goBack() {
		navigate('editor');
	}
</script>

<div class="snooze-screen">

	<header>

		<button
			type="button"
			class="header-button"
			aria-label="Go back"
			onclick={goBack}
		>
			<ArrowLeft
				size={21}
				strokeWidth={1.8}
			/>
		</button>

		<div class="heading">
			<span>
				SNOOZE
			</span>
		</div>

		<button
			type="button"
			class="header-button done"
			aria-label="Done"
			onclick={goBack}
		>
			<Check
				size={21}
				strokeWidth={2}
			/>
		</button>

	</header>

	{#if $alarmDraft}

		<div class="content">

			<div class="snooze-icon">

				<TimerReset
					size={27}
					strokeWidth={1.6}
				/>

			</div>

			<h1>
				Snooze settings
			</h1>

			<p class="description">
				Choose how long and how often
			</p>

			<section>

				<span class="section-label">
					SNOOZE DURATION
				</span>

				<div class="duration-grid">

					{#each durations as duration}

						<button
							type="button"
							class:active={
								$alarmDraft
									.snooze
									.durationMinutes ===
								duration
							}
							onclick={() =>
								setDuration(
									duration
								)
							}
						>
							<strong>
								{duration}
							</strong>

							<span>
								MIN
							</span>
						</button>

					{/each}

				</div>

			</section>

			<section>

				<span class="section-label">
					MAXIMUM SNOOZES
				</span>

				<div class="counter-card">

					<button
						type="button"
						aria-label="Decrease maximum snoozes"
						disabled={
							$alarmDraft
								.snooze
								.maxCount <= 1
						}
						onclick={decreaseCount}
					>
						<Minus
							size={19}
							strokeWidth={1.8}
						/>
					</button>

					<div class="count">

						<strong>
							{$alarmDraft
								.snooze
								.maxCount}
						</strong>

						<span>
							TIMES
						</span>

					</div>

					<button
						type="button"
						aria-label="Increase maximum snoozes"
						disabled={
							$alarmDraft
								.snooze
								.maxCount >= 5
						}
						onclick={increaseCount}
					>
						<Plus
							size={19}
							strokeWidth={1.8}
						/>
					</button>

				</div>

			</section>

			<div class="summary-card">

				<div>
					<span>
						SNOOZE PLAN
					</span>

					<strong>
						{$alarmDraft
							.snooze
							.durationMinutes}
						min ×
						{$alarmDraft
							.snooze
							.maxCount}
					</strong>
				</div>

				<p>
					You can snooze this alarm
					{$alarmDraft
						.snooze
						.maxCount}
					{#if $alarmDraft.snooze.maxCount === 1}
						time
					{:else}
						times
					{/if}
					for
					{$alarmDraft
						.snooze
						.durationMinutes}
					minutes each.
				</p>

			</div>

		</div>

	{/if}

</div>

<style>
	.snooze-screen {
		position: relative;

		width: 100%;
		height: 100%;

		overflow: hidden;
	}

	header {
		position: absolute;

		top: 9%;
		left: 17%;
		right: 17%;

		z-index: 10;

		display: flex;

		align-items: center;
		justify-content: space-between;
	}

	.header-button {
		width: 42px;
		height: 42px;

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
			rgba(255, 255, 255, 0.72);

		cursor: pointer;
	}

	.header-button.done {
		color: var(--accent);

		border-color:
			rgba(121, 232, 208, 0.22);

		background:
			rgba(121, 232, 208, 0.08);
	}

	.heading span {
		font-size: 0.62rem;

		font-weight: 700;

		letter-spacing: 0.17em;

		color:
			var(--text-secondary);
	}

	.content {
		position: absolute;

		top: 19%;
		left: 16%;
		right: 16%;
		bottom: 9%;

		overflow-y: auto;

		padding:
			4px 5px 45px;

		text-align: center;

		scrollbar-width: none;
	}

	.content::-webkit-scrollbar {
		display: none;
	}

	.snooze-icon {
		width: 54px;
		height: 54px;

		margin:
			0 auto 10px;

		display: grid;
		place-items: center;

		border-radius: 50%;

		color:
			var(--accent);

		background:
			rgba(121, 232, 208, 0.08);

		border:
			1px solid
			rgba(121, 232, 208, 0.16);

		box-shadow:
			0 0 24px
			rgba(121, 232, 208, 0.06);
	}

	h1 {
		margin: 0;

		font-size: 1.15rem;

		font-weight: 500;
	}

	.description {
		margin:
			5px 0 17px;

		font-size: 0.62rem;

		color:
			var(--text-secondary);
	}

	section {
		margin-bottom: 16px;
	}

	.section-label {
		display: block;

		margin-bottom: 8px;

		font-size: 0.54rem;

		font-weight: 700;

		letter-spacing: 0.13em;

		color:
			var(--text-secondary);
	}

	.duration-grid {
		display: grid;

		grid-template-columns:
			repeat(5, 1fr);

		gap: 5px;
	}

	.duration-grid button {
		aspect-ratio: 1;

		display: flex;

		flex-direction: column;

		align-items: center;
		justify-content: center;

		gap: 2px;

		padding: 0;

		border:
			1px solid
			rgba(255, 255, 255, 0.09);

		border-radius: 50%;

		background:
			rgba(255, 255, 255, 0.04);

		color:
			rgba(255, 255, 255, 0.55);

		cursor: pointer;

		transition:
			transform 160ms ease,
			background 160ms ease,
			border-color 160ms ease,
			color 160ms ease;
	}

	.duration-grid button:hover {
		transform:
			scale(1.05);
	}

	.duration-grid button.active {
		color:
			#07130f;

		border-color:
			var(--accent);

		background:
			var(--accent);

		box-shadow:
			0 0 18px
			rgba(121, 232, 208, 0.2);
	}

	.duration-grid strong {
		font-size: 0.72rem;

		font-weight: 600;
	}

	.duration-grid span {
		font-size: 0.4rem;

		font-weight: 700;

		letter-spacing: 0.06em;
	}

	.counter-card {
		display: grid;

		grid-template-columns:
			44px 1fr 44px;

		align-items: center;

		gap: 12px;

		padding:
			10px 14px;

		border:
			1px solid
			rgba(255, 255, 255, 0.09);

		border-radius: 22px;

		background:
			rgba(255, 255, 255, 0.04);
	}

	.counter-card > button {
		width: 42px;
		height: 42px;

		display: grid;
		place-items: center;

		padding: 0;

		border:
			1px solid
			rgba(255, 255, 255, 0.1);

		border-radius: 50%;

		background:
			rgba(255, 255, 255, 0.055);

		color: white;

		cursor: pointer;
	}

	.counter-card > button:disabled {
		opacity: 0.25;

		cursor: not-allowed;
	}

	.count {
		display: flex;

		flex-direction: column;

		align-items: center;

		gap: 2px;
	}

	.count strong {
		font-size: 1.8rem;

		font-weight: 300;

		line-height: 1;
	}

	.count span {
		font-size: 0.48rem;

		font-weight: 700;

		letter-spacing: 0.12em;

		color:
			var(--text-secondary);
	}

	.summary-card {
		padding:
			12px 15px;

		border:
			1px solid
			rgba(121, 232, 208, 0.1);

		border-radius: 19px;

		background:
			linear-gradient(
				135deg,
				rgba(121, 232, 208, 0.055),
				rgba(255, 255, 255, 0.025)
			);

		text-align: left;
	}

	.summary-card > div {
		display: flex;

		align-items: center;
		justify-content: space-between;
	}

	.summary-card span {
		font-size: 0.52rem;

		font-weight: 700;

		letter-spacing: 0.1em;

		color:
			var(--text-secondary);
	}

	.summary-card strong {
		font-size: 0.68rem;

		font-weight: 500;

		color:
			var(--accent);
	}

	.summary-card p {
		margin:
			7px 0 0;

		font-size: 0.56rem;

		line-height: 1.5;

		color:
			var(--text-secondary);
	}
</style>