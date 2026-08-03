import {
	writable,
	get
} from 'svelte/store';

import type {
	Alarm
} from '$lib/types/alarm';

import {
	selectedAlarm
} from '$lib/stores/alarmStore';

export const alarmDraft =
	writable<Alarm | null>(null);

export function createEmptyAlarm(): Alarm {
	return {
		id: crypto.randomUUID(),

		title: 'New Alarm',

		hour: 7,
		minute: 0,

		enabled: true,

		status: 'ACTIVE',

		type: 'WAKE',

		repeatDays: [],

		sound: 'Gentle Morning',

		volume: 70,

		snooze: {
			durationMinutes: 10,
			maxCount: 3,
			currentCount: 0
		},

		notes: ''
	};
}

export function initializeAlarmDraft(
	force = false
) {
	const existingDraft = get(alarmDraft);

	if (
		existingDraft &&
		!force
	) {
		return;
	}

	const alarm = get(selectedAlarm);

	if (alarm) {
		alarmDraft.set(
			structuredClone(alarm)
		);

		return;
	}

	alarmDraft.set(
		createEmptyAlarm()
	);
}

export function clearAlarmDraft() {
	alarmDraft.set(null);
}