<script lang="ts">
  import clsx from "clsx";
  import ChevronDown from "./components/icons/ChevronDown.svelte";
  import Times from "./components/icons/Times.svelte";
  import { findText } from "./helper";
  import type { SelectOption } from "./interface";
  import { createStore } from "./store";
  import Search from "./Search.svelte";
  import { onMount } from "svelte";
  
  /**
   * Constant
   */
  
  const {
    addOptions,
    setValue,
    setValues,
    appendValue,
    clearByIndex,
    clearValues,
    setSearch,
    backspace,
    
    search: stateSearch,
    value: stateValue,
    values: stateValues,
    options: stateOptions
  } = createStore();
  
  interface SelectOptions {
    classes?: {
      container?: string;
      controls?: string
      dropdownRoot?: string
      dropdown?: string
      placeholder?: string
    },
    placeholder?: string;
    search?: boolean;
    noResultsText?: string;
  }
  
  // Default options
  const defaultOptions: SelectOptions = {
    classes: {
      container: "",
      controls: "",
      dropdownRoot: "",
      dropdown: ""
    },
    placeholder: "Select",
    search: true,
    noResultsText: "Noooooo!"
  }
  
  /**
   * Props
   */
  
  export let select: HTMLSelectElement;
  export let selectOptions: SelectOptions;

  selectOptions.classes = Object.assign({}, defaultOptions.classes, selectOptions.classes);
  selectOptions = Object.assign({}, defaultOptions, selectOptions);
  
  
  
  // ... //
  select.style.display = "none";
  
  /**
   * Variables
   */
  
  let open = false;
  let value = "";
  let options = [];
  let text = "";
  let values = [];
  let filteredOptions = [];
  let searchText = "";
  const multiple = select.multiple;
  // refs
  let elemRoot: HTMLDivElement;
  let elemSearch;
  
  /**
   * Store Subscribers
   */

  stateOptions.subscribe(v => {
    options = v;
    getFilteredOptions();
  });
  stateSearch.subscribe(v => {
    searchText = v;
    getFilteredOptions();
  })
  stateValue.subscribe(v => {
    value = v;
    text = findText(options, v);
    updateMultiSelectElem();
  });
  stateValues.subscribe(v => {
    values = v;
    getFilteredOptions();
    updateMultiSelectElem();
  });
  
  
  // default value
  
  function setDefaultValues() {
    addOptions(getInitialSelectOptions(), true);
    if (multiple) {
      setValues(getInitialValues());
    } else {
      setValue(getInitialValues()[0]);
    }
  }
  
  /**
   * Functions
   */

  function getFilteredOptions() {
    filteredOptions = options.filter(option => {
      const _val = option.value.toLowerCase().trim();
      return !values.includes(option.value) && _val.startsWith(searchText.toLowerCase());
    });
  }
  
  function getInitialSelectedOptions(): HTMLCollectionOf<HTMLOptionElement> {
    return select.selectedOptions;
  }
  
  function getInitialSelectOptions(): SelectOption[] {
    return Array.from(select.options).map(({value, text, disabled}) => ({value, text, disabled}));
  }
  
  function getInitialValues(): String[] {
    return Array.from(getInitialSelectedOptions()).map(({value}) => value);
  }
  
  function updateMultiSelectElem() {
    setTimeout(() => {
      if (multiple) {
          Array.from(select.options).forEach(option => {
            option.selected = values.includes(option.value);
          });
      } else {
        select.value = value;
      }
    }, 50);
  }
  
  // handler functions
  
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
    if (elemSearch) {
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
    setDefaultValues();
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

<div tabindex="0" bind:this={elemRoot} class={clsx(
  'v2select',
  {
    v2select__multiple: multiple,
    v2select__single: !multiple
  },
  selectOptions.classes.container
)}>
  <div
    class={clsx(
      'v2select__controls',
      { 'v2select__controls--is-selected': open },
      selectOptions.classes.controls
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
            {#if (selectOptions.search)}
              <Search
                right={true}
                bind:this={elemSearch}
                bind:search={searchText}
                on:update={_setSearch}
                on:backspace={_backspace}
              />
            {/if}
          </div>
        {:else }
          {#if (selectOptions.search)}
            <Search
              right={false}
              bind:this={elemSearch}
              bind:search={searchText}
              on:update={_setSearch}
              on:backspace={_backspace}
            />
          {/if}
          {#if !searchText}
            <div class="v2select__placeholder">{selectOptions.placeholder}</div>
          {/if}
        {/if}
      {:else }
        {#if (selectOptions.search)}
          <Search
            right={false}
            bind:this={elemSearch}
            bind:search={searchText}
            on:update={_setSearch}
            on:backspace={_backspace}
          />
        {/if}
        {#if !searchText}
          {#if !!value}
            <div class="v2select__single-value">{text}</div>
          {:else}
            <div class="v2select__placeholder">{selectOptions.placeholder}</div>
          {/if}
        {/if}
      {/if}
    </div>
    <div class="v2select__buttons">
      {#if multiple}
        {#if values.length}
          <button on:click|preventDefault={_clearValues} class="v2select__btn">
            <Times/>
          </button>
        {/if}
      {:else}
        {#if !!value}
          <button on:click|preventDefault={_clearValues} class="v2select__btn">
            <Times/>
          </button>
        {/if}
      {/if}
      <button on:click|stopPropagation|capture|preventDefault={_toggle} class="v2select__btn">
        <ChevronDown />
      </button>
    </div>
  </div>
  {#if open}
    <div class={clsx(
      "v2select__dropdown",
      selectOptions.classes.dropdownRoot
    )}>
      <div class="v2select__dropdown-inner">
        {#if Array.isArray(filteredOptions) && filteredOptions.length}
          {#each filteredOptions as option}
            <button
              class={clsx(
                'v2select__dropdown-item',
                {
                  'v2select__dropdown--selected': option.value === value && !multiple,
                  'v2select__dropdown--is-disabled': option.disabled === true
                },
                selectOptions.classes.dropdown
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
          <span class="v2select__dropdown-placeholder">{selectOptions.noResultsText}</span>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style type="text/scss">
  @import "scss/style.scss";
</style>