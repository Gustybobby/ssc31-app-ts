import type { DataType, FieldType } from "./form";

export interface TableColumnConfig {
    id: string;
    label: string;
    options: string[];
    data_type: DataType;
    field_type: FieldType;
    order: number
    active: boolean
    form_id: string
}