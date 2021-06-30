<script lang="ts">
  import clsx from "clsx";
  import {onDestroy, onMount} from "svelte";
  import {fly, scale} from "svelte/transition";
  import ChevronDown from "./components/icons/ChevronDown.svelte";
  import Times from "./components/icons/Times.svelte";
  import {findText, findMyOption} from "./helper";
  import type {BoolFunc, Callback, OptionProps, Options, SingleArgBoolFunc, SingleArgVoidFunc} from "./interface";
  import Search from "./Search.svelte";
  import {createStore} from "./store";
  import A11yText from "./A11yText.svelte";
  import { ariaLiveMessage } from "./accessibility"
  import type { GuidanceProps } from "./accessibility"

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
    setFocusedOption,
  
    search: stateSearch,
    value: stateValue,
    values: stateValues,
    options: stateOptions,
    focusedOption: stateFocusedOption
  } = createStore();

  

  // Default options
  const defaultOptions: OptionProps = {
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
  export let selectOptions: OptionProps;

  selectOptions.classes = Object.assign({}, defaultOptions.classes, selectOptions.classes);
  selectOptions.callback = <Callback>Object.assign({}, defaultOptions.callback, selectOptions.callback);
  const _options = <OptionProps>Object.assign({}, defaultOptions, selectOptions);


  // ... //
  select.style.display = "none";

  /**
   * Variables
   */

  const multiple = select.multiple;
  let open = false;
  let focused = false;
  let value = "";
  let options = [];
  let text = "";
  let values = [];
  let filteredOptions = [];
  let searchText = "";
  let ariaSelected = "";
  let ariaContext = "";
  let focusedOption = "";
  let searchFocused = false;
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
  
  stateFocusedOption.subscribe(v => {
    focusedOption = v;
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

  function getInitialOptions(): Options {
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
    
    const { guidance } = ariaLiveMessage
  
    // callback onFocus
    if (onFocus instanceof Function) {
      onFocus()
    }
  
    focused = true;
    
    const props = <GuidanceProps> {
      label: "",
      disabled: false,
      context: "root",
      searchable: _options.search,
      multiple,
      selected: true
    }
    
    ariaSelected = guidance(props);
  
    return true
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

  function _clearValues(): void {
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
   * Dropdown Item Focus
   */

  function _optionMouseEnter(e) {
    setFocusedOption(e.target?.dataset?.value || "")
  }
  
  function _dropdownMouseLeave() {
    setFocusedOption("")
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
  
  function _onSearchFocus() {
    searchFocused = true;
  }
  
  function _onSearchBlur() {
    searchFocused = false;
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
    clearSearch: Function;
    search: SingleArgVoidFunc<string>;
    select: SingleArgBoolFunc<string>;
    clearByIndex: SingleArgVoidFunc<number>;
    clear: Function;
    focus: BoolFunc;
    blur: BoolFunc;
    toggle: BoolFunc;
    close: BoolFunc;
    open: BoolFunc;
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
    if (e.target !== document.activeElement) _blur()
  }
  
  function cbKeyDown(e: KeyboardEvent) {
    console.log(e.code)
    const target = e.target as HTMLButtonElement;
    const isSearch = target?.classList?.contains('v2select__search-skeleton');
    
    // focus and toggle menu
    if (e.code === "Enter") {
      e.preventDefault()
      _toggle()
    }
    
    if (e.code === "Space") {
      if (!isSearch) {
        e.preventDefault();
      }
      _open()
    }
    
    // close menu
    if (e.code === "Escape") {
      _close()
    }
    
    // clear value
    if (e.code === "Backspace" && !isSearch) {
      _clearValues()
    }
    
    // up and down
    if (e.code === "ArrowDown") {
    
    }
    
    if (e.code === "ArrowUp") {
    
    }
    
    
    
    
    
  }

  /**
   * Event listeners
   * @constructor
   */
  function DOMEventListeners() {
    document.addEventListener('click', cbOutsideClick)
    
    // focus
    elemControl.addEventListener('mouseenter', cbMouseenter)
    elemControl.addEventListener('focus', _focus)
    
    // blur
    elemControl.addEventListener('mouseleave', cbMouseleave)
    elemControl.addEventListener('blur', _blur)
  
    elemControl.addEventListener("keydown", cbKeyDown)
  }

  /**
   * Remove Event Listeners
   * @constructor
   */
  function DOMRemoveListeners() {
    document.removeEventListener('click', cbOutsideClick)
    
    // focus
    elemControl.removeEventListener('mouseenter', cbMouseenter)
    elemControl.removeEventListener('focus', _focus)
    
    // blur
    elemControl.removeEventListener('mouseleave', cbMouseleave)
    elemControl.removeEventListener('blur', _blur)
    
    elemControl.removeEventListener("keydown", cbKeyDown);
  }

  /*
   * Transitions
   */



  /**
   * Computed
   */

  let clearButton;
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

<div bind:this={elemRoot} class={clsx({
    'v2select': true,
    v2select__multiple: multiple,
    v2select__single: !multiple,
    [_options.classes.container]: !!_options.classes.container
})}>
  
  <A11yText>
    <span class="v2select__aria-selected">{ariaSelected}</span>
    <span class="v2select__aria-context">{ariaContext}</span>
  </A11yText>
  
  <div
    role="button"
    aria-haspopup="listbox"
    aria-expanded={open}
    on:click={_handleOnClickValue}
    tabindex="0"
    bind:this={elemControl}
    class={clsx({
      'v2select__controls': true,
      'v2select__controls--is-selected': open,
      'v2select__controls--is-focused': focused || searchFocused,
      [_options.classes.controls]: !!_options.classes.controls
    })}
  >
    <div class="v2select__values">
      {#if multiple}
        {#if Array.isArray(values) && values.length}
          <div class="v2select__multi-values">
            {#each values as val, i}
              <div tabindex="0" role="button" class="v2select__multi-value" in:fly>
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
                  tabindex="-1"
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
                on:focus={_onSearchFocus}
                on:blur={_onSearchBlur}
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
              on:focus={_onSearchFocus}
              on:blur={_onSearchBlur}
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
            on:focus={_onSearchFocus}
            on:blur={_onSearchBlur}
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
      <ul on:mouseleave={_dropdownMouseLeave} bind:this={dropdownElem} tabindex="0" role="listbox" class="v2select__dropdown-inner">
        {#if Array.isArray(filteredOptions) && filteredOptions.length}
          {#each filteredOptions as option}
            <li
              data-value={option.value}
              on:mouseenter={_optionMouseEnter}
              aria-selected={option.value === value && !multiple}
              role="option"
              aria-disabled={option.disabled}
              class={clsx({
                  [_options.classes.dropdown]: !!_options.classes.dropdown,
                  'v2select__dropdown-item': true,
                  'v2select__dropdown--selected': option.value === value && !multiple,
                  'v2select__dropdown--is-disabled': option.disabled === true,
                  'v2select__dropdown--is-focused': focusedOption === option.value
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
