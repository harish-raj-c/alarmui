export type AlarmStatus =
	| 'ACTIVE'
	| 'SNOOZED'
	| 'TRIGGERED'
	| 'INACTIVE';

export type AlarmType =
	| 'WAKE'
	| 'REMINDER'
	| 'MEDICATION'
	| 'MEETING'
	| 'CUSTOM';

export interface SnoozeConfig {
	durationMinutes: number;
	maxCount: number;
	currentCount: number;
}

export interface Alarm {
	id: string;

	title: string;

	hour: number;
	minute: number;

	enabled: boolean;

	status: AlarmStatus;
	type: AlarmType;

	repeatDays: number[];

	sound: string;
	volume: number;

	snooze: SnoozeConfig;

	notes?: string;
}