export interface SelectValue {
    text: String;
    value: String;
}

export interface State {
    value: SelectValue | null;
    values: SelectValue[];
    multiple: Boolean
}