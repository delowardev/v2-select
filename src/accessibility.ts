import type { OptionBase, OptionsOrGroups, Options } from "./interface"

export type OptionContext = 'menu' | 'value'
export type GuidanceContext = 'menu' | 'input' | 'value' | 'root'
export type AriaLive = 'polite' | 'off' | 'assertive'
export type Actions = 'select' | 'deselect'


export interface GuidanceProps {
  label: string | undefined;
  context: GuidanceContext;
  searchable: boolean;
  multiple: boolean;
  disabled: boolean | null;
  selected: boolean;
}

export type AriaOnChangeProps = {
  action: 'deselect-option' | 'select-option';
  label: string;
  disabled: boolean;
}


export interface AriaOnFocusProps {
  context: OptionContext;
  focused: OptionBase;
  disabled: boolean;
  selected: boolean;
  label: string;
  options: OptionsOrGroups;
  value: Options;
}


export interface AriaOnFilterProps {
  search: string;
  result: string;
}

export interface AriaLiveMessage {
  guidance: ( props: GuidanceProps ) => string;
  onChange: ( props: AriaOnChangeProps ) => string;
  onFocus: ( props: AriaOnFocusProps ) => string;
  onFilter: ( props: AriaOnFilterProps ) => string;
}

export const ariaLiveMessage: AriaLiveMessage = {
  guidance( props: GuidanceProps ) {
    const { disabled, context, selected, searchable, multiple } = props;
    switch (context) {
      case "root":
        return `Select is focused, press Enter to open menu`;
      case "menu":
        return 'Use Up and Down to choose options' +
            (disabled ? '' : ', press Enter to select the currently focused option') +
            ', press Escape to exit the menu' +
            selected ? '' : ', press Tab to select the option and exit the menu.'
      case "input":
        return `${props['aria-label'] || 'Select'} is focused ${
            searchable ? ', type to refine list' : ''
        }, press Down to open the menu, ${
            multiple ? ' press left to focus selected values' : ''
        }`
      case 'value':
        return 'Use left and right to toggle between focused values, press Backspace to remove the currently focused value';
      default:
        return '';
    }
  },
  onChange(props: AriaOnChangeProps) {
    const { action, label = '', disabled } = props;
    switch (action) {
      case 'deselect-option':
        return `option ${label}, deselected.`;
      case 'select-option':
        return disabled
            ? `option ${label} is disabled. Select another option.`
            : `option ${label}, selected.`;
      default:
        return '';
    }
  },
  onFocus(props: AriaOnFocusProps) {
    const {
      context,
      focused,
      options,
      label = '',
      value,
      disabled,
      selected
    } = props;
    
    const getItemIndex = (arr: OptionsOrGroups, item: OptionBase) => (
        arr && arr.length ? `${arr.indexOf(item) + 1} of ${arr.length}` : ''
    );
  
    if (context === 'value' && value) {
      return `value ${label} focused, ${getItemIndex(value, focused)}.`;
    }
  
    if (context === 'menu') {
      const _disabled = disabled ? ' disabled' : '';
      const status = `${selected ? 'selected' : 'focused'}${_disabled}`;
      return `option ${label} ${status}, ${getItemIndex(options, focused)}.`;
    }
    return '';
  },
  onFilter(props: AriaOnFilterProps) {
    const { search, result } = props;
    return `${result}${
        search ? ' for search term ' + search : ''
    }.`;
  }
}
