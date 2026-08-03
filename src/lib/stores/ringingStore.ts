import { writable, get } from 'svelte/store';
import type { Alarm } from '$lib/types/alarm';

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export interface PendingSnooze {
	alarm: Alarm;
	wakeAt: number;
	count: number;
}

/*
|--------------------------------------------------------------------------
| Stores
|--------------------------------------------------------------------------
*/

export const activeAlarm =
	writable<Alarm | null>(null);

export const isAlarmRinging =
	writable(false);

export const pendingSnooze =
	writable<PendingSnooze | null>(null);

export const snoozeCount =
	writable(0);

/*
|--------------------------------------------------------------------------
| Internal State
|--------------------------------------------------------------------------
*/

let currentAlarmId:
	string | null = null;

/*
|--------------------------------------------------------------------------
| Alarm Lifecycle
|--------------------------------------------------------------------------
*/

/*
	Start ringing.

	fromSnooze=false
		New alarm.

	fromSnooze=true
		Existing snoozed alarm.
*/
export function startRinging(
	alarm: Alarm,
	fromSnooze = false
) {
	/*
		New alarm
		----------
		Reset previous snooze state.
	*/
	if (
		!fromSnooze ||
		currentAlarmId !== alarm.id
	) {
		snoozeCount.set(0);

		pendingSnooze.set(null);
	}

	currentAlarmId =
		alarm.id;

	activeAlarm.set(alarm);

	isAlarmRinging.set(true);
}

export function stopRinging() {
	isAlarmRinging.set(false);

	activeAlarm.set(null);
}

/*
|--------------------------------------------------------------------------
| Snooze
|--------------------------------------------------------------------------
*/

export function snoozeAlarm(
	alarm: Alarm,
	testMode = false
){
	const current =
		get(snoozeCount);

	const next =
		current + 1;

	/*
		Max snooze reached.
	*/
	if (
		next >
		alarm.snooze.maxCount
	) {
		return false;
	}

	snoozeCount.set(next);

	const durationMs =
	alarm.snooze.durationMinutes *
	60 *
	1000;

	pendingSnooze.set({
		alarm,
		count: next,
		wakeAt:
			Date.now() +
			durationMs
	});

	stopRinging();

	console.log(
		`Snoozed (${next}/${alarm.snooze.maxCount})`
	);

	return true;
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

export function clearPendingSnooze() {
	pendingSnooze.set(null);

	snoozeCount.set(0);

	currentAlarmId = null;
}

export function removePendingSnooze() {
	pendingSnooze.set(null);
}

export function hasReachedMaxSnooze(
	alarm: Alarm
) {
	return (
		get(
			snoozeCount
		) >=
		alarm.snooze.maxCount
	);
}