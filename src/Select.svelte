<script lang="ts">
	import {get} from "svelte/store";
	import state from "./store";
	import type {State} from "./interface";
	import ChevronDown from "./components/icons/ChevronDown.svelte";
	import Times from "./components/icons/Times.svelte";

	/**
	 * Props
	 */

	export let select: HTMLSelectElement;

	/**
	 * Set initial value
	 */
	state.update((prevState): State => {
		const _options: HTMLCollectionOf<HTMLOptionElement> = select.selectedOptions;
		const options = Array.from(select.options).map(({value, text}) => ({value, text}));
		const values = Array.from(_options).map(({value, text}) => ({value, text}));
		const value = values[0] || options[0];
		const multiple = select.multiple;
		return {
			...prevState,
			value,
			values,
			options,
			multiple
		}
	});

	/**
	 * Variables
	 */

	const getState = get(state);
	const getValue = getState.value?.value || "";
	const className = `v2select ` + (getState.multiple ? `v2select__multiple` : `v2select__single`);
	let search = "";

	/**
	 * Functions
	 */

	function setValue(value) {
		console.log(value);
	}

</script>

<main>
	<div class={className}>
		<div class="v2select__controls">
			<div class="v2select__values">
				<input class="v2select__search" type="text" bind:value={search}>
				<div class="v2select__value">{getValue}</div>
			</div>
			<div class="v2select__buttons">
				<button class="v2select__times v2select__icon v2select__btn">
					<Times />
				</button>
				<button class="v2select__arrow v2select__icon v2select__btn">
					<ChevronDown />
				</button>
			</div>
		</div>
		<div class="v2select__dropdown">
			<div class="v2select__dropdown-inner">
				{#each get(state).options as option}
					<button class="v2select__dropdown-item" on:click={() => setValue(option.value)}>{option.text}</button>
				{/each}
			</div>
		</div>
	</div>
</main>

<style type="text/scss">
	@import "scss/style.scss";
</style>