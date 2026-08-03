import { writable } from 'svelte/store';

export type Screen =
	| 'home'
	| 'alarms'
	| 'editor'
	| 'repeat'
	| 'sound'
	| 'snooze'
	| 'type'
	| 'ringing'
	| 'settings';

export const currentScreen =
	writable<Screen>('home');

export function navigate(
	screen: Screen
) {
	currentScreen.set(screen);
}