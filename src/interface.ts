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

export interface StoreDaddy {
    update: Function;
    subscribe: Function;
    data: any;
    setValue: Function;
    addOption: Function;
    addOptions: Function;
    setValues: Function;
    setMultiple: Function;
    appendValue: Function;
    clearByIndex: Function;
}