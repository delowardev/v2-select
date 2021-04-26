import { get, writable } from 'svelte/store';
import type { State } from "./interface";

const defaultState: State = {
  value: "",
  values: [],
  options: [],
  multiple: false
};


function createStore(): {
  update: Function,
  subscribe: Function,
  setValue: Function,
  data: State
} {
  const store = writable(defaultState);
  const state = get(store);

  function setValue(value: String): void {
    if (state.value !== value) {
      store.update((prevState: State) => ({
        ...prevState,
        value
      }))
    }
  }


  return {
    update: store.update,
    subscribe: store.subscribe,
    setValue,
    data: state as State
  }

}


export default createStore