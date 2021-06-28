<span aria-live="polite" aria-atomic="false" aria-relevant="text" class="v2select__a11y-text">
  <slot />
</span>

<style>
  .v2select__a11y-text {
    z-index: 9999;
    border: 0;
    clip: rect(1px, 1px, 1px, 1px);
    height: 1px;
    width: 1px;
    position: absolute;
    overflow: hidden;
    padding: 0;
    white-space: nowrap;
  }
</style>
