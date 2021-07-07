<script lang="ts">
  
  import { createEventDispatcher } from "svelte";
  import clsx from "clsx";
  const dispatch = createEventDispatcher();
  
  export let search: string;
  export let right: boolean;
  export let isOpen: boolean;
  // elem binding
  let elem: HTMLSpanElement;
  
  
  export function focus() {
    if (elem) {
      elem.focus();
    }
  }
  
  function _search(e) {
    dispatch("update", {
      value: e.target.textContent
    });
  }
  
  function onKeyDown(e) {
    // dispatch "backspace" event
    if (e.code === "Backspace" && !search) {
      dispatch("backspace");
    }
    
    // prevent if it's not opened
    if (e.code === "Space") {
      if (!search && !isOpen) {
        e.preventDefault();
      }
    }
  }
  
  function bindEvents () {
    dispatch("focus")
    elem.addEventListener("keydown", onKeyDown);
  }
  
  function unbindEvents () {
    dispatch("blur")
    elem.removeEventListener("keydown", onKeyDown);
  }

</script>

<div class="v2select__search">
  <span
    aria-hidden="true"
    on:focus={bindEvents}
    on:blur={unbindEvents}
    on:input={_search}
    contenteditable="true"
    bind:this={elem}
    bind:textContent={search}
    class={clsx('v2select__search-skeleton', {
      'v2select__is-left': !right,
    })}
  >{search}</span>
</div>


<style type="text/scss">
  @import "scss/search.scss";
</style>
