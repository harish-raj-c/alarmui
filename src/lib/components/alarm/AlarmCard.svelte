<script lang="ts">
	import {
		AlarmClock,
		Pill,
		CalendarClock,
		Bell,
		Sparkles,
		Trash2
	} from '@lucide/svelte';

	import type {
		Alarm,
		AlarmType
	} from '$lib/types/alarm';

	import Toggle
		from '$lib/components/common/Toggle.svelte';

	import {
		formatTime,
		getRepeatLabel
	} from '$lib/utils/time';

	let {
		alarm,
		onopen,
		ontoggle,
		ondelete
	}: {
		alarm: Alarm;
		onopen: () => void;
		ontoggle: () => void;
		ondelete: () => void;
	} = $props();

	let formatted = $derived(
		formatTime(
			alarm.hour,
			alarm.minute
		)
	);

	function getTypeIcon(
		type: AlarmType
	) {
		switch (type) {
			case 'WAKE':
				return AlarmClock;

			case 'MEDICATION':
				return Pill;

			case 'MEETING':
				return CalendarClock;

			case 'CUSTOM':
				return Sparkles;

			default:
				return Bell;
		}
	}

	let TypeIcon = $derived(
		getTypeIcon(alarm.type)
	);

	function deleteAlarm(
		event: MouseEvent
	) {
		event.stopPropagation();

		ondelete();
	}
</script>

<div
	class="alarm-card"
	class:disabled={!alarm.enabled}
	role="button"
	tabindex="0"
	onclick={onopen}
	onkeydown={(event) => {
		if (
			event.key === 'Enter' ||
			event.key === ' '
		) {
			onopen();
		}
	}}
>
	<div class="type-icon">
		<TypeIcon
			size={19}
			strokeWidth={1.7}
		/>
	</div>

	<div class="alarm-content">

		<div class="time-row">

			<span class="time">
				{formatted.time}
			</span>

			<span class="period">
				{formatted.period}
			</span>

		</div>

		<div class="title">
			{alarm.title}
		</div>

		<div class="repeat">
			{getRepeatLabel(
				alarm.repeatDays
			)}
		</div>

	</div>

	<div class="actions">

		<Toggle
			checked={alarm.enabled}
			label={`Toggle ${alarm.title}`}
			onchange={ontoggle}
		/>

		<button
			type="button"
			class="delete-button"
			aria-label={`Delete ${alarm.title}`}
			onclick={deleteAlarm}
		>
			<Trash2
				size={16}
				strokeWidth={1.7}
			/>
		</button>

	</div>
</div>

<style>
	.alarm-card {
		width: 100%;

		display: grid;

		grid-template-columns:
			auto 1fr auto;

		align-items: center;

		gap: 12px;

		padding:
			13px 15px;

		border:
			1px solid
			rgba(255, 255, 255, 0.11);

		border-radius: 22px;

		background:
			linear-gradient(
				135deg,
				rgba(255, 255, 255, 0.09),
				rgba(255, 255, 255, 0.035)
			);

		color: inherit;

		text-align: left;

		backdrop-filter:
			blur(20px);

		cursor: pointer;

		transition:
			transform 180ms ease,
			background 180ms ease,
			opacity 180ms ease;

        outline: none;
	}

	.alarm-card:hover {
		transform:
			translateY(-1px);

		background:
			linear-gradient(
				135deg,
				rgba(255, 255, 255, 0.13),
				rgba(255, 255, 255, 0.05)
			);
	}

	.alarm-card.disabled {
		opacity: 0.46;
	}

	.type-icon {
		width: 40px;
		height: 40px;

		display: grid;
		place-items: center;

		border-radius: 50%;

		color:
			var(--accent);

		background:
			rgba(121, 232, 208, 0.08);

		border:
			1px solid
			rgba(121, 232, 208, 0.14);
	}

	.alarm-content {
		min-width: 0;
	}

	.time-row {
		display: flex;

		align-items: baseline;

		gap: 4px;
	}

	.time {
		font-size: 1.45rem;

		font-weight: 400;

		letter-spacing:
			-0.035em;
	}

	.period {
		font-size: 0.58rem;

		font-weight: 600;

		color:
			var(--text-secondary);
	}

	.title {
		margin-top: 2px;

		overflow: hidden;

		font-size: 0.72rem;

		font-weight: 500;

		white-space: nowrap;

		text-overflow: ellipsis;
	}

	.repeat {
		margin-top: 3px;

		font-size: 0.6rem;

		color:
			var(--text-secondary);
	}

	.actions {
		display: flex;

		flex-direction: column;

		align-items: center;

		gap: 8px;
	}

	.delete-button {
		width: 28px;
		height: 28px;

		display: grid;
		place-items: center;

		padding: 0;

		border: none;

		border-radius: 50%;

		background: transparent;

		color:
			rgba(255, 255, 255, 0.3);

		cursor: pointer;

		transition:
			background 180ms ease,
			color 180ms ease;
	}

	.delete-button:hover {
		color:
			var(--danger);

		background:
			rgba(255, 107, 122, 0.1);
	}
</style>