export interface AlarmSound {
	id: string;
	name: string;
	description: string;
	frequency: number;
	isFavorite: boolean;
}

export const alarmSounds: AlarmSound[] = [
	{
		id: 'gentle-morning',
		name: 'Gentle Morning',
		description: 'Soft and calm',
		frequency: 440,
		isFavorite: true
	},
	{
		id: 'sunrise',
		name: 'Sunrise',
		description: 'Warm and gradual',
		frequency: 523.25,
		isFavorite: true
	},
	{
		id: 'soft-bells',
		name: 'Soft Bells',
		description: 'Light bell tone',
		frequency: 659.25,
		isFavorite: false
	},
	{
		id: 'digital',
		name: 'Digital',
		description: 'Clear electronic tone',
		frequency: 784,
		isFavorite: false
	},
	{
		id: 'classic-alarm',
		name: 'Classic Alarm',
		description: 'Strong wake-up tone',
		frequency: 880,
		isFavorite: false
	}
];