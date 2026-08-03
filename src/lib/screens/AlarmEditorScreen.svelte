<script lang="ts">
	import {
		ArrowLeft,
		Check,
		Repeat2,
		Music2,
		TimerReset,
		Tag
	} from '@lucide/svelte';

	import {
		get
	} from 'svelte/store';

	import {
		selectedAlarm,
		createAlarm,
		updateAlarm
	} from '$lib/stores/alarmStore';

	import {
		alarmDraft,
		initializeAlarmDraft,
		clearAlarmDraft
	} from '$lib/stores/alarmEditorStore';

	import {
		navigate
	} from '$lib/stores/navigationStore';

	import {
		getRepeatLabel
	} from '$lib/utils/time';

	import TimePicker
		from '$lib/components/alarm/TimePicker.svelte';

	import AlarmSettingRow
		from '$lib/components/alarm/AlarmSettingRow.svelte';

	let initialized =
		$state(false);

	$effect(() => {
		if (!initialized) {
			initializeAlarmDraft();

			initialized = true;
		}
	});

	let isEditing = $derived(
		$selectedAlarm !== null
	);

	function updateTime(
		hour: number,
		minute: number
	) {
		alarmDraft.update(
			(draft) => {
				if (!draft) {
					return draft;
				}

				return {
					...draft,
					hour,
					minute
				};
			}
		);
	}

	function updateTitle(
		event: Event
	) {
		const target =
			event.currentTarget as
				HTMLInputElement;

		alarmDraft.update(
			(draft) => {
				if (!draft) {
					return draft;
				}

				return {
					...draft,
					title:
						target.value
				};
			}
		);
	}

	function cancel() {
		clearAlarmDraft();

		navigate(
			isEditing
				? 'alarms'
				: 'home'
		);
	}

	function save() {
		const draft =
			get(alarmDraft);

		if (!draft) {
			return;
		}

		const alarmToSave = {
			...draft,

			title:
				draft.title
					.trim()
					.length > 0
					? draft.title.trim()
					: 'Alarm'
		};

		if (isEditing) {
			updateAlarm(
				alarmToSave
			);
		} else {
			createAlarm(
				alarmToSave
			);
		}

		clearAlarmDraft();

		selectedAlarm.set(null);

		navigate('alarms');
	}

	function typeLabel() {
		if (!$alarmDraft) {
			return '';
		}

		const labels = {
			WAKE:
				'Wake Up',

			REMINDER:
				'Reminder',

			MEDICATION:
				'Medication',

			MEETING:
				'Meeting',

			CUSTOM:
				'Custom'
		};

		return labels[
			$alarmDraft.type
		];
	}
</script>

<div class="editor-screen">

	<header>

		<button
			type="button"
			class="header-button"
			aria-label="Cancel"
			onclick={cancel}
		>
			<ArrowLeft
				size={21}
				strokeWidth={1.8}
			/>
		</button>

		<div class="heading">

			<span>
				{isEditing
					? 'EDIT ALARM'
					: 'NEW ALARM'}
			</span>

		</div>

		<button
			type="button"
			class="header-button save"
			aria-label="Save alarm"
			onclick={save}
		>
			<Check
				size={22}
				strokeWidth={2}
			/>
		</button>

	</header>

	{#if $alarmDraft}

		<div class="editor-content">

			<TimePicker
				hour={$alarmDraft.hour}
				minute={$alarmDraft.minute}
				onchange={updateTime}
			/>

			<div class="details">

				<div class="title-field">

					<input
						type="text"
						value={$alarmDraft.title}
						maxlength="40"
						aria-label="Alarm title"
						placeholder="Alarm name"
						oninput={updateTitle}
					/>

				</div>

				<div class="settings-grid">

					<AlarmSettingRow
						icon={Repeat2}
						label="REPEAT"
						value={getRepeatLabel(
							$alarmDraft.repeatDays
						)}
						onclick={() =>
							navigate(
								'repeat'
							)
						}
					/>

					<AlarmSettingRow
						icon={Music2}
						label="SOUND"
						value={
							$alarmDraft.sound
						}
						onclick={() =>
							navigate(
								'sound'
							)
						}
					/>

					<AlarmSettingRow
						icon={TimerReset}
						label="SNOOZE"
						value={`${$alarmDraft.snooze.durationMinutes} min`}
						onclick={() =>
							navigate(
								'snooze'
							)
						}
					/>

					<AlarmSettingRow
						icon={Tag}
						label="TYPE"
						value={typeLabel()}
						onclick={() =>
							navigate(
								'type'
							)
						}
					/>

				</div>

			</div>

		</div>

	{/if}

</div>

<style>
	.editor-screen {
		position: relative;

		width: 100%;
		height: 100%;

		overflow: hidden;
	}

	header {
		position: absolute;

		top: 8%;
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
				0.72
			);

		cursor: pointer;
	}

	.header-button.save {
		color:
			var(--accent);

		border-color:
			rgba(
				121,
				232,
				208,
				0.22
			);

		background:
			rgba(
				121,
				232,
				208,
				0.08
			);
	}

	.heading span {
		font-size:
			0.62rem;

		font-weight: 700;

		letter-spacing:
			0.17em;

		color:
			var(--text-secondary);
	}

	.editor-content {
		position: absolute;

		top: 17%;
		left: 13%;
		right: 13%;
		bottom: 8%;

		overflow-y: auto;

		padding:
			5px 6px 50px;

		scrollbar-width: none;
	}

	.editor-content::-webkit-scrollbar {
		display: none;
	}

	.details {
		width: 82%;

		margin:
			13px auto 0;
	}

	.title-field {
		margin-bottom:
			9px;
	}

	.title-field input {
		width: 100%;

		padding:
			11px 15px;

		border:
			1px solid
			rgba(
				255,
				255,
				255,
				0.1
			);

		border-radius:
			18px;

		outline: none;

		background:
			rgba(
				255,
				255,
				255,
				0.045
			);

		color: white;

		font-size:
			0.78rem;

		text-align: center;

		transition:
			border-color
				160ms ease,
			background
				160ms ease;
	}

	.title-field input::placeholder {
		color:
			rgba(
				255,
				255,
				255,
				0.28
			);
	}

	.title-field input:focus {
		border-color:
			rgba(
				121,
				232,
				208,
				0.3
			);

		background:
			rgba(
				255,
				255,
				255,
				0.07
			);
	}

	.settings-grid {
		display: grid;

		grid-template-columns:
			1fr 1fr;

		gap: 7px;
	}
</style>