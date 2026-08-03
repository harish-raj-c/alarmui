import {
	writable,
	derived
} from 'svelte/store';

import type {
	Alarm
} from '$lib/types/alarm';

const STORAGE_KEY =
	'alarm-ui-alarms';

const initialAlarms: Alarm[] = [
	{
		id: '1',
		title: 'Morning Alarm',
		hour: 6,
		minute: 30,
		enabled: true,
		status: 'ACTIVE',
		type: 'WAKE',
		repeatDays: [1, 2, 3, 4, 5],
		sound: 'Gentle Morning',
		volume: 70,
		snooze: {
			durationMinutes: 10,
			maxCount: 3,
			currentCount: 0
		},
		notes: ''
	},
	{
		id: '2',
		title: 'Medication',
		hour: 8,
		minute: 0,
		enabled: true,
		status: 'ACTIVE',
		type: 'MEDICATION',
		repeatDays: [0, 1, 2, 3, 4, 5, 6],
		sound: 'Soft Bells',
		volume: 60,
		snooze: {
			durationMinutes: 5,
			maxCount: 2,
			currentCount: 0
		},
		notes: ''
	},
	{
		id: '3',
		title: 'Team Meeting',
		hour: 10,
		minute: 30,
		enabled: false,
		status: 'INACTIVE',
		type: 'MEETING',
		repeatDays: [1, 3, 5],
		sound: 'Digital',
		volume: 65,
		snooze: {
			durationMinutes: 10,
			maxCount: 1,
			currentCount: 0
		},
		notes: ''
	}
];

function saveAlarms(
	alarms: Alarm[]
) {
	if (
		typeof window ===
		'undefined'
	) {
		return;
	}

	try {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify(alarms)
		);
	} catch (error) {
		console.error(
			'Failed to save alarms:',
			error
		);
	}
}

function createAlarmStore() {
	const {
		subscribe,
		set,
		update
	} = writable<Alarm[]>(
		initialAlarms
	);

	let initialized = false;

	return {
		subscribe,

		initialize() {
			if (
				initialized ||
				typeof window ===
					'undefined'
			) {
				return;
			}

			initialized = true;

			try {
				const saved =
					localStorage.getItem(
						STORAGE_KEY
					);

				if (!saved) {
					saveAlarms(
						initialAlarms
					);

					return;
				}

				const parsed =
					JSON.parse(saved);

				if (
					Array.isArray(parsed)
				) {
					set(
						parsed as Alarm[]
					);
				}
			} catch (error) {
				console.error(
					'Failed to load alarms:',
					error
				);

				set(initialAlarms);
			}
		},

		set(alarms: Alarm[]) {
			set(alarms);

			saveAlarms(alarms);
		},

		add(alarm: Alarm) {
			update((alarms) => {
				const updated = [
					...alarms,
					alarm
				];

				saveAlarms(updated);

				return updated;
			});
		},

		updateAlarm(
			updatedAlarm: Alarm
		) {
			update((alarms) => {
				const updated =
					alarms.map(
						(alarm) =>
							alarm.id ===
							updatedAlarm.id
								? updatedAlarm
								: alarm
					);

				saveAlarms(updated);

				return updated;
			});
		},

		toggle(id: string) {
	update((alarms): Alarm[] => {
		const updated: Alarm[] =
			alarms.map((alarm): Alarm => {
				if (alarm.id !== id) {
					return alarm;
				}

				const enabled =
					!alarm.enabled;

				return {
					...alarm,
					enabled,
					status: enabled
						? 'ACTIVE'
						: 'INACTIVE'
				};
			});

		saveAlarms(updated);

		return updated;
	});
},

disable(id: string) {
	update((alarms): Alarm[] => {
		const updated: Alarm[] =
			alarms.map(
				(alarm): Alarm => {
					if (
						alarm.id !== id
					) {
						return alarm;
					}

					return {
						...alarm,
						enabled: false,
						status:
							'INACTIVE'
					};
				}
			);

		saveAlarms(updated);

		return updated;
	});
},

		remove(id: string) {
			update((alarms) => {
				const updated =
					alarms.filter(
						(alarm) =>
							alarm.id !== id
					);

				saveAlarms(updated);

				return updated;
			});
		},

		reset() {
			set(initialAlarms);

			saveAlarms(
				initialAlarms
			);
		}
	};
}

export const alarms =
	createAlarmStore();

export const selectedAlarm =
	writable<Alarm | null>(null);

export const nextAlarm =
	derived(
		alarms,
		($alarms) => {
			const enabledAlarms =
				$alarms.filter(
					(alarm) =>
						alarm.enabled
				);

			return (
				enabledAlarms[0] ??
				null
			);
		}
	);

export function createAlarm(
	alarm: Alarm
) {
	alarms.add(alarm);
}

export function updateAlarm(
	alarm: Alarm
) {
	alarms.updateAlarm(alarm);
}

export function toggleAlarm(
	id: string
) {
	alarms.toggle(id);
}

export function disableAlarm(
	id: string
) {
	alarms.disable(id);
}

export function deleteAlarm(
	id: string
) {
	alarms.remove(id);
}