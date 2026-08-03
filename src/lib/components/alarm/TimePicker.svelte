<script lang="ts">
	import {
		Minus,
		Plus
	} from '@lucide/svelte';

	let {
		hour = 7,
		minute = 0,
		onchange
	}: {
		hour: number;
		minute: number;
		onchange: (
			hour: number,
			minute: number
		) => void;
	} = $props();

	type TimePart =
		| 'hour'
		| 'minute';

	let activePart =
		$state<TimePart>('hour');

	function getDisplayHour() {
		const value =
			hour % 12;

		return value === 0
			? 12
			: value;
	}

	function getPeriod() {
		return hour >= 12
			? 'PM'
			: 'AM';
	}

	function increase() {
		/*
			HOUR SELECTED

			Increase:
			23 → 00
		*/
		if (
			activePart ===
			'hour'
		) {
			onchange(
				(hour + 1) % 24,
				minute
			);

			return;
		}

		/*
			MINUTE SELECTED

			Increase one minute:
			00 → 01 → 02 ... 59

			At 59:
			07:59 → 08:00
		*/
		let newMinute =
			minute + 1;

		let newHour =
			hour;

		if (
			newMinute >= 60
		) {
			newMinute = 0;

			newHour =
				(hour + 1) % 24;
		}

		onchange(
			newHour,
			newMinute
		);
	}

	function decrease() {
		/*
			HOUR SELECTED

			Decrease:
			00 → 23
		*/
		if (
			activePart ===
			'hour'
		) {
			onchange(
				(hour + 23) % 24,
				minute
			);

			return;
		}

		/*
			MINUTE SELECTED

			Decrease one minute:
			05 → 04 → 03 ... 00

			At 00:
			08:00 → 07:59
		*/
		let newMinute =
			minute - 1;

		let newHour =
			hour;

		if (
			newMinute < 0
		) {
			newMinute = 59;

			newHour =
				(hour + 23) % 24;
		}

		onchange(
			newHour,
			newMinute
		);
	}

	function setPeriod(
		period: 'AM' | 'PM'
	) {
		let newHour =
			hour;

		if (
			period === 'AM' &&
			hour >= 12
		) {
			newHour =
				hour - 12;
		}

		if (
			period === 'PM' &&
			hour < 12
		) {
			newHour =
				hour + 12;
		}

		onchange(
			newHour,
			minute
		);
	}

	function handleWheel(
		event: WheelEvent
	) {
		event.preventDefault();

		if (
			event.deltaY < 0
		) {
			increase();
		} else {
			decrease();
		}
	}

	let progress =
		$derived(
			activePart ===
				'hour'
				? (
					(
						getDisplayHour() %
						12
					) /
					12
				) * 100

				: (
					minute /
					60
				) * 100
		);
</script>

<div
	class="time-picker"
	onwheel={handleWheel}
>

	<div
		class="progress-ring"
		style={`--progress: ${progress * 3.6}deg`}
	>

		<div class="inner-ring">

			<button
				type="button"
				class="adjust-button"
				aria-label="Increase time"
				onclick={increase}
			>
				<Plus
					size={19}
					strokeWidth={1.8}
				/>
			</button>

			<div class="time-display">

				<div class="time-values">

					<button
						type="button"
						class="time-part"
						class:active={
							activePart ===
							'hour'
						}
						onclick={() =>
							activePart =
								'hour'
						}
					>
						{getDisplayHour()
							.toString()
							.padStart(
								2,
								'0'
							)}
					</button>

					<span class="colon">
						:
					</span>

					<button
						type="button"
						class="time-part"
						class:active={
							activePart ===
							'minute'
						}
						onclick={() =>
							activePart =
								'minute'
						}
					>
						{minute
							.toString()
							.padStart(
								2,
								'0'
							)}
					</button>

				</div>

				<div class="period-selector">

					<button
						type="button"
						class:active={
							getPeriod() ===
							'AM'
						}
						onclick={() =>
							setPeriod(
								'AM'
							)
						}
					>
						AM
					</button>

					<button
						type="button"
						class:active={
							getPeriod() ===
							'PM'
						}
						onclick={() =>
							setPeriod(
								'PM'
							)
						}
					>
						PM
					</button>

				</div>

			</div>

			<button
				type="button"
				class="adjust-button"
				aria-label="Decrease time"
				onclick={decrease}
			>
				<Minus
					size={19}
					strokeWidth={1.8}
				/>
			</button>

		</div>

	</div>

	<p class="hint">
		Select hour or minute · scroll to adjust
	</p>

</div>

<style>
	.time-picker {
		display: flex;

		flex-direction:
			column;

		align-items: center;
	}

	.progress-ring {
		--progress: 0deg;

		width:
			clamp(
				190px,
				43vw,
				245px
			);

		aspect-ratio: 1;

		padding: 4px;

		border-radius: 50%;

		background:
			conic-gradient(
				var(--accent)
					0deg
					var(--progress),

				rgba(
					255,
					255,
					255,
					0.07
				)
					var(--progress)
					360deg
			);

		box-shadow:
			0 0 35px
				rgba(
					121,
					232,
					208,
					0.08
				);
	}

	.inner-ring {
		width: 100%;
		height: 100%;

		display: flex;

		flex-direction:
			column;

		align-items: center;

		justify-content:
			space-between;

		padding:
			17px 0;

		border-radius: 50%;

		background:
			radial-gradient(
				circle at 50% 35%,
				rgba(
					255,
					255,
					255,
					0.08
				),

				rgba(
					8,
					13,
					22,
					0.95
				)
					68%
			);

		border:
			1px solid
			rgba(
				255,
				255,
				255,
				0.1
			);

		box-shadow:
			inset 0 0 35px
				rgba(
					0,
					0,
					0,
					0.35
				);
	}

	.adjust-button {
		width: 34px;
		height: 34px;

		display: grid;

		place-items: center;

		padding: 0;

		flex-shrink: 0;

		border:
			1px solid
			rgba(
				255,
				255,
				255,
				0.1
			);

		border-radius: 50%;

		background:
			rgba(
				255,
				255,
				255,
				0.055
			);

		color:
			rgba(
				255,
				255,
				255,
				0.65
			);

		cursor: pointer;

		transition:
			transform 150ms ease,
			background 150ms ease;
	}

	.adjust-button:hover {
		background:
			rgba(
				255,
				255,
				255,
				0.1
			);

		transform:
			scale(1.08);
	}

	.adjust-button:active {
		transform:
			scale(0.92);
	}

	.time-display {
		display: flex;

		flex-direction:
			column;

		align-items: center;

		gap: 8px;
	}

	.time-values {
		display: flex;

		align-items: center;

		justify-content:
			center;

		gap: 3px;
	}

	.time-part {
		position: relative;

		min-width: 62px;

		padding:
			3px 4px 6px;

		border: none;

		border-bottom:
			2px solid
			transparent;

		background:
			transparent;

		color:
			rgba(
				255,
				255,
				255,
				0.48
			);

		font-size:
			clamp(
				2.6rem,
				8vw,
				4rem
			);

		font-weight: 250;

		line-height: 1;

		letter-spacing:
			-0.06em;

		cursor: pointer;

		transition:
			color 180ms ease,
			border-color 180ms ease,
			text-shadow 180ms ease;
	}

	.time-part.active {
		color: white;

		border-bottom-color:
			var(--accent);

		text-shadow:
			0 0 22px
				rgba(
					121,
					232,
					208,
					0.12
				);
	}

	.colon {
		margin-top: -5px;

		font-size:
			2.6rem;

		font-weight: 200;

		color:
			rgba(
				255,
				255,
				255,
				0.5
			);
	}

	.period-selector {
		display: flex;

		gap: 5px;

		padding: 3px;

		border-radius: 999px;

		background:
			rgba(
				255,
				255,
				255,
				0.045
			);
	}

	.period-selector button {
		padding:
			5px 10px;

		border: none;

		border-radius: 999px;

		background:
			transparent;

		color:
			rgba(
				255,
				255,
				255,
				0.35
			);

		font-size:
			0.58rem;

		font-weight: 700;

		letter-spacing:
			0.08em;

		cursor: pointer;
	}

	.period-selector button.active {
		background:
			rgba(
				121,
				232,
				208,
				0.13
			);

		color:
			var(--accent);
	}

	.hint {
		margin:
			9px 0 0;

		font-size:
			0.56rem;

		color:
			rgba(
				255,
				255,
				255,
				0.3
			);
	}
</style>