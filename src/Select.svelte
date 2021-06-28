<script lang="ts">
  import clsx from "clsx";
  import {onDestroy, onMount} from "svelte";
  import {fly, scale} from "svelte/transition";
  import ChevronDown from "./components/icons/ChevronDown.svelte";
  import Times from "./components/icons/Times.svelte";
  import {findText, findMyOption} from "./helper";
  import type { OptionBase } from "./interface";
  import Search from "./Search.svelte";
  import {createStore} from "./store";
  import A11yText from "./A11yText.svelte";

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

  interface OptionBases {
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
    renderOption: (string, dataset: DOMStringMap) => string | null;
    renderValue: (string, dataset: DOMStringMap) => string | null;
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
  const defaultOptions: OptionBases = {
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
  export let selectOptions: OptionBases;

  selectOptions.classes = Object.assign({}, defaultOptions.classes, selectOptions.classes);
  selectOptions.callback = <Callback>Object.assign({}, defaultOptions.callback, selectOptions.callback);
  const _options = <OptionBases>Object.assign({}, defaultOptions, selectOptions);


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
  let dropdownElem: HTMLUListElement;
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
    addOptions(getInitialOptions(), true);
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

  function getInitialOptions(): OptionBase[] {
    return Array.from(select.options).map(
      ({value, text, disabled, dataset}) => ({value, text, disabled, dataset})
    )
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
    onBlur,
    onBeforeChange,
    onChange
  } = _options.callback as Callback

  /**
   * Change/Set select value
   * @param value
   */

  function _select(value) {
  
    // callback onBeforeChange
    if (
      onBeforeChange instanceof Function &&
      onBeforeChange() === false
    ) {
      return false
    }
  
    setSearch("");
  
    if (multiple) {
      appendValue(value);
    } else {
      setValue(value);
    }
  
    // callback onChange
    if (onChange instanceof Function) {
      onChange()
    }
  
    if (!multiple) {
      _close();
    }
  
    return true
  
  }


  /**
   * Open Dropdown
   */
  function _open() {
    if (open) return false
  
    // callback onBeforeOpen
    if (onBeforeOpen instanceof Function) {
      if (onBeforeOpen() !== false) {
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

  /**
   * Close dropdown
   */
  function _close() {
    if (!open) return false;
  
    // callback onBeforeClose
    if (onBeforeClose instanceof Function) {
      if (onBeforeClose() !== false) {
        return !(open = false);
      }
      return false;
    }
  
    open = false
  
    // callback onClose
    if (onClose) {
      onClose()
    }
  
    return true
  }

  /**
   * Toggle dropdown
   */
  function _toggle() {
    if (open) {
      _close()
    } else {
      _open()
    }
    return open;
  }

  /**
   * Focus select
   */
  function _focus() {
    if (focused) return false;
  
    // callback onFocus
    if (onFocus instanceof Function) {
      onFocus()
    }
  
    return (focused = true)
  }

  /**
   * Blur select
   */
  function _blur() {
    if (!focused) return false;
  
    // callback onBlur
    if (onBlur instanceof Function) {
      onBlur()
    }
  
    return !(focused = false)
  }

  function _clearByIndex(index) {
    return clearByIndex(index);
  }

  function _clearValues() {
    clearValues();
    setSearch("");
  }

  function _handleOnClickValue() {
    _toggle();
    if (elemSearch) {
      elemSearch.focus();
    }
  }

  function _search(value: string) {
    return setSearch(value)
  }

  /**
   * Custom events func
   */

  function _setSearch(e) {
    _search(e.detail.value);
    if (value) {
      _open()
    }
  }

  function _backspace() {
    backspace();
  }

  /**
   * Accessible methods
   */


  export function __open() {
    return _open()
  }

  export function __close() {
    return _close()
  }

  export function __toggle() {
    return _toggle()
  }

  export function __focus() {
    return _focus()
  }

  export function __blur() {
    return _blur()
  }

  export function __select(value: string) {
    return _select(value)
  }
  
  export function __clearByIndex(index: number) {
    return _clearByIndex(index)
  }
  
  export function __clear() {
    return _clearValues()
  }
  
  export function __search(value: string) {
    return _search(value)
  }
  
  export function __clearSearch() {
    return _search("")
  }

  interface Methods {
    focus: () => boolean;
    blur: () => boolean;
    toggle: () => boolean;
    close: () => boolean;
    open: () => boolean;
    select: (value: string) => boolean;
    clearByIndex: (index: number) => boolean;
    clear: () => void;
    search: (value: string) => void;
    clearSearch: () => void;
  }

  export const methods: Methods = {
    open: __open,
    close: __close,
    toggle: __toggle,
    focus: __focus,
    blur: __blur,
    select: __select,
    clearByIndex: __clearByIndex,
    clear: __clear,
    search: __search,
    clearSearch: __clearSearch
  }

  /**
   * Lifecycle
   */

  onMount(() => {
    setDefaultValues();
    DOMEventListeners();
    console.log(elemSearch)
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
  function cbOutsideClick(e: MouseEvent): void {
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
  function cbMouseenter(e: MouseEvent) {
    _focus()
  }

  /**
   * onBlur / mouseleave
   * @mouseevent
   */
  function cbMouseleave(e: MouseEvent) {
    _blur()
  }
  
  function cbKeyDown(e: KeyboardEvent) {
    console.log(e.key)
    
    
  }

  /**
   * Event listeners
   * @constructor
   */
  function DOMEventListeners() {
    document.addEventListener('click', cbOutsideClick)
    elemControl.addEventListener('mouseenter', cbMouseenter)
    elemControl.addEventListener('mouseleave', cbMouseleave)
    elemRoot.addEventListener("keydown", cbKeyDown)
  }

  /**
   * Remove Event Listeners
   * @constructor
   */
  function DOMRemoveListeners() {
    document.removeEventListener('click', cbOutsideClick)
    elemControl.removeEventListener('mouseenter', cbMouseenter)
    elemControl.removeEventListener('mouseleave', cbMouseleave)
    elemRoot.removeEventListener("keydown", cbKeyDown);
  }

  /*
   * Transitions
   */



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

<div tabindex="0" bind:this={elemRoot} class={clsx({
    'v2select': true,
    v2select__multiple: multiple,
    v2select__single: !multiple,
    [_options.classes.container]: !!_options.classes.container
})}>
  
  <A11yText>
    Hello
  </A11yText>
  
  <div
    bind:this={elemControl}
    class={clsx({
      'v2select__controls': true,
      'v2select__controls--is-selected': open,
      'v2select__controls--is-focused': focused,
      [_options.classes.controls]: !!_options.classes.controls
    })}
  >
    <div role="button" aria-haspopup="listbox" aria-expanded={open} on:click={_handleOnClickValue} class="v2select__values">
      {#if multiple}
        {#if Array.isArray(values) && values.length}
          <div class="v2select__multi-values">
            {#each values as val, i}
              <div class="v2select__multi-value" in:fly>
                <span class="v2select__multi-label">
                  {#if (_options.renderValue)}
                    {@html _options.renderValue(
                      findMyOption(options, val)?.text || "",
                      findMyOption(options, val)?.dataset || []
                    )}
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
    <div aria-hidden="true" class="v2select__buttons">
        {#if clearButton }
          <button
            tabindex="-1"
            in:scale={{ duration: 150 }}
            out:fly
            on:click|preventDefault={_clearValues}
            class="v2select__btn v2select__btn--close"
          >
            <Times/>
          </button>
        {:else }
          <button
            tabindex="-1"
            in:scale={{ duration: 150 }}
            out:fly
            on:click|stopPropagation|capture|preventDefault={_toggle}
            class="v2select__btn v2select__btn--arrow"
          >
            <ChevronDown />
          </button>
        {/if}
    </div>
  </div>
  {#if open}
    <div in:fly class={clsx(
      "v2select__dropdown",
      _options.classes.dropdownRoot
    )}>
      <ul bind:this={dropdownElem} tabindex="0" role="listbox" class="v2select__dropdown-inner">
        {#if Array.isArray(filteredOptions) && filteredOptions.length}
          {#each filteredOptions as option}
            <li
              aria-selected={option.value === value && !multiple}
              role="option"
              aria-disabled={option.disabled}
              class={clsx({
                  [_options.classes.dropdown]: !!_options.classes.dropdown,
                  'v2select__dropdown-item': true,
                  'v2select__dropdown--selected': option.value === value && !multiple,
                  'v2select__dropdown--is-disabled': option.disabled === true
              })}
              on:click|preventDefault={
                () => option.disabled ? null : _select(option.value)
              }
            >
              {#if (_options.renderOption)}
                {@html _options.renderOption(option.text, option.dataset) || option.text}
              {:else }
                {option.text}
              {/if}
            </li>
          {/each}
        {:else}
          <span class="v2select__dropdown-placeholder">{_options.noResultsText}</span>
        {/if}
      </ul>
    </div>
  {/if}
</div>

<style type="text/scss">
  @import "scss/style.scss";
</style>
