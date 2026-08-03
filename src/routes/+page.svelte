<script lang="ts">
    
	import {
		onMount
	} from 'svelte';

    import {
		alarms
	} from '$lib/stores/alarmStore';

	import {
		startAlarmScheduler,
	    stopAlarmScheduler
    } from '$lib/services/alarmScheduler';

	import CircularDisplay
		from '$lib/components/device/CircularDisplay.svelte';

	import HomeScreen
		from '$lib/screens/HomeScreen.svelte';

	import AlarmListScreen
		from '$lib/screens/AlarmListScreen.svelte';

	import AlarmEditorScreen
		from '$lib/screens/AlarmEditorScreen.svelte';

	import RingingScreen
		from '$lib/screens/RingingScreen.svelte';
	
	import RepeatScreen
		from '$lib/screens/RepeatScreen.svelte';

	import SoundScreen
		from '$lib/screens/SoundScreen.svelte';

	import SnoozeScreen
		from '$lib/screens/SnoozeScreen.svelte';

	import AlarmTypeScreen
		from '$lib/screens/AlarmTypeScreen.svelte';

	
	import SettingsScreen
		from '$lib/screens/SettingsScreen.svelte';

	import {
		currentScreen
	} from '$lib/stores/navigationStore';

	onMount(() => {
	/*
		Load saved alarms first.
	*/
	alarms.initialize();

	/*
		Start checking alarm times.
	*/
	startAlarmScheduler();

	/*
		Stop the interval if this page
		is destroyed.
	*/
	return () => {
		stopAlarmScheduler();
	};
});

</script>

<CircularDisplay>

	{#if $currentScreen === 'home'}

		<HomeScreen />

	{:else if $currentScreen === 'alarms'}

		<AlarmListScreen />

	{:else if $currentScreen === 'editor'}

		<AlarmEditorScreen />

	{:else if $currentScreen === 'repeat'}

		<RepeatScreen />

	{:else if $currentScreen === 'sound'}

		<SoundScreen />

	{:else if $currentScreen === 'snooze'}

		<SnoozeScreen />

	{:else if $currentScreen === 'type'}

		<AlarmTypeScreen />

	{:else if $currentScreen === 'ringing'}

		<RingingScreen />
	
	{:else if $currentScreen === 'settings'}

		<SettingsScreen />

	{:else}

		<HomeScreen />

	{/if}

</CircularDisplay>