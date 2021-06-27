<script lang="ts">
  
  import { createEventDispatcher } from "svelte";
  import clsx from "clsx";
  const dispatch = createEventDispatcher();
  
  export let search: string;
  export let right: boolean;
  // elem binding
  let elem: HTMLSpanElement;
  
  
  export function focus() {
    if (elem) {
      elem.focus();
    }
  }
  
  function _search(e) {
    dispatch('update', {
      value: e.target.textContent
    });
  }
  
  function onDelete(e) {
    let char = (typeof e !== 'undefined') ? e.keyCode : e.which
    if (char === 8 && !search) {
      dispatch('backspace');
    }
  }
  
  function bindEvents () {
    console.log('bind');
    elem.addEventListener("keydown", onDelete);
  }
  
  function unbindEvents () {
    console.log('unbind');
    elem.removeEventListener("keydown", onDelete);
  }

</script>

<div class="v2select__search">
  <span
    aria-hidden="true"
    tabindex="-1"
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