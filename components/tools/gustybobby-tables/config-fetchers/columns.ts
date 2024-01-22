import type { ColumnProperty } from "@/server/classes/table";

export const memberColumns: ColumnProperty[] = [
    {
        type: 'pure',
        id: 'role',
        label: 'Role',
        data_type: 'ROLE',
        field_type: 'OPTIONS',
    },
    {
        type: 'pure',
        id: 'position',
        label: 'Position',
        data_type: 'POSITION',
        field_type: 'OPTIONS',
    },
]