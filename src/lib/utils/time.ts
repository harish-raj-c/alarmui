import type { Alarm } from '$lib/types/alarm';

export function formatTime(
	hour: number,
	minute: number
) {
	const period = hour >= 12 ? 'PM' : 'AM';

	const displayHour =
		hour % 12 === 0
			? 12
			: hour % 12;

	const displayMinute =
		minute
			.toString()
			.padStart(2, '0');

	return {
		time: `${displayHour}:${displayMinute}`,
		period
	};
}

export function getRepeatLabel(
	repeatDays: number[]
) {
	if (repeatDays.length === 0) {
		return 'Once';
	}

	if (repeatDays.length === 7) {
		return 'Every day';
	}

	const weekdays = [1, 2, 3, 4, 5];
	const weekends = [0, 6];

	const isWeekdays =
		weekdays.every((day) =>
			repeatDays.includes(day)
		) &&
		repeatDays.length === 5;

	const isWeekends =
		weekends.every((day) =>
			repeatDays.includes(day)
		) &&
		repeatDays.length === 2;

	if (isWeekdays) {
		return 'Weekdays';
	}

	if (isWeekends) {
		return 'Weekends';
	}

	const names = [
		'Sun',
		'Mon',
		'Tue',
		'Wed',
		'Thu',
		'Fri',
		'Sat'
	];

	return repeatDays
		.map((day) => names[day])
		.join(', ');
}

export function getNextAlarm(
	alarms: Alarm[]
): Alarm | null {
	const enabledAlarms =
		alarms.filter(
			(alarm) => alarm.enabled
		);

	if (enabledAlarms.length === 0) {
		return null;
	}

	const now = new Date();

	const currentMinutes =
		now.getHours() * 60 +
		now.getMinutes();

	return (
		[...enabledAlarms]
			.sort((a, b) => {
				const aMinutes =
					a.hour * 60 +
					a.minute;

				const bMinutes =
					b.hour * 60 +
					b.minute;

				let aDifference =
					aMinutes -
					currentMinutes;

				let bDifference =
					bMinutes -
					currentMinutes;

				if (aDifference < 0) {
					aDifference += 1440;
				}

				if (bDifference < 0) {
					bDifference += 1440;
				}

				return (
					aDifference -
					bDifference
				);
			})[0] ?? null
	);
}