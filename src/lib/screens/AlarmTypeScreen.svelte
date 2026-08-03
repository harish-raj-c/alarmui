<script lang="ts">
	import {
		ArrowLeft,
		Check,
		AlarmClock,
		Bell,
		Pill,
		CalendarClock,
		Sparkles
	} from '@lucide/svelte';

	import {
		alarmDraft
	} from '$lib/stores/alarmEditorStore';

	import {
		navigate
	} from '$lib/stores/navigationStore';

	import type {
		AlarmType
	} from '$lib/types/alarm';

	interface AlarmTypeOption {
		type: AlarmType;
		title: string;
		description: string;
		icon: typeof AlarmClock;
	}

	const alarmTypes: AlarmTypeOption[] = [
		{
			type: 'WAKE',
			title: 'Wake Up',
			description:
				'Start your day on time',
			icon: AlarmClock
		},
		{
			type: 'REMINDER',
			title: 'Reminder',
			description:
				'Remember an important task',
			icon: Bell
		},
		{
			type: 'MEDICATION',
			title: 'Medication',
			description:
				'Never miss your medicine',
			icon: Pill
		},
		{
			type: 'MEETING',
			title: 'Meeting',
			description:
				'Be ready for an appointment',
			icon: CalendarClock
		},
		{
			type: 'CUSTOM',
			title: 'Custom',
			description:
				'Create your own alarm type',
			icon: Sparkles
		}
	];

	function selectType(
		type: AlarmType
	) {
		alarmDraft.update(
			(draft) => {
				if (!draft) {
					return draft;
				}

				return {
					...draft,
					type
				};
			}
		);
	}

	function goBack() {
		navigate('editor');
	}
</script>

<div class="type-screen">

	<header>

		<button
			type="button"
			class="header-button"
			aria-label="Go back"
			onclick={goBack}
		>
			<ArrowLeft
				size={21}
				strokeWidth={1.8}
			/>
		</button>

		<div class="heading">
			<span>
				ALARM TYPE
			</span>
		</div>

		<button
			type="button"
			class="header-button done"
			aria-label="Done"
			onclick={goBack}
		>
			<Check
				size={21}
				strokeWidth={2}
			/>
		</button>

	</header>

	<div class="content">

		<div class="title-section">

			<div class="main-icon">

				<AlarmClock
					size={25}
					strokeWidth={1.6}
				/>

			</div>

			<h1>
				Choose alarm type
			</h1>

			<p>
				Select what this alarm is for
			</p>

		</div>

		<div class="type-list">

			{#each alarmTypes as option (
				option.type
			)}

				{@const TypeIcon =
					option.icon}

				<button
					type="button"
					class="type-card"
					class:selected={
						$alarmDraft
							?.type ===
						option.type
					}
					onclick={() =>
						selectType(
							option.type
						)
					}
				>

					<div class="type-icon">

						<TypeIcon
							size={20}
							strokeWidth={1.7}
						/>

					</div>

					<div class="type-info">

						<strong>
							{option.title}
						</strong>

						<span>
							{option.description}
						</span>

					</div>

					<div class="selection">

						{#if (
							$alarmDraft
								?.type ===
							option.type
						)}

							<div class="check">

								<Check
									size={14}
									strokeWidth={2.2}
								/>

							</div>

						{:else}

							<div class="empty-circle">
							</div>

						{/if}

					</div>

				</button>

			{/each}

		</div>

		{#if $alarmDraft}

			<div class="selected-summary">

				<span>
					SELECTED
				</span>

				<strong>
					{alarmTypes.find(
						(option) =>
							option.type ===
							$alarmDraft?.type
					)?.title ??
						'Wake Up'}
				</strong>

			</div>

		{/if}

	</div>

</div>

<style>
	.type-screen {
		position: relative;

		width: 100%;
		height: 100%;

		overflow: hidden;
	}

	header {
		position: absolute;

		top: 9%;
		left: 17%;
		right: 17%;

		z-index: 10;

		display: flex;

		align-items: center;
		justify-content:
			space-between;
	}

	.header-button {
		width: 42px;
		height: 42px;

		display: grid;
		place-items: center;

		padding: 0;

		border:
			1px solid
			rgba(
				255,
				255,
				255,
				0.1
			);

		border-radius: 50%;

		background:
			rgba(
				255,
				255,
				255,
				0.055
			);

		color:
			rgba(
				255,
				255,
				255,
				0.72
			);

		cursor: pointer;

		transition:
			background 160ms ease,
			transform 160ms ease;
	}

	.header-button:hover {
		transform:
			scale(1.05);

		background:
			rgba(
				255,
				255,
				255,
				0.09
			);
	}

	.header-button.done {
		color:
			var(--accent);

		border-color:
			rgba(
				121,
				232,
				208,
				0.22
			);

		background:
			rgba(
				121,
				232,
				208,
				0.08
			);
	}

	.heading span {
		font-size:
			0.62rem;

		font-weight: 700;

		letter-spacing:
			0.17em;

		color:
			var(--text-secondary);
	}

	.content {
		position: absolute;

		top: 18%;
		left: 15%;
		right: 15%;
		bottom: 9%;

		overflow-y: auto;

	

		scrollbar-width: none;
	}

	.content::-webkit-scrollbar {
		display: none;
	}

	.title-section {
		text-align: center;

		margin-bottom: 13px;
	}

	.main-icon {
		width: 50px;
		height: 50px;

		margin:
			0 auto 9px;

		display: grid;
		place-items: center;

		border-radius: 50%;

		color:
			var(--accent);

		background:
			rgba(
				121,
				232,
				208,
				0.08
			);

		border:
			1px solid
			rgba(
				121,
				232,
				208,
				0.16
			);

		box-shadow:
			0 0 24px
			rgba(
				121,
				232,
				208,
				0.06
			);
	}

	.title-section h1 {
		margin: 0;

		font-size:
			1.05rem;

		font-weight: 500;
	}

	.title-section p {
		margin:
			4px 0 0;

		font-size:
			0.59rem;

		color:
			var(--text-secondary);
	}

	.type-list {
		display: flex;

		flex-direction: column;

		gap: 7px;
	}

	.type-card {
		width: 100%;

		display: grid;

		grid-template-columns:
			auto 1fr auto;

		align-items: center;

		gap: 11px;

		padding:
			10px 12px;

		border:
			1px solid
			rgba(
				255,
				255,
				255,
				0.08
			);

		border-radius: 18px;

		background:
			linear-gradient(
				135deg,
				rgba(
					255,
					255,
					255,
					0.055
				),
				rgba(
					255,
					255,
					255,
					0.025
				)
			);

		color: inherit;

		text-align: left;

		cursor: pointer;

		transition:
			transform 160ms ease,
			background 160ms ease,
			border-color 160ms ease,
			box-shadow 160ms ease;
	}

	.type-card:hover {
		transform:
			translateY(-1px);

		background:
			rgba(
				255,
				255,
				255,
				0.075
			);
	}

	.type-card.selected {
		border-color:
			rgba(
				121,
				232,
				208,
				0.3
			);

		background:
			linear-gradient(
				135deg,
				rgba(
					121,
					232,
					208,
					0.11
				),
				rgba(
					121,
					232,
					208,
					0.035
				)
			);

		box-shadow:
			0 0 22px
			rgba(
				121,
				232,
				208,
				0.05
			);
	}

	.type-icon {
		width: 40px;
		height: 40px;

		display: grid;
		place-items: center;

		border-radius: 50%;

		color:
			rgba(
				255,
				255,
				255,
				0.5
			);

		background:
			rgba(
				255,
				255,
				255,
				0.05
			);

		border:
			1px solid
			rgba(
				255,
				255,
				255,
				0.07
			);

		transition:
			color 160ms ease,
			background 160ms ease;
	}

	.type-card.selected
	.type-icon {
		color:
			var(--accent);

		background:
			rgba(
				121,
				232,
				208,
				0.09
			);

		border-color:
			rgba(
				121,
				232,
				208,
				0.14
			);
	}

	.type-info {
		min-width: 0;

		display: flex;

		flex-direction: column;

		gap: 3px;
	}

	.type-info strong {
		font-size:
			0.7rem;

		font-weight: 500;
	}

	.type-info span {
		overflow: hidden;

		font-size:
			0.54rem;

		color:
			var(--text-secondary);

		white-space: nowrap;

		text-overflow:
			ellipsis;
	}

	.selection {
		width: 26px;

		display: grid;
		place-items: center;
	}

	.check {
		width: 24px;
		height: 24px;

		display: grid;
		place-items: center;

		border-radius: 50%;

		background:
			var(--accent);

		color:
			#07130f;

		box-shadow:
			0 0 14px
			rgba(
				121,
				232,
				208,
				0.18
			);
	}

	.empty-circle {
		width: 20px;
		height: 20px;

		border:
			1px solid
			rgba(
				255,
				255,
				255,
				0.15
			);

		border-radius: 50%;
	}

	.selected-summary {
		margin-top: 10px;

		padding:
			10px 14px;

		display: flex;

		align-items: center;
		justify-content:
			space-between;

		border:
			1px solid
			rgba(
				121,
				232,
				208,
				0.1
			);

		border-radius: 16px;

		background:
			rgba(
				121,
				232,
				208,
				0.035
			);
	}

	.selected-summary span {
		font-size:
			0.5rem;

		font-weight: 700;

		letter-spacing:
			0.11em;

		color:
			var(--text-secondary);
	}

	.selected-summary strong {
		font-size:
			0.65rem;

		font-weight: 500;

		color:
			var(--accent);
	}
</style>