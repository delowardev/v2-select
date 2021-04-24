export interface SelectOption {
    text: String;
    value: String;
    disabled?: Boolean;
}

export interface State {
    value: String;
    values: String[];
    options: SelectOption[];
    multiple: Boolean
}