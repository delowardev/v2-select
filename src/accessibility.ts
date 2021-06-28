import type { OptionBase } from "./interface"

export type OptionContext = 'menu' | 'value'
export type GuidanceContext = 'menu' | 'input' | 'value'
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

}

export const ariaLiveMessage = {
  guidance( props: GuidanceProps ) {
  
  }
}
