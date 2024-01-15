import type { DataType, FieldType, FormResponse } from "./form";

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

export interface MemberReferencedResponses {
    [member_id: string]: FormResponse
}