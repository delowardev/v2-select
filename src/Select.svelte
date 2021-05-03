<script lang="ts">
  import clsx from "clsx";
  import ChevronDown from "./components/icons/ChevronDown.svelte";
  import Times from "./components/icons/Times.svelte";
  import { findText } from "./helper";
  import type { SelectOption, State } from "./interface";
  import { createStore } from "./store";
  import Search from "./Search.svelte";
  import { onMount } from "svelte";
  
  /**
   * Constant
   */
  
  const {
    subscribe,
    addOptions,
    setValue,
    setValues,
    setMultiple,
    appendValue,
    clearByIndex,
    getFilteredOptions,
    clearValues,
    setSearch,
    backspace
  } = createStore();
  
  /**
   * Props
   */
  
  export let select: HTMLSelectElement;
  select.style.display = "none";
  
  
  /**
   * Variables
   */
  
  let open = false;
  let value = "";
  let options = [];
  let text = "";
  let multiple = false;
  let values = [];
  let filteredOptions = [];
  let searchText = "";
  // refs
  let elemRoot: HTMLDivElement;
  let elemSearch;
  
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
      values: _values,
      search: _search
    } = _state;
    
    value = _value ? _value : "";
    values = _values ? _values : [];
    multiple = _multiple;
    options = _options ? _options : [];
    filteredOptions = getFilteredOptions();
    text = value && options ? findText(_options, value) : "";
    searchText = _search
  }
  
  function _select(value) {
    setSearch("");
    if (multiple) {
      appendValue(value);
      return;
    }
    setValue(value);
    _close();
  }
  
  function _close() {
    open = false;
  }
  
  function _toggle() {
    open = !open;
  }
  
  function _clearByIndex(index) {
    clearByIndex(index);
  }
  
  function _clearValues() {
    clearValues();
    _close();
  }
  
  function _handleOnClickValue() {
    _toggle();
    if (elemSearch.focus) {
      elemSearch.focus();
    }
  }
  
  /**
   * Custom events func
   */
  
  function _setSearch (e) {
    const _value = e.detail.value;
    setSearch(_value);
    if (value && !open) {
      open = true;
    }
  }
  
  function _backspace() {
    backspace();
  }
  
  /**
   * Lifecycle
   */
  
  onMount(() => {
    document.addEventListener('click', (e: MouseEvent) => {
      const closest = (e.target as HTMLElement).closest('.v2select');
      const condition = e.target === elemRoot || (closest && closest === elemRoot);
      if (!condition) {
        e.preventDefault();
        _close();
      }
      
    })
    
  })

</script>

<main>
  <div tabindex="0" bind:this={elemRoot} class={clsx(
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
      <div on:click={_handleOnClickValue} class="v2select__values">
        {#if multiple}
          {#if Array.isArray(values) && values.length}
            <div class="v2select__multi-values">
              {#each values as val, i}
                <div class="v2select__multi-value">
                  <span class="v2select__multi-label">{ findText(options, val) }</span>
                  <button
                    on:click|stopPropagation|capture={_clearByIndex.bind(this, i)}
                    class="v2select__multi-close"
                  >
                    <Times />
                  </button>
                </div>
              {/each}
              <Search
                bind:multiple={multiple}
                bind:this={elemSearch}
                bind:search={searchText}
                on:update={_setSearch}
                on:backspace={_backspace}
              />
            </div>
          {:else }
            <Search
              bind:multiple={multiple}
              bind:this={elemSearch}
              bind:search={searchText}
              on:update={_setSearch}
              on:backspace={_backspace}
            />
            {#if !searchText}
              <div class="v2select__placeholder">Select...</div>
            {/if}
          {/if}
        {:else }
          <Search
            bind:multiple={multiple}
            bind:this={elemSearch}
            bind:search={searchText}
            on:update={_setSearch}
            on:backspace={_backspace}
          />
          {#if !searchText}
            {#if !!value}
              <div class="v2select__single-value">{text}</div>
            {:else}
              <div class="v2select__placeholder">Select...</div>
            {/if}
          {/if}
        {/if}
      </div>
      <div class="v2select__buttons">
        {#if multiple}
          {#if values.length}
            <button on:click={_clearValues} class="v2select__btn">
              <Times/>
            </button>
          {/if}
        {:else}
          {#if !!value}
            <button on:click={_clearValues} class="v2select__btn">
              <Times/>
            </button>
          {/if}
        {/if}
        <button on:click|stopPropagation|capture={_toggle} class="v2select__btn">
          <ChevronDown />
        </button>
      </div>
    </div>
    {#if open}
      <div class="v2select__dropdown">
        <div class="v2select__dropdown-inner">
          {#if Array.isArray(filteredOptions) && filteredOptions.length}
            {#each filteredOptions as option}
              <button
                class={clsx(
                  'v2select__dropdown-item',
                  {
                    'v2select__dropdown--selected': option.value === value && !multiple,
                    'v2select__dropdown--is-disabled': option.disabled === true
                  }
                )}
                tabindex={option.disabled ? '-1' : '0'}
                on:click={
								() => option.disabled ? null : _select(option.value)
							}
              >
                {option.text}
              </button>
            {/each}
          {:else}
            <span class="v2select__dropdown-placeholder">No Options</span>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</main>

<style type="text/scss">
  @import "scss/style.scss";
</style>