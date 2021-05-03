import { get, writable } from 'svelte/store';
import type { State, SelectOption, StoreDaddy } from "./interface";

const _state: State = {
  search: "",
  value: "",
  values: [],
  options: [],
  multiple: false
};

export function createStore(): StoreDaddy {
  const store = writable(_state);

  /**
   * Store Getter
   */

  function state(): State {
    return get(store); // always get latest value
  };

  function getFilteredOptions() {
    const { values, options, search } = state();
    return options.filter(option => {
      if (values.includes(option.value)) {
        return false;
      }

      if (!option.value.toLowerCase().trim().startsWith(search.toLowerCase().trim())) {
        return false;
      }

      return true;
    });
  }


  /**
   * Store Mutation/Setter
   */

  function update(options) {
    store.update((prevState: State): State => ({
      ...prevState,
      ...options
    }))
  }

  function addOption(option: SelectOption) {
    const options = JSON.parse(JSON.stringify(state().options));
    options.push(option);
    update({options});
  }

  function addOptions(options_: SelectOption[], clean: false) {
    const options = clean ? [] : JSON.parse(JSON.stringify(state().options));
    options.push(...options_);
    update({options});
  }


  function setValue(value: string): void {
    if (state().value !== value) {
      update({value, values: []});
    }
  }

  function setValues(values: string[]) {
    update({values});
  }

  function setMultiple( multiple = true) {
    if(state().multiple !== multiple) {
      update({multiple});
    }
  }

  function appendValue(value) {
    const st = state();
    if (value) {
      const index = st.values.findIndex(v => v === value);
      const _values = st.values;
      if (index === -1) {
        _values.push(value);
        update({values: _values});
      }
    }
  }

  function clearByIndex(index) {
    const { values } = state();
    if (values[index]) {
      values.splice(index, 1);
      update({values});
    }
  }

  function clearValues() {
    update({values: [], value: ""});
  }

  function setSearch(search) {
    update({search});
  }

  function backspace() {
    const { values } = state();
    values.pop();
    update({values, value: ""});
  }


  return {
    update: store.update,
    subscribe: store.subscribe,
    data: store,
    setValue,
    addOption,
    addOptions,
    setValues,
    setMultiple,
    appendValue,
    clearByIndex,
    getFilteredOptions,
    clearValues,
    setSearch,
    backspace
  }

}