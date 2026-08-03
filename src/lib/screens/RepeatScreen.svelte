<script lang="ts">
	import {
		ArrowLeft,
		Check,
		CalendarDays
	} from '@lucide/svelte';

	import {
		alarmDraft
	} from '$lib/stores/alarmEditorStore';

	import {
		navigate
	} from '$lib/stores/navigationStore';

	type RepeatPreset =
		| 'once'
		| 'daily'
		| 'weekdays'
		| 'weekends'
		| 'custom';

	const days = [
		{ value: 0, short: 'S', name: 'Sunday' },
		{ value: 1, short: 'M', name: 'Monday' },
		{ value: 2, short: 'T', name: 'Tuesday' },
		{ value: 3, short: 'W', name: 'Wednesday' },
		{ value: 4, short: 'T', name: 'Thursday' },
		{ value: 5, short: 'F', name: 'Friday' },
		{ value: 6, short: 'S', name: 'Saturday' }
	];

	let selectedPreset =
		$state<RepeatPreset>('once');

	function detectPreset(
		repeatDays: number[]
	): RepeatPreset {
		if (repeatDays.length === 0) {
			return 'once';
		}

		if (
			repeatDays.length === 7
		) {
			return 'daily';
		}

		const weekdays =
			[1, 2, 3, 4, 5];

		const weekends =
			[0, 6];

		if (
			repeatDays.length === 5 &&
			weekdays.every(
				(day) =>
					repeatDays.includes(day)
			)
		) {
			return 'weekdays';
		}

		if (
			repeatDays.length === 2 &&
			weekends.every(
				(day) =>
					repeatDays.includes(day)
			)
		) {
			return 'weekends';
		}

		return 'custom';
	}

	$effect(() => {
		if ($alarmDraft) {
			selectedPreset =
				detectPreset(
					$alarmDraft.repeatDays
				);
		}
	});

	function updateRepeatDays(
		repeatDays: number[]
	) {
		alarmDraft.update(
			(draft) => {
				if (!draft) {
					return draft;
				}

				return {
					...draft,
					repeatDays
				};
			}
		);
	}

	function selectPreset(
		preset: RepeatPreset
	) {
		selectedPreset = preset;

		switch (preset) {
			case 'once':
				updateRepeatDays([]);
				break;

			case 'daily':
				updateRepeatDays(
					[0, 1, 2, 3, 4, 5, 6]
				);
				break;

			case 'weekdays':
				updateRepeatDays(
					[1, 2, 3, 4, 5]
				);
				break;

			case 'weekends':
				updateRepeatDays(
					[0, 6]
				);
				break;

			case 'custom':
				if (
					$alarmDraft &&
					$alarmDraft
						.repeatDays
						.length === 0
				) {
					updateRepeatDays([1]);
				}
				break;
		}
	}

	function toggleDay(
		day: number
	) {
		if (!$alarmDraft) {
			return;
		}

		selectedPreset = 'custom';

		const current =
			$alarmDraft.repeatDays;

		let updated: number[];

		if (
			current.includes(day)
		) {
			updated =
				current.filter(
					(value) =>
						value !== day
				);
		} else {
			updated =
				[
					...current,
					day
				].sort();
		}

		updateRepeatDays(updated);
	}

	function goBack() {
		navigate('editor');
	}
</script>

<div class="repeat-screen">

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
			<span>REPEAT</span>
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

	<div class="content">

		<div class="repeat-icon">
			<CalendarDays
				size={25}
				strokeWidth={1.6}
			/>
		</div>

		<h1>
			Repeat alarm
		</h1>

		<p class="description">
			Choose when this alarm repeats
		</p>

		<div class="preset-grid">

			<button
				type="button"
				class:active={
					selectedPreset === 'once'
				}
				onclick={() =>
					selectPreset('once')
				}
			>
				Once
			</button>

			<button
				type="button"
				class:active={
					selectedPreset === 'daily'
				}
				onclick={() =>
					selectPreset('daily')
				}
			>
				Every day
			</button>

			<button
				type="button"
				class:active={
					selectedPreset ===
					'weekdays'
				}
				onclick={() =>
					selectPreset('weekdays')
				}
			>
				Weekdays
			</button>

			<button
				type="button"
				class:active={
					selectedPreset ===
					'weekends'
				}
				onclick={() =>
					selectPreset('weekends')
				}
			>
				Weekends
			</button>

		</div>

		<div class="custom-section">

			<span class="section-label">
				CUSTOM DAYS
			</span>

			<div class="days">

				{#each days as day}

					<button
						type="button"
						class:active={
							$alarmDraft
								?.repeatDays
								.includes(
									day.value
								) ??
							false
						}
						aria-label={day.name}
						onclick={() =>
							toggleDay(
								day.value
							)
						}
					>
						{day.short}
					</button>

				{/each}

			</div>

		</div>

		<div class="summary">

			<span>
				Current schedule
			</span>

			<strong>
				{#if selectedPreset === 'once'}
					One time only
				{:else if selectedPreset === 'daily'}
					Every day
				{:else if selectedPreset === 'weekdays'}
					Monday – Friday
				{:else if selectedPreset === 'weekends'}
					Saturday & Sunday
				{:else}
					Custom schedule
				{/if}
			</strong>

		</div>

	</div>

</div>

<style>
	.repeat-screen {
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
		justify-content:
			space-between;
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
		color:
			var(--accent);

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

		top: 20%;
		left: 16%;
		right: 16%;
		bottom: 10%;

		overflow-y: auto;

		padding:
			3px 4px 40px;

		text-align: center;

		scrollbar-width: none;
	}

	.content::-webkit-scrollbar {
		display: none;
	}

	.repeat-icon {
		width: 52px;
		height: 52px;

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
			0 0 25px
			rgba(121, 232, 208, 0.07);
	}

	h1 {
		margin: 0;

		font-size: 1.2rem;

		font-weight: 500;
	}

	.description {
		margin:
			5px 0 16px;

		font-size: 0.65rem;

		color:
			var(--text-secondary);
	}

	.preset-grid {
		display: grid;

		grid-template-columns:
			1fr 1fr;

		gap: 8px;
	}

	.preset-grid button {
		min-height: 45px;

		padding:
			8px 10px;

		border:
			1px solid
			rgba(255, 255, 255, 0.09);

		border-radius: 16px;

		background:
			rgba(255, 255, 255, 0.045);

		color:
			rgba(255, 255, 255, 0.65);

		font-size: 0.67rem;

		cursor: pointer;

		transition:
			background 160ms ease,
			border-color 160ms ease,
			color 160ms ease,
			transform 160ms ease;
	}

	.preset-grid button:hover {
		transform:
			translateY(-1px);

		background:
			rgba(255, 255, 255, 0.08);
	}

	.preset-grid button.active {
		color:
			var(--accent);

		border-color:
			rgba(121, 232, 208, 0.3);

		background:
			rgba(121, 232, 208, 0.1);

		box-shadow:
			0 0 20px
			rgba(121, 232, 208, 0.06);
	}

	.custom-section {
		margin-top: 17px;
	}

	.section-label {
		display: block;

		margin-bottom: 9px;

		font-size: 0.55rem;

		font-weight: 700;

		letter-spacing: 0.14em;

		color:
			var(--text-secondary);
	}

	.days {
		display: flex;

		align-items: center;
		justify-content:
			space-between;

		gap: 4px;
	}

	.days button {
		width: 34px;
		height: 34px;

		display: grid;
		place-items: center;

		padding: 0;

		border:
			1px solid
			rgba(255, 255, 255, 0.09);

		border-radius: 50%;

		background:
			rgba(255, 255, 255, 0.04);

		color:
			rgba(255, 255, 255, 0.45);

		font-size: 0.62rem;

		font-weight: 600;

		cursor: pointer;

		transition:
			background 160ms ease,
			border-color 160ms ease,
			color 160ms ease,
			transform 160ms ease;
	}

	.days button:hover {
		transform:
			scale(1.07);
	}

	.days button.active {
		color:
			#07130f;

		background:
			var(--accent);

		border-color:
			var(--accent);

		box-shadow:
			0 0 16px
			rgba(121, 232, 208, 0.2);
	}

	.summary {
		margin-top: 16px;

		padding:
			12px 15px;

		display: flex;

		flex-direction: column;

		gap: 3px;

		border:
			1px solid
			rgba(255, 255, 255, 0.08);

		border-radius: 17px;

		background:
			rgba(255, 255, 255, 0.035);
	}

	.summary span {
		font-size: 0.54rem;

		letter-spacing: 0.08em;

		color:
			var(--text-secondary);
	}

	.summary strong {
		font-size: 0.68rem;

		font-weight: 500;
	}
</style>