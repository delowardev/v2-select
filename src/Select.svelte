<script lang="ts">
	import clsx from "clsx";
	import ChevronDown from "./components/icons/ChevronDown.svelte";
	import Times from "./components/icons/Times.svelte";
	import { findText } from "./helper";
	import type { SelectOption, State } from "./interface";
	import { createStore } from "./store";



	/**
	 * Constant
	*/

	const state = createStore();

	/**
	 * Props
	 */

	export let select: HTMLSelectElement;
	select.style.display = "none";


	/**
	 * Variables
	 */

	const getState = state.data as State;
	let search = "";
	let open = false;
	let root: HTMLDivElement;
	let value = "";
	let options = [];
	let text = "";
	let multiple = false;
	let values = [];

	/**
	 * Store
	 */

	state.subscribe((state) => {
		onSubscribe(state);
	});
	state.addOptions(getInitialSelectOptions(), true);
	state.setValue(getInitialValues()[0])
	state.setValues(getInitialValues())
	state.setMultiple(select.multiple)

	/**
	 * Functions
	 */

	function getInitialSelectedOptions(): HTMLCollectionOf<HTMLOptionElement> {
		return select.selectedOptions;
	}

	function getInitialSelectOptions(): SelectOption[] {
		return Array.from(select.options).map(({value, text, disabled}) => ({value, text, disabled}));
	}

	function getInitialValues(): String[] {
		return Array.from(getInitialSelectedOptions()).map(({value}) => value);
	}

	function onSubscribe(data: State): void {
		value = data.value ? data.value : "";
		options = data.options ? data.options : [];
		text = data.options && data.value ? findText(options, value) : "";
		multiple = data.multiple;
		values = data.values ? data.values : [];
		console.log(data);
	}

	function _select(value) {

		if (multiple) {
			state.appendMultiple(value);
		} else {
			state.setValue(value);
		}

		_close();
	}

	function _open() {
		open = true;
	}

	function _close() {
		open = false;
	}

	/**
	 * Lifecycle
	 */

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
				{#if multiple}
					<div class="v2select__multi-values">
						{#each values as val}
							<div class="v2select__multi-value">
								<span class="v2select__multi-label">{ findText(options, val) }</span>
								<button class="v2select__multi-close"><Times /></button>
							</div>
						{/each}
					</div>
				{:else }
					<div class="v2select__single-value">{text}</div>
				{/if}
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
				{#if Array.isArray(options)}
					{#each options as option}
						<button
							class={clsx(
								'v2select__dropdown-item',
								{
									'v2select__dropdown--selected': option.value === value,
									'v2select__dropdown--is-disabled': option.disabled === true
								}
							)}
							on:click={
								() => option.disabled ? null : _select(option.value)
							}
						>
							{option.text}
						</button>
					{/each}
				{/if}
			</div>
		</div>
		{/if}
	</div>
</main>

<style type="text/scss">
	@import "scss/style.scss";
</style>