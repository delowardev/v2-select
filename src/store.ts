import { get, writable } from 'svelte/store';
import type { State, SelectOption } from "./interface";

const _state: State = {
  value: "",
  values: [],
  options: [],
  multiple: false
};

interface StoreDaddy {
  update: Function;
  subscribe: Function;
  data: State;
  setValue: Function;
}

function createStore(): StoreDaddy {
  const store = writable(_state);

  function state(): State {
    return get(store); // always get latest value
  };

  function setValue(value: String): void {
    if (state().value !== value) {
      store.update((prevState: State) => ({
        ...prevState,
        value
      }))
    }
  }

  function addOption(option: SelectOption) {
    const options = JSON.parse(JSON.stringify(state().options));
    options.push(option);
    store.update((prevState: State) => ({
      ...prevState,
      options
    }))
  }

  function addOptions(options_: SelectOption[], clean: false) {
    const options = clean ? [] : JSON.parse(JSON.stringify(state().options));
    options.push(...options_);
    store.update((prevState: State) => ({
      ...prevState,
      options
    }))
  }


  return {
    update: store.update,
    subscribe: store.subscribe,
    setValue,
    data: state()
  }

}


export default createStore