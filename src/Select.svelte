<script lang="ts">
  import clsx from "clsx";
  import ChevronDown from "./components/icons/ChevronDown.svelte";
  import Times from "./components/icons/Times.svelte";
  import { findText } from "./helper";
  import type { SelectOption } from "./interface";
  import { createStore } from "./store";
  import Search from "./Search.svelte";
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition"
  
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
    renderOption: (string) => string | null;
    renderValue: (string) => string | null;
    clearable: boolean;
    callback: any;
  }
  
  interface Callback {
    onBeforeOpen: (() => boolean) | null;
    onOpen: (() => void) | null;
    onBeforeClose: (() => boolean) | null;
    onClose: (() => void) | null;
    onBeforeChange: (() => boolean) | null;
    onChange: (() => void) | null;
    onFocus: (() => void) | null;
    onBlur: (() => void) | null;
    onKeyDown: (() => void) | null;
    onKeyUp: (() => void) | null;
    onKeyPress: (() => void) | null;
    onMenuScrollTop: (() => void) | null;
    onMenuScrollEnd: (() => void) | null;
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
    noResultsText: "No options found!",
    renderOption: null,
    renderValue: null,
    clearable: true,
    callback: {
      onBeforeOpen: null,
      onOpen: null,
      onBeforeClose: null,
      onClose: null,
      onBeforeChange: null,
      onChange: null,
      onFocus: null,
      onBlur: null,
      // keyboard
      onKeyDown: null,
      onKeyUp: null,
      onKeyPress: null,
      // scroll
      onMenuScrollTop: null,
      onMenuScrollEnd: null
    }
  }
  
  /**
   * Props
   */
  
  export let select: HTMLSelectElement;
  export let selectOptions: SelectOptions;

  selectOptions.classes = Object.assign({}, defaultOptions.classes, selectOptions.classes);
  selectOptions.callback = <Callback> Object.assign({}, defaultOptions.callback, selectOptions.callback);
  export const _options = <SelectOptions> Object.assign({}, defaultOptions, selectOptions);
  
  
  
  // ... //
  select.style.display = "none";
  
  /**
   * Variables
   */
  
  let open = false;
  let focused = false;
  let value = "";
  let options = [];
  let text = "";
  let values = [];
  let filteredOptions = [];
  let searchText = "";
  const multiple = select.multiple;
  // refs
  let elemRoot: HTMLDivElement;
  let elemControl: HTMLDivElement;
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
  
  const {
    onBeforeOpen,
    onOpen,
    onBeforeClose,
    onClose,
    onFocus,
    onBlur
  } = _options.callback as Callback
  
  function _select(value) {
    setSearch("");
    if (multiple) {
      appendValue(value);
      return;
    }
    setValue(value);
    _close();
  }


  function _open() {
    if ( open ) return false
  
    // callback onBeforeOpen
    if ( onBeforeOpen instanceof Function ) {
      if ( onBeforeOpen() !== false ) {
        return open = true
      }
      return false
    }
    
    open = true
  
    // callback onOpen
    if (onOpen) {
      onOpen()
    }
  
    return true
  }
  
  function _close() {
    if ( !open ) return false;
  
    // callback onBeforeClose
    if ( onBeforeClose instanceof Function ) {
      if ( onBeforeClose() !== false ) {
        return ! ( open = false );
      }
      return false;
    }
    
    open = false
  
    // callback onClose
    if ( onClose ) {
      onClose()
    }
    
    return true
  }
  
  function _toggle() {
    if ( open ) {
      _close()
    } else {
      _open()
    }
    return open;
  }
  
  function _focus () {
    if ( focused ) return false;
    
    if ( onFocus instanceof Function) {
      onFocus()
    }
    
    return ( focused = true )
  }
  
  function _blur () {
    if ( ! focused ) return false;
    
    if ( onBlur instanceof Function ) {
      onBlur()
    }
    
    return ! ( focused = false )
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
   * Accessible methods
   */
  

  export function __open () {
    return _open()
  }
  
  export function __close () {
    return _close()
  }
  
  export function __toggle () {
    return _toggle()
  }
  
  export function __focus () {
    return _focus()
  }
  
  export function __blur () {
    return _blur()
  }

  interface Methods {
    focus: () => boolean;
    blur: () => boolean;
    toggle: () => boolean;
    close: () => boolean;
    open: () => boolean
  }

  export const methods: Methods = {
    open: __open,
    close: __close,
    toggle: __toggle,
    focus: __focus,
    blur: __blur
  }
  
  /**
   * Lifecycle
   */
  
  onMount(() => {
    setDefaultValues();
    DOMEventListeners();
  })

  onDestroy(() => {
    DOMRemoveListeners();
  })

  /**
   * EventListeners
   */


  /**
   * close on outside click
   */
  function cbOutsideClick ( e: MouseEvent ): void {
    const closest = (e.target as HTMLElement).closest('.v2select');
    const condition = e.target === elemRoot || (closest && closest === elemRoot);
    if (!condition) {
      e.preventDefault();
      _close();
    }
  }

  /**
   * onFocus / mouseenter
   * @mouseevent
   */
  function cbMouseenter ( e: MouseEvent ) {
    _focus()
  }
  
  /**
   * onBlur / mouseleave
   * @mouseevent
   */
  function cbMouseleave ( e: MouseEvent ) {
    _blur()
  }

  /**
   * Event listeners
   * @constructor
   */
  function DOMEventListeners () {
    document.addEventListener('click', cbOutsideClick)
    elemControl.addEventListener('mouseenter', cbMouseenter)
    elemControl.addEventListener('mouseleave', cbMouseleave)
  }

  /**
   * Remove Event Listeners
   * @constructor
   */
  function DOMRemoveListeners() {
    document.removeEventListener('click', cbOutsideClick)
    elemControl.removeEventListener('mouseenter', cbMouseenter)
    elemControl.removeEventListener('mouseleave', cbMouseleave)
  }
  
  /*
   * Transitions
   */
  
  const buttonIn = {
    duration: 350,
    delay: 50
  }
  
  const buttonOut = {
    duration: 150
  }

  /**
   * Computed
   */

  $: clearButton = (
    focused &&
    _options.clearable &&
    (
      multiple &&
      values.length ||
      !multiple &&
      !!value
    )
  )
  

</script>

<div tabindex="0" bind:this={elemRoot} class={clsx(
  'v2select',
  {
    v2select__multiple: multiple,
    v2select__single: !multiple
  },
  _options.classes.container
)}>
  <div
    bind:this={elemControl}
    class={clsx(
      'v2select__controls',
      { 'v2select__controls--is-selected': open },
      { 'v2select__controls--is-focused': focused },
      _options.classes.controls
    )}
  >
    <div on:click={_handleOnClickValue} class="v2select__values">
      {#if multiple}
        {#if Array.isArray(values) && values.length}
          <div class="v2select__multi-values">
            {#each values as val, i}
              <div class="v2select__multi-value">
                <span class="v2select__multi-label">
                  {#if (_options.renderValue)}
                    {@html _options.renderValue(findText(options, val)) || findText(options, val)}
                  {:else}
                    { findText(options, val) }
                  {/if}
                </span>
                <button
                  on:click|stopPropagation|capture|preventDefault={_clearByIndex.bind(this, i)}
                  class="v2select__multi-close"
                >
                  <Times />
                </button>
              </div>
            {/each}
            {#if (_options.search)}
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
          {#if (_options.search)}
            <Search
              right={false}
              bind:this={elemSearch}
              bind:search={searchText}
              on:update={_setSearch}
              on:backspace={_backspace}
            />
          {/if}
          {#if !searchText}
            <div class="v2select__placeholder">{_options.placeholder}</div>
          {/if}
        {/if}
      {:else }
        {#if (_options.search)}
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
            <div class="v2select__single-value">
              {#if (_options.renderValue)}
                {@html _options.renderValue(text) || text}
              {:else}
                {text}
              {/if}
            </div>
          {:else}
            <div class="v2select__placeholder">{_options.placeholder}</div>
          {/if}
        {/if}
      {/if}
    </div>
    <div class="v2select__buttons">
        {#if clearButton }
          <button in:fade={buttonIn} out:fade={buttonOut} on:click|preventDefault={_clearValues} class="v2select__btn v2select__btn--close">
            <Times/>
          </button>
        {:else }
          <button in:fade={buttonIn} out:fade={buttonOut} on:click|stopPropagation|capture|preventDefault={_toggle} class="v2select__btn v2select__btn--arrow">
            <ChevronDown />
          </button>
        {/if}
    </div>
  </div>
  {#if open}
    <div class={clsx(
      "v2select__dropdown",
      _options.classes.dropdownRoot
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
                _options.classes.dropdown
              )}
              tabindex={option.disabled ? '-1' : '0'}
              on:click|preventDefault={
                () => option.disabled ? null : _select(option.value)
              }
            >
              {#if (_options.renderOption)}
                {@html _options.renderOption(option.text) || option.text}
              {:else }
                {option.text}
              {/if}
            </button>
          {/each}
        {:else}
          <span class="v2select__dropdown-placeholder">{_options.noResultsText}</span>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style type="text/scss">
  @import "scss/style.scss";
</style>