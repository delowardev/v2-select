<script lang="ts">
	import clsx from "clsx";
	import ChevronDown from "./components/icons/ChevronDown.svelte";
	import Times from "./components/icons/Times.svelte";
	import { findText } from "./helper";
	import type { SelectOption, State, StoreDaddy } from "./interface";
	import { createStore } from "./store";



	/**
	 * Constant
	*/

	const {
		data,
		subscribe,
		addOptions,
		setValue,
		setValues,
		setMultiple,
		appendValue,
		clearByIndex,
		getFilteredOptions,
		clearValues
	} = createStore();

	/**
	 * Props
	 */

	export let select: HTMLSelectElement;
	select.style.display = "none";


	/**
	 * Variables
	 */

	let search = "";
	let open = false;
	let root: HTMLDivElement;
	let value = "";
	let options = [];
	let text = "";
	let multiple = false;
	let values = [];
	let filteredOptions = [];

	/**
	 * Store
	 */

	subscribe((state) => {
		_onSubscribe(state);
	});
	addOptions(getInitialSelectOptions(), true);
	setValue(getInitialValues()[0])
	setValues(getInitialValues())
	setMultiple(select?.multiple)

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

	function _onSubscribe(_state: State): void {
		const {
			value: _value,
			options: _options,
			multiple: _multiple,
			values: _values
		} = _state;

		value = _value ? _value : "";
		values = _values ? _values : [];
		multiple = _multiple;
		options = _options ? _options : [];
		filteredOptions = multiple ? getFilteredOptions() : _options;
		text = value && options ? findText(_options, value) : "";
	}

	function _select(value) {

		if (multiple) {
			appendValue(value);
		} else {
			setValue(value);
		}

		_close();
	}

	function _close() {
		open = false;
	}

	function _toggle() {
		open = !open;
		console.log('aaaa')
	}

	function _clearByIndex(index) {
		clearByIndex(index);
	}

	function _clearValues() {
		clearValues();
		_close();
	}

	/**
	 * Lifecycle
	 */

</script>

<main>
	<div bind:this={root} class={clsx(
		'v2select',
		{
			v2select__multiple: multiple,
			v2select__single: !multiple
		}
	)}>
		<div
			class={clsx(
				'v2select__controls',
				{ 'v2select__controls--is-selected': open }
			)}
		>
			<div on:click|stopPropagation={_toggle} class="v2select__values">
				<input class="v2select__search" type="text" bind:value={search}>
				{#if multiple}
					{#if Array.isArray(values) && values.length}
						<div class="v2select__multi-values">
							{#each values as val, i}
								<div class="v2select__multi-value">
									<span class="v2select__multi-label">{ findText(options, val) }</span>
									<button on:click={() => _clearByIndex(i)} class="v2select__multi-close"><Times /></button>
								</div>
							{/each}
						</div>
					{:else }
						<div class="v2select__placeholder">Select...</div>
					{/if}
				{:else }
					{#if !!value}
						<div class="v2select__single-value">{text}</div>
					{:else}
						<div class="v2select__placeholder">Select...</div>
					{/if}
				{/if}
			</div>
			<div class="v2select__buttons">
				<button on:click={_clearValues} class="v2select__times v2select__icon v2select__btn">
					<Times />
				</button>
				<button on:click={_toggle} class="v2select__arrow v2select__icon v2select__btn">
					<ChevronDown />
				</button>
			</div>
		</div>
		{#if open}
		<div class="v2select__dropdown">
			<div class="v2select__dropdown-inner">
				{#if Array.isArray(filteredOptions)}
					{#each filteredOptions as option}
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