<script lang="ts">
	import {
		ArrowLeft,
		Plus,
		AlarmClock
	} from '@lucide/svelte';

	import {
		get
	} from 'svelte/store';
	
	import {
		alarms,
		selectedAlarm,
		toggleAlarm,
		deleteAlarm
	} from '$lib/stores/alarmStore';

	import {
		startRinging
	} from '$lib/stores/ringingStore';

	
	import {
		navigate
	} from '$lib/stores/navigationStore';

	import type {
		Alarm
	} from '$lib/types/alarm';

	import AlarmCard
		from '$lib/components/alarm/AlarmCard.svelte';

	import ConfirmDialog
		from '$lib/components/common/ConfirmDialog.svelte';

	let alarmToDelete =
		$state<Alarm | null>(null);

	function goBack() {
		navigate('home');
	}

	function createNewAlarm() {
		selectedAlarm.set(null);

		navigate('editor');
	}

	function editAlarm(
		alarm: Alarm
	) {
		selectedAlarm.set(alarm);

		navigate('editor');
	}

	function requestDelete(
		alarm: Alarm
	) {
		alarmToDelete = alarm;
	}

	function confirmDelete() {
		if (!alarmToDelete) {
			return;
		}

		deleteAlarm(
			alarmToDelete.id
		);

		alarmToDelete = null;
	}

	function cancelDelete() {
		alarmToDelete = null;
	}

    function testRinging() {
		const alarmList =
			get(alarms);

	    const alarm =
			alarmList.find(
				(item) =>
					item.enabled
	);

	    if (!alarm) {
			console.warn(
				'No enabled alarm available'
			);

		return;
	}

	startRinging(alarm);

	navigate('ringing');
}

</script>

<div class="alarm-list-screen">

	<header>

		<button
			type="button"
			class="header-button"
			aria-label="Go back"
			onclick={goBack}
		>
			<ArrowLeft
				size={22}
				strokeWidth={1.8}
			/>
		</button>

		<button
			type="button"
			class="test-ring-button"
			onclick={testRinging}
		>
			Test Ring
		</button>

		<div class="heading">

			<span>
				ALARMS
			</span>

			<strong>
				{$alarms.length}
			</strong>

		</div>

		<button
			type="button"
			class="header-button add"
			aria-label="Add alarm"
			onclick={createNewAlarm}
		>
			<Plus
				size={23}
				strokeWidth={1.8}
			/>
		</button>

	</header>

	<div class="list-area">

		{#if $alarms.length > 0}

			<div class="alarm-list">

				{#each $alarms as alarm (
					alarm.id
				)}

					<AlarmCard
						{alarm}
						onopen={() =>
							editAlarm(
								alarm
							)
						}
						ontoggle={() =>
							toggleAlarm(
								alarm.id
							)
						}
						ondelete={() =>
							requestDelete(
								alarm
							)
						}
					/>

				{/each}

			</div>

		{:else}

			<div class="empty-state">

				<div class="empty-icon">

					<AlarmClock
						size={28}
						strokeWidth={1.5}
					/>

				</div>

				<h2>
					No alarms
				</h2>

				<p>
					Create an alarm to get started.
				</p>

				<button
					type="button"
					onclick={createNewAlarm}
				>
					<Plus size={18} />

					Add alarm
				</button>

			</div>

		{/if}

	</div>

	<div class="bottom-fade"></div>

	{#if alarmToDelete}

		<ConfirmDialog
			title="Delete alarm?"
			message={`Delete "${alarmToDelete.title}"?`}
			onconfirm={confirmDelete}
			oncancel={cancelDelete}
		/>

	{/if}

</div>

<style>
	.alarm-list-screen {
		position: relative;

		width: 100%;
		height: 100%;

		overflow: hidden;
	}

	header {
		position: absolute;

		top: 10%;
		left: 17%;
		right: 17%;

		z-index: 10;

		display: flex;

		align-items: center;

		justify-content:
			space-between;
	}

	.header-button {
		width: 44px;
		height: 44px;

		display: grid;
		place-items: center;

		padding: 0;

		border:
			1px solid
			rgba(255, 255, 255, 0.1);

		border-radius: 50%;

		background:
			rgba(255, 255, 255, 0.055);

		color:
			rgba(255, 255, 255, 0.75);

		backdrop-filter:
			blur(16px);

		cursor: pointer;
	}

	.header-button.add {
		color:
			var(--accent);

		border-color:
			rgba(121, 232, 208, 0.2);

		background:
			rgba(121, 232, 208, 0.08);
	}

	.heading {
		display: flex;

		flex-direction: column;

		align-items: center;
	}

	.heading span {
		font-size: 0.62rem;

		font-weight: 700;

		letter-spacing:
			0.18em;

		color:
			var(--text-secondary);
	}

	.heading strong {
		margin-top: 3px;

		font-size: 1.2rem;

		font-weight: 400;
	}

	.list-area {
		position: absolute;

padding: 20%;

		overflow-y: auto;



		scrollbar-width: none;
	}

	.list-area::-webkit-scrollbar {
		display: none;
	}

	.alarm-list {
		display: flex;

		flex-direction: column;

		gap: 10px;
	}

	.empty-state {
		height: 100%;

		display: flex;

		flex-direction: column;

		align-items: center;
		justify-content: center;

		text-align: center;
	}

	.empty-icon {
		width: 58px;
		height: 58px;

		display: grid;
		place-items: center;

		border-radius: 50%;

		color:
			var(--text-secondary);

		background:
			rgba(255, 255, 255, 0.05);

		border:
			1px solid
			rgba(255, 255, 255, 0.09);
	}

	.empty-state h2 {
		margin:
			12px 0 4px;

		font-size: 1rem;
	}

	.empty-state p {
		margin:
			0 0 14px;

		font-size: 0.68rem;

		color:
			var(--text-secondary);
	}

	.empty-state button {
		display: flex;

		align-items: center;

		gap: 6px;

		padding:
			9px 15px;

		border:
			1px solid
			rgba(121, 232, 208, 0.24);

		border-radius: 999px;

		background:
			rgba(121, 232, 208, 0.09);

		color:
			var(--accent);

		cursor: pointer;
	}

	.test-ring-button {
		padding:
			8px 14px;

	    border:
			1px solid
		    rgba(
				121,
				232,
			    208,
			    0.2
		);

	    border-radius: 999px;

		background:
			rgba(
				121,
				232,
			    208,
			    0.08
			);

	    color:
			var(--accent);

	    font-size: 0.58rem;

	    cursor: pointer;
    }
	
	.bottom-fade {
		position: absolute;

		left: 20%;
		right: 20%;
		bottom: 7%;

		height: 12%;

		pointer-events: none;

		background:
			linear-gradient(
				to bottom,
				transparent,
				rgba(6, 10, 17, 0.75)
			);

		filter:
			blur(5px);
	}
</style>