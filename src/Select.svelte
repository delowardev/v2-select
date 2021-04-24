<script lang="ts">
	import {get} from "svelte/store";
	import state from "./store";
	import type { State } from "./interface";
	import ChevronDown from "./components/icons/ChevronDown.svelte";
	import Times from "./components/icons/Times.svelte";
	import clsx from "clsx";
	import { offClick } from "./helper";
	import { onMount } from "svelte";

	/**
	 * Props
	 */

	export let select: HTMLSelectElement;
	select.style.display = "none";

	/**
	 * Set initial value
	 */
	state.update((prevState): State => {
		const options = Array.from(select.options).map(({value, text, disabled}) => ({value, text, disabled}));
		const selectedOptions: HTMLCollectionOf<HTMLOptionElement> = select.selectedOptions;
		const values = Array.from(selectedOptions).map(({value}) => value);
		const value = values[0] || options[0].value;
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
	const getValue = getState.value;
	let search = "";
	let open = false;
	let root;

	/**
	 * Functions
	 */

	function _setValue(value) {
		console.log(value);
	}

	// function _select() {
	// 	selected = true;
	// }
	//
	// function _unSelect() {
	// 	selected = false;
	// }

	function _open() {
		open = true;
		offClick(root, ".v2select", () => {
			_close();
		});
	}

	function _close() {
		open = false;
	}

	/**
	 * Lifecycle
	 */

	onMount(() => {

	})

</script>

<main>
	<div bind:this={root} class={clsx(
		'v2select',
		{
			v2select__multiple: getState.multiple,
			v2select__single: !getState.multiple
		}
	)}>
		<div
			on:click|stopPropagation={_open}
			class={clsx(
				'v2select__controls',
				{ 'v2select__controls--is-selected': open }
			)}
		>
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
		{#if open}
		<div class="v2select__dropdown">
			<div class="v2select__dropdown-inner">
				{#each get(state).options as option}
					<button
						class="v2select__dropdown-item"
						on:click={
							() => _setValue(option.value)
						}
					>
						{option.text}
					</button>
				{/each}
			</div>
		</div>
		{/if}
	</div>
</main>

<style type="text/scss">
	@import "scss/style.scss";
</style>