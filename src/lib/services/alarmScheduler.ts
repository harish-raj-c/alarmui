import { get } from 'svelte/store';

import { alarms } from '$lib/stores/alarmStore';

import {
	isAlarmRinging,
	pendingSnooze,
	startRinging,
	removePendingSnooze
} from '$lib/stores/ringingStore';

import { navigate } from '$lib/stores/navigationStore';

import type { Alarm } from '$lib/types/alarm';

const CHECK_INTERVAL = 1000;

let timer: ReturnType<typeof setInterval> | null =
	null;

/*
|--------------------------------------------------------------------------
| Prevent duplicate alarms
|--------------------------------------------------------------------------
*/

const triggeredKeys =
	new Set<string>();

function buildKey(
	alarm: Alarm,
	now: Date
) {
	return [
		alarm.id,
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		now.getHours(),
		now.getMinutes()
	].join('-');
}

/*
|--------------------------------------------------------------------------
| Repeat day
|--------------------------------------------------------------------------
*/

function repeatMatches(
	alarm: Alarm,
	now: Date
) {
	if (
		alarm.repeatDays.length === 0
	) {
		return true;
	}

	return alarm.repeatDays.includes(
		now.getDay()
	);
}

/*
|--------------------------------------------------------------------------
| Regular alarms
|--------------------------------------------------------------------------
*/

function triggerRegularAlarm() {
	const now =
		new Date();

	if (
		get(isAlarmRinging)
	) {
		return;
	}

	const list =
		get(alarms);

	for (const alarm of list) {
		if (
			!alarm.enabled
		)
			continue;

		if (
			alarm.hour !==
			now.getHours()
		)
			continue;

		if (
			alarm.minute !==
			now.getMinutes()
		)
			continue;

		if (
			!repeatMatches(
				alarm,
				now
			)
		)
			continue;

		const key =
			buildKey(
				alarm,
				now
			);

		if (
			triggeredKeys.has(
				key
			)
		)
			continue;

		triggeredKeys.add(
			key
		);

		console.log(
			'Alarm:',
			alarm.title
		);

		startRinging(
			alarm
		);

		navigate(
			'ringing'
		);

		break;
	}
}

/*
|--------------------------------------------------------------------------
| Snoozed alarm
|--------------------------------------------------------------------------
*/

function triggerPendingSnooze() {
	if (
		get(isAlarmRinging)
	)
		return;

	const pending =
		get(
			pendingSnooze
		);

	if (!pending)
		return;

	if (
		Date.now() <
		pending.wakeAt
	)
		return;

	console.log(
		'Snooze:',
		pending.alarm.title
	);

	removePendingSnooze();

	startRinging(
		pending.alarm,
		true
	);

	navigate(
		'ringing'
	);
}

/*
|--------------------------------------------------------------------------
| Cleanup
|--------------------------------------------------------------------------
*/

function cleanup() {
	if (
		triggeredKeys.size >
		150
	) {
		triggeredKeys.clear();
	}
}

/*
|--------------------------------------------------------------------------
| Main Loop
|--------------------------------------------------------------------------
*/

function tick() {
	triggerPendingSnooze();

	triggerRegularAlarm();

	cleanup();
}

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

export function startAlarmScheduler() {
	if (
		typeof window ===
		'undefined'
	)
		return;

	if (timer)
		return;

	console.log(
		'Alarm Scheduler Started'
	);

	tick();

	timer =
		setInterval(
			tick,
			CHECK_INTERVAL
		);
}

export function stopAlarmScheduler() {
	if (!timer)
		return;

	clearInterval(
		timer
	);

	timer = null;

	console.log(
		'Alarm Scheduler Stopped'
	);
}