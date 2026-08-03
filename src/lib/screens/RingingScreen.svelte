<script lang="ts">
	import {
		AlarmClock,
		Bell,
		Pill,
		CalendarClock,
		Sparkles,
		Moon,
		X
	} from '@lucide/svelte';

	import {
	activeAlarm,
	snoozeCount,
	snoozeAlarm,
	stopRinging,
	clearPendingSnooze,
	hasReachedMaxSnooze
} from '$lib/stores/ringingStore';

	import {
    	disableAlarm
    } from '$lib/stores/alarmStore';
    
    import {
		navigate
	} from '$lib/stores/navigationStore';

	function getDisplayHour(
		hour: number
	) {
		const value =
			hour % 12;

		return value === 0
			? 12
			: value;
	}

	function getPeriod(
		hour: number
	) {
		return hour >= 12
			? 'PM'
			: 'AM';
	}

	function getTypeLabel() {
		if (!$activeAlarm) {
			return '';
		}

		const labels = {
			WAKE: 'Wake Up',
			REMINDER: 'Reminder',
			MEDICATION: 'Medication',
			MEETING: 'Meeting',
			CUSTOM: 'Custom'
		};

		return labels[
			$activeAlarm.type
		];
	}

	function handleSnooze() {

	console.log("SNOOZE CLICKED");

	if (!$activeAlarm) {
		return;
	}

	const success =
		snoozeAlarm($activeAlarm);

	console.log("Success:", success);

	if (!success) {
		return;
	}

	navigate("home");
}
	function dismissAlarm() {
    	if (!$activeAlarm) {
        	return;
        }

	    const alarm =
        	$activeAlarm;

	/*
		Empty repeatDays means
		this is a one-time alarm.

		Disable it after dismissal.
	*/
	if (
		alarm.repeatDays.length === 0
	) {
		disableAlarm(
			alarm.id
		);
	}

	clearPendingSnooze();

stopRinging();

navigate('home');
}
</script>

<div class="ringing-screen">

	{#if $activeAlarm}

		<div class="pulse pulse-one">
		</div>

		<div class="pulse pulse-two">
		</div>

		<div class="content">

			<div class="alarm-type-icon">

				{#if $activeAlarm.type === 'WAKE'}

					<AlarmClock
						size={25}
						strokeWidth={1.6}
					/>

				{:else if $activeAlarm.type === 'REMINDER'}

					<Bell
						size={25}
						strokeWidth={1.6}
					/>

				{:else if $activeAlarm.type === 'MEDICATION'}

					<Pill
						size={25}
						strokeWidth={1.6}
					/>

				{:else if $activeAlarm.type === 'MEETING'}

					<CalendarClock
						size={25}
						strokeWidth={1.6}
					/>

				{:else}

					<Sparkles
						size={25}
						strokeWidth={1.6}
					/>

				{/if}

			</div>

			<span class="ringing-label">
				ALARM
			</span>

			<div class="time">

				<span class="time-value">

					{getDisplayHour(
						$activeAlarm.hour
					)
						.toString()
						.padStart(
							2,
							'0'
						)}

					:

					{$activeAlarm.minute
						.toString()
						.padStart(
							2,
							'0'
						)}

				</span>

				<span class="period">
					{getPeriod(
						$activeAlarm.hour
					)}
				</span>

			</div>

			<div class="alarm-info">

				<h1>
					{$activeAlarm.title}
				</h1>

				<p>
					{getTypeLabel()}
				</p>

			</div>

			<div class="actions">

				<button
                	type="button"
                    class="snooze-button"
                    class:disabled={
                    	hasReachedMaxSnooze(
	$activeAlarm
)
                    }
	                disabled={
                    	hasReachedMaxSnooze(
	$activeAlarm
)
                    }
                    onclick={handleSnooze}
                >

					<Moon
                    	size={19}
                        strokeWidth={1.8}
                    />

                    <div>

                    	<strong>
		{#if (
			$snoozeCount >=
			$activeAlarm
				.snooze
				.maxCount
		)}
			Snooze limit reached
		{:else}
			Snooze
		{/if}
	</strong>

	<span>
		{#if !hasReachedMaxSnooze($activeAlarm)}
			{$activeAlarm
				.snooze
				.durationMinutes}
			min
			·
			{$snoozeCount}
			/
			{$activeAlarm
				.snooze
				.maxCount}
		{:else}
			Dismiss alarm
		{/if}
	</span>

</div>

				</button>

				<button
					type="button"
					class="dismiss-button"
					onclick={dismissAlarm}
				>

					<X
						size={18}
						strokeWidth={2}
					/>

					<span>
						Dismiss
					</span>

				</button>

			</div>

		</div>

	{/if}

</div>

<style>
	.ringing-screen {
		position: relative;

		width: 100%;
		height: 100%;

		overflow: hidden;

		background:
			radial-gradient(
				circle at 50% 45%,
				rgba(
					121,
					232,
					208,
					0.12
				),
				transparent 43%
			);
	}

	.content {
		position: relative;

		z-index: 3;

		width: 100%;
		height: 100%;

		display: flex;

		flex-direction: column;

		align-items: center;
		justify-content: center;

		padding:
			12% 18%;

		text-align: center;
	}

	.snooze-button:disabled,
    .snooze-button.disabled {
    	opacity: 0.4;

        cursor: not-allowed;

        transform: none;
    }
    
    .alarm-type-icon {
		width: 54px;
		height: 54px;

		display: grid;
		place-items: center;

		margin-bottom: 8px;

		border:
			1px solid
			rgba(
				121,
				232,
				208,
				0.24
			);

		border-radius: 50%;

		background:
			rgba(
				121,
				232,
				208,
				0.09
			);

		color:
			var(--accent);

		box-shadow:
			0 0 28px
			rgba(
				121,
				232,
				208,
				0.12
			);

		animation:
			iconPulse
			1.8s ease-in-out
			infinite;
	}

	.ringing-label {
		font-size: 0.55rem;

		font-weight: 700;

		letter-spacing:
			0.2em;

		color:
			var(--accent);
	}

	.time {
		display: flex;

		align-items: baseline;

		justify-content: center;

		gap: 8px;

		margin-top: 5px;
	}

	.time-value {
		font-size:
			clamp(
				3rem,
				10vw,
				4.6rem
			);

		font-weight: 220;

		line-height: 1;

		letter-spacing:
			-0.06em;

		color: white;

		text-shadow:
			0 0 30px
			rgba(
				255,
				255,
				255,
				0.08
			);
	}

	.period {
		font-size: 0.72rem;

		font-weight: 600;

		color:
			var(--text-secondary);
	}

	.alarm-info {
		margin-top: 11px;
	}

	.alarm-info h1 {
		margin: 0;

		max-width: 260px;

		overflow: hidden;

		font-size: 1.1rem;

		font-weight: 500;

		white-space: nowrap;

		text-overflow:
			ellipsis;
	}

	.alarm-info p {
		margin:
			4px 0 0;

		font-size: 0.6rem;

		color:
			var(--text-secondary);
	}

	.actions {
		width: 82%;

		display: flex;

		flex-direction: column;

		gap: 8px;

		margin-top: 21px;
	}

	.snooze-button {
		width: 100%;

		display: flex;

		align-items: center;
		justify-content: center;

		gap: 9px;

		padding:
			11px 16px;

		border:
			1px solid
			rgba(
				121,
				232,
				208,
				0.3
			);

		border-radius: 999px;

		background:
			linear-gradient(
				135deg,
				rgba(
					121,
					232,
					208,
					0.18
				),
				rgba(
					121,
					232,
					208,
					0.07
				)
			);

		color:
			var(--accent);

		cursor: pointer;

		box-shadow:
			0 0 25px
			rgba(
				121,
				232,
				208,
				0.08
			);
	}

	.snooze-button div {
		display: flex;

		align-items: baseline;

		gap: 5px;
	}

	.snooze-button strong {
		font-size: 0.7rem;

		font-weight: 600;
	}

	.snooze-button span {
		font-size: 0.53rem;

		color:
			rgba(
				121,
				232,
				208,
				0.65
			);
	}

	.dismiss-button {
		width: 100%;

		display: flex;

		align-items: center;
		justify-content: center;

		gap: 7px;

		padding:
			10px 16px;

		border:
			1px solid
			rgba(
				255,
				255,
				255,
				0.1
			);

		border-radius: 999px;

		background:
			rgba(
				255,
				255,
				255,
				0.045
			);

		color:
			rgba(
				255,
				255,
				255,
				0.65
			);

		cursor: pointer;
	}

	.dismiss-button span {
		font-size: 0.65rem;

		font-weight: 500;
	}

	.pulse {
		position: absolute;

		top: 50%;
		left: 50%;

		width: 230px;
		height: 230px;

		border:
			1px solid
			rgba(
				121,
				232,
				208,
				0.15
			);

		border-radius: 50%;

		pointer-events: none;

		transform:
			translate(
				-50%,
				-50%
			);

		animation:
			ringPulse
			2.4s ease-out
			infinite;
	}

	.pulse-two {
		animation-delay:
			1.2s;
	}

	@keyframes ringPulse {
		0% {
			opacity: 0.7;

			transform:
				translate(
					-50%,
					-50%
				)
				scale(0.65);
		}

		100% {
			opacity: 0;

			transform:
				translate(
					-50%,
					-50%
				)
				scale(1.65);
		}
	}

	@keyframes iconPulse {
		0%,
		100% {
			transform:
				scale(1);

			box-shadow:
				0 0 20px
				rgba(
					121,
					232,
					208,
					0.08
				);
		}

		50% {
			transform:
				scale(1.06);

			box-shadow:
				0 0 34px
				rgba(
					121,
					232,
					208,
					0.2
				);
		}
	}
</style>