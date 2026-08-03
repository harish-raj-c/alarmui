<script lang="ts">
	import {
		AlarmClock,
		Plus,
		Settings,
		ChevronRight
	} from '@lucide/svelte';
	
	import {
		alarms,
		selectedAlarm
	} from '$lib/stores/alarmStore';

	import {
		navigate
	} from '$lib/stores/navigationStore';

	import {
		formatTime,
		getNextAlarm,
		getRepeatLabel
	} from '$lib/utils/time';	

	import IconButton
		from '$lib/components/device/IconButton.svelte';

	let now = $state(new Date());

	let timer: ReturnType<
		typeof setInterval
	>;

	$effect(() => {
		timer = setInterval(() => {
			now = new Date();
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	});

	let currentTime = $derived(
		now.toLocaleTimeString(
			'en-US',
			{
				hour: 'numeric',
				minute: '2-digit',
				hour12: true
			}
		)
	);

	let timeParts = $derived(
		currentTime.split(' ')
	);

	let dateText = $derived(
		now
			.toLocaleDateString(
				'en-US',
				{
					weekday: 'short',
					month: 'short',
					day: 'numeric'
				}
			)
			.toUpperCase()
	);

	let nextAlarm = $derived(
		getNextAlarm($alarms)
	);

	function openAlarmList() {
		navigate('alarms');
	}

	function createNewAlarm() {
		selectedAlarm.set(null);

		navigate('editor');
	}
	
	function openSettings() {
		navigate('settings');
	}
</script>

<div class="home-screen">
    

	<div class="top-label">
		{dateText}
	</div>

	<div class="clock-area">

		<div class="time-row">

			<span class="main-time">
				{timeParts[0]}
			</span>

			<span class="period">
				{timeParts[1]}
			</span>

		</div>


	</div>

	{#if nextAlarm}

		{@const formatted =
			formatTime(
				nextAlarm.hour,
				nextAlarm.minute
			)
		}

		<button
			class="next-alarm glass"
			type="button"
			onclick={openAlarmList}
		>

			<div class="alarm-icon">

				<AlarmClock
					size={20}
					strokeWidth={1.8}
				/>

			</div>

			<div class="alarm-info">

				<span class="alarm-label">
					NEXT ALARM
				</span>

				<div class="alarm-time">

					{formatted.time}

					<span>
						{formatted.period}
					</span>

				</div>

				<p>
					{nextAlarm.title}
					·
					{getRepeatLabel(
						nextAlarm.repeatDays
					)}
				</p>

			</div>

			<span class="arrow">
				<ChevronRight
					size={19}
				/>
			</span>

		</button>

	{:else}

		<div class="no-alarm glass">

			<AlarmClock
				size={22}
			/>

			<div>

				<strong>
					No alarms
				</strong>

				<span>
					Create your first alarm
				</span>

			</div>

		</div>

	{/if}

	<!--
		Temporary Step 16 test button.
		This is intentionally OUTSIDE
		the next-alarm button.
	-->
	
	</div>
<style>
	.home-screen{
	position:relative;

	width:100%;
	height:100%;

overflow:hidden;

}

	.top-label{

	position:absolute;

	top:18%;

	left:50%;

	transform:translateX(-50%);

	width:max-content;

	font-size:14px;

	font-weight:600;
	
	color:rgba(246, 239, 239, 0.55);
}

	.clock-area{
	position:absolute;

	top:38%;

	left:50%;

	transform:translate(-50%,-58%);

	display:flex;
	justify-content:center;

	align-items:center;

	z-index:2;
}

	.time-row{
	display:flex;

	align-items:flex-start;

	justify-content:center;

	gap:10px;
}

	.main-time{

	font-size:86px;

	font-weight:220;

	line-height:.9;

	letter-spacing:-.08em;

	color:white;

	text-shadow:
	0 0 30px rgba(255,255,255,.08);
}

	.period{

	margin-top:14px;

	font-size:.8rem;

	font-weight:600;

	color:var(--accent);

	letter-spacing:.12em;
}

	.status{

	margin-top:14px;

	font-size:15px;

	color:rgba(245, 239, 239, 0.98);
}

	.next-alarm{

	position:absolute;

	top:52%;

	left:50%;

	transform:translateX(-50%);

	width:62%;

	height:104px;

	display:grid;

	grid-template-columns:50px 1fr auto;

	align-items:center;

	gap:16px;

	padding:18px;

	border-radius:26px;

	background:
	linear-gradient(
	135deg,
	rgba(34,44,54,.72),
	rgba(20,28,36,.58)
	);

	backdrop-filter:blur(22px);

	border:1px solid rgba(121,232,208,.18);

	box-shadow:
	0 0 18px rgba(121,232,208,.08);

	z-index:2;
}
	.next-alarm:hover {
		background:
			rgba(
				255,
				255,
				255,
				0.1
			);
	}

	.alarm-icon{

	width:42px;
	height:42px;

	display:grid;

	place-items:center;

	border-radius:50%;

	background:

	rgba(121,232,208,.10);

	border:

	1px solid

	rgba(121,232,208,.18);

	color:var(--accent);
}

	.alarm-info {
		min-width: 0;
	}

	.alarm-label{

	font-size:.72rem;

	font-weight:700;

	letter-spacing:.18em;

	color:var(--accent);
}

	.alarm-time{

	font-size:1.55rem;

	font-weight:300;
}

	.alarm-time span {
		margin-left: 3px;

		font-size:
			0.65rem;

		color:
			var(--text-secondary);
	}

	.alarm-info p{

	font-size:.62rem;

	color:rgba(255,255,255,.58);
}

	.arrow {
		color:
			rgba(
				255,
				255,
				255,
				0.3
			);
	}

	.no-alarm {
		width: 70%;

		margin-top: auto;

		margin-bottom: 2%;

		display: flex;

		align-items: center;

		gap: 12px;

		padding:
			16px 20px;

		border-radius: 24px;
	}

	.no-alarm div {
		display: flex;

		flex-direction:
			column;
	}

	.no-alarm strong {
		font-size:
			0.85rem;
	}

	.no-alarm span {
		margin-top: 3px;

		font-size:
			0.68rem;

		color:
			var(--text-secondary);
	}

	/*
		Temporary test button.

		It is part of the normal flex layout,
		so it will not overlap the next alarm card
		or bottom navigation.
	*/
	
	.navigation{

	margin-top:36px;

	width:68%;

	display:flex;

	align-items:center;

	justify-content:space-between;

	z-index:2;
}

	.add-button{

	width:70px;
	height:70px;

	display:grid;

	place-items:center;

	border-radius:50%;

	border:

	1px solid

	rgba(121,232,208,.32);

	background:

	linear-gradient(

	145deg,

	rgba(121,232,208,.22),

	rgba(121,232,208,.07)

	);

	color:#b8fff0;

	box-shadow:

	0 0 26px

	rgba(121,232,208,.12);

	cursor:pointer;

	transition:.2s;
}

	.add-button:hover {
		transform:
			scale(1.08);
	}

	.add-button:active {
		transform:
			scale(0.94);
	}

	.background-rings{

	position:absolute;

	inset:0;

	display:flex;

	align-items:center;

	justify-content:center;

	pointer-events:none;

	transform:translateY(55px);
}

.ring{

	position:absolute;

	border-radius:50%;

	border:1px solid rgba(121,232,208,.03);
}

	@media (
		max-width: 500px
	) {
		.home-screen {
			padding:
				10% 11%
				9%;
		}

		.next-alarm {
			width: 82%;
		}

		.navigation {
			width: 68%;
		}
	}
</style>