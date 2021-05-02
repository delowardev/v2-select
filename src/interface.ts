export interface SelectOption {
    text: string;
    value: string;
    disabled?: boolean;
}

export interface State {
    search: string;
    value: string;
    values: string[];
    options: SelectOption[];
    multiple: boolean
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
    getFilteredOptions: Function;
    clearValues: Function;
    setSearch: Function;
    backspace: Function;
}