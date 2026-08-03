<script lang="ts">
	import {
		ArrowLeft,
		Check,
		Music2,
		Volume2,
		VolumeX
	} from '@lucide/svelte';

	import {
		alarmDraft
	} from '$lib/stores/alarmEditorStore';

	import {
		navigate
	} from '$lib/stores/navigationStore';

	import {
		alarmSounds
	} from '$lib/data/sounds';

	import type {
		AlarmSound
	} from '$lib/data/sounds';

	import SoundOption
		from '$lib/components/alarm/SoundOption.svelte';

	let playingSoundId =
		$state<string | null>(null);

	let audioContext:
		AudioContext | null = null;

	let oscillator:
		OscillatorNode | null = null;

	let gainNode:
		GainNode | null = null;

	let stopTimer:
		ReturnType<typeof setTimeout>
		| null = null;

	function selectSound(
		sound: AlarmSound
	) {
		alarmDraft.update(
			(draft) => {
				if (!draft) {
					return draft;
				}

				return {
					...draft,
					sound: sound.name
				};
			}
		);
	}

	function stopPreview() {
		if (stopTimer) {
			clearTimeout(stopTimer);

			stopTimer = null;
		}

		if (oscillator) {
			try {
				oscillator.stop();
			} catch {
				// Already stopped.
			}

			oscillator.disconnect();

			oscillator = null;
		}

		if (gainNode) {
			gainNode.disconnect();

			gainNode = null;
		}

		playingSoundId = null;
	}

	function previewSound(
		sound: AlarmSound
	) {
		if (
			playingSoundId ===
			sound.id
		) {
			stopPreview();

			return;
		}

		stopPreview();

		if (
			typeof window ===
			'undefined'
		) {
			return;
		}

		audioContext ??=
			new AudioContext();

		const newOscillator =
			audioContext
				.createOscillator();

		const newGain =
			audioContext
				.createGain();

		const volume =
			$alarmDraft?.volume ??
			70;

		newOscillator.type =
			'sine';

		newOscillator
			.frequency
			.value =
			sound.frequency;

		newGain.gain.value =
			Math.max(
				0.02,
				(volume / 100) *
					0.15
			);

		newOscillator.connect(
			newGain
		);

		newGain.connect(
			audioContext.destination
		);

		oscillator =
			newOscillator;

		gainNode =
			newGain;

		playingSoundId =
			sound.id;

		newOscillator.start();

		stopTimer =
			setTimeout(
				stopPreview,
				1500
			);
	}

	function updateVolume(
		event: Event
	) {
		const target =
			event.currentTarget as
				HTMLInputElement;

		const volume =
			Number(
				target.value
			);

		alarmDraft.update(
			(draft) => {
				if (!draft) {
					return draft;
				}

				return {
					...draft,
					volume
				};
			}
		);

		if (gainNode) {
			gainNode.gain.value =
				Math.max(
					0.02,
					(volume / 100) *
						0.15
				);
		}
	}

	function goBack() {
		stopPreview();

		navigate('editor');
	}
</script>

<div class="sound-screen">

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
				ALARM SOUND
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

		<div class="sound-header">

			<div class="sound-icon">

				<Music2
					size={23}
					strokeWidth={1.6}
				/>

			</div>

			<div>

				<h1>
					Choose a sound
				</h1>

				<p>
					Preview and select your alarm tone
				</p>

			</div>

		</div>

		<div class="volume-card">

			<div class="volume-top">

				<div class="volume-label">

					{#if (
						$alarmDraft?.volume ??
						0
					) === 0}

						<VolumeX
							size={18}
						/>

					{:else}

						<Volume2
							size={18}
						/>

					{/if}

					<span>
						VOLUME
					</span>

				</div>

				<strong>
					{$alarmDraft?.volume ?? 70}%
				</strong>

			</div>

			<input
				type="range"
				min="0"
				max="100"
				step="1"
				value={
					$alarmDraft?.volume ??
					70
				}
				aria-label="Alarm volume"
				oninput={updateVolume}
			/>

		</div>

		<div class="sound-list">

			{#each alarmSounds as sound (
				sound.id
			)}

				<SoundOption
					{sound}
					selected={
						$alarmDraft
							?.sound ===
						sound.name
					}
					playing={
						playingSoundId ===
						sound.id
					}
					onselect={() =>
						selectSound(
							sound
						)
					}
					onpreview={() =>
						previewSound(
							sound
						)
					}
				/>

			{/each}

		</div>

	</div>

</div>

<style>
	.sound-screen {
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
			rgba(255, 255, 255, 0.1);

		border-radius: 50%;

		background:
			rgba(255, 255, 255, 0.055);

		color:
			rgba(255, 255, 255, 0.72);

		cursor: pointer;
	}

	.header-button.done {
		color:
			var(--accent);

		border-color:
			rgba(121, 232, 208, 0.22);

		background:
			rgba(121, 232, 208, 0.08);
	}

	.heading span {
		font-size: 0.62rem;

		font-weight: 700;

		letter-spacing: 0.17em;

		color:
			var(--text-secondary);
	}

	.content {
		position: absolute;

		top: 19%;
		left: 15%;
		right: 15%;
		bottom: 9%;

		overflow-y: auto;

		padding:
			4px 5px 45px;

		scrollbar-width: none;
	}

	.content::-webkit-scrollbar {
		display: none;
	}

	.sound-header {
		display: flex;

		align-items: center;

		gap: 11px;

		margin-bottom: 12px;

		padding:
			0 4px;
	}

	.sound-icon {
		width: 48px;
		height: 48px;

		flex-shrink: 0;

		display: grid;
		place-items: center;

		border-radius: 50%;

		color:
			var(--accent);

		background:
			rgba(121, 232, 208, 0.08);

		border:
			1px solid
			rgba(121, 232, 208, 0.15);
	}

	.sound-header h1 {
		margin: 0;

		font-size: 1rem;

		font-weight: 500;
	}

	.sound-header p {
		margin:
			3px 0 0;

		font-size: 0.58rem;

		color:
			var(--text-secondary);
	}

	.volume-card {
		margin-bottom: 10px;

		padding:
			11px 14px 13px;

		border:
			1px solid
			rgba(255, 255, 255, 0.08);

		border-radius: 18px;

		background:
			rgba(255, 255, 255, 0.035);
	}

	.volume-top {
		display: flex;

		align-items: center;
		justify-content:
			space-between;

		margin-bottom: 9px;
	}

	.volume-label {
		display: flex;

		align-items: center;

		gap: 7px;

		color:
			var(--accent);
	}

	.volume-label span {
		font-size: 0.55rem;

		font-weight: 700;

		letter-spacing: 0.12em;
	}

	.volume-top strong {
		font-size: 0.65rem;

		font-weight: 500;

		color:
			var(--text-secondary);
	}

	input[type='range'] {
		width: 100%;

		height: 4px;

		margin: 0;

		accent-color:
			var(--accent);

		cursor: pointer;
	}

	.sound-list {
		display: flex;

		flex-direction: column;

		gap: 7px;
	}
</style>