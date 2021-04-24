import { writable } from 'svelte/store';
import type { State } from "./interface";

const defaultState: State = {
  value: "",
  values: [],
  options: [],
  multiple: false
};

export default writable(defaultState)
