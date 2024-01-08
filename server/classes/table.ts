import type { DataType, FieldType, GustybobbyOption } from "../typeconfig/form"

export interface PureColumnProperty {
    type: 'pure'
    id: string
    label: string | JSX.Element
    data_type: DataType
    field_type: FieldType
    options?: GustybobbyOption[]
}

interface PureColumn extends PureColumnProperty{
    col_span: number
    row_span: number
}

export interface ColumnGroupProperty {
    type: 'group'
    id: string
    label: string | JSX.Element
    sub_columns: ColumnProperty[]
}

interface ColumnGroup extends ColumnGroupProperty {
    sub_columns: Column[]
    col_span: number
    row_span: number
}

export type ColumnProperty = PureColumnProperty | ColumnGroupProperty

type Column = PureColumn | ColumnGroup

type RowData = string | JSX.Element

interface PureRowProperty {
    type: 'pure'
    id: string
    data: RowData | RowData[]
}

interface RowGroupProperty {
    type: 'group'
    id: string
    sub_data: RowProperty
}

export interface RowProperty {
    [key: string]: PureRowProperty | RowGroupProperty
}

interface PureRow extends PureRowProperty {
    row_span: number
}

interface Row {
    [key: string]: PureRow | RowGroupProperty
} 

export interface TableProperty {
    columns: Column[]
    rows: Row[]
    max_depth: number
}

export default class Table {
    columns: TableProperty['columns']
    rows: TableProperty['rows']
    max_depth: TableProperty['max_depth']

    constructor(table: TableProperty){
        this.columns = table.columns
        this.rows = table.rows
        this.max_depth = table.max_depth
    }

    static initialize({ columns, rows }: { columns: ColumnProperty[], rows: RowProperty[] }): Table{
        const table = new Table({ columns: [], rows: [], max_depth: 0 })
        table.max_depth = Table.getColumnsMaxDepth(columns)
        table.columns = this.getColumnsWithSpan(columns, table.max_depth)
        return table
    }

    getColumnsTableRows(){
        const columnsRows: Column[][] = []
        for(var i=0;i<=this.max_depth;i++){
            let columns: Column[] = []
            for(const column of this.columns){
                columns = columns.concat(Table.getColumnsAt(column, i))
            }
            columnsRows.push(columns)
        }
        return columnsRows
    }

    private static getColumnsAt(column: Column, relativeDepth: number){
        if(relativeDepth === 0){
            return [column]
        }
        if(column.type === 'pure'){
            return []
        }
        let columns: Column[] = []
        for(const subColumn of column.sub_columns){
            columns = columns.concat(Table.getColumnsAt(subColumn, relativeDepth - 1))
        }
        return columns
    }

    private static calculateColSpan(columns: ColumnProperty[]): number{
        let colSpan = 0
        for(const column of columns){
            if(column.type === 'pure'){
                colSpan += 1
            } else {
                colSpan += Table.calculateColSpan(column.sub_columns)
            }
        }
        return colSpan
    }

    private static getColumnDepth(column: ColumnProperty): number{
        if(column.type === 'pure'){
            return 0
        }
        let maxDepth = 0
        for(const subColumn of column.sub_columns){
            maxDepth = Math.max(Table.getColumnDepth(subColumn), maxDepth)
        }
        return maxDepth + 1
    }

    private static getColumnsMaxDepth(columns: ColumnProperty[]): number{
        let maxDepth = 0
        for(const column of columns){
            maxDepth = Math.max(Table.getColumnDepth(column), maxDepth)
        }
        return maxDepth
    }

    private static getColumnsWithSpan(columns: ColumnProperty[], rootMaxDepth: number): Column[]{
        return columns.map((column): Column => {
            if(column.type === 'group'){
                if(column.sub_columns.length === 0){
                    throw 'sub columns cannot be empty'
                }
                return ({
                    ...column,
                    sub_columns: Table.getColumnsWithSpan(column.sub_columns, rootMaxDepth - 1),
                    col_span: Table.calculateColSpan(column.sub_columns),
                    row_span: 1,
                })
            }
            return ({
                ...column,
                col_span: 1,
                row_span: rootMaxDepth + 1
            })
        })
    }

    private static getRowValueMaxDataLength(rowValue: PureRowProperty | RowGroupProperty){
        if(rowValue.type ===  'pure'){
            return 1
        }
        let maxLength = 1
        for(const sub_value of Object.values(rowValue.sub_data)){
            maxLength = Math.max(Table.getRowValueMaxDataLength(sub_value), maxLength)
        }
        return maxLength
    }

    private getRowsWithSpan(rows: RowProperty[]){
        for(const row of rows){
            for(const [key, value] of Object.entries(row)){
                if(key !== value.id){
                    throw `key ${key} mismatch with id ${value.id}`
                }
                
            }
        }
    }
}

export const exampleColumns: ColumnProperty[] = [
    {
        type: 'pure',
        id: 'student_id',
        label: 'Student ID',
        data_type: 'STRING',
        field_type: 'SHORTANS',
    },
    {
        type: 'group',
        id: 'personal_info',
        label: 'Personal Info',
        sub_columns: [
            {
                type: 'group',
                id: 'name',
                label: 'Name',
                sub_columns: [
                    {
                        type: 'pure',
                        id: 'first',
                        label: 'First',
                        data_type: 'STRING',
                        field_type: 'SHORTANS',
                    },
                    {
                        type: 'pure',
                        id: 'last',
                        label: 'Last',
                        data_type: 'STRING',
                        field_type: 'SHORTANS',
                    },
                ]
            },
            {
                type: 'pure',
                id: 'f',
                label: 'Year',
                data_type: 'STRING',
                field_type: 'SHORTANS',
            },
        ]
    },
    {
        type: 'group',
        id: 'g',
        label: 'Medical Info',
        sub_columns: [
            {
                type: 'group',
                id: 'h',
                label: 'Restrictions',
                sub_columns: [
                    {
                        type: 'group',
                        id: 'i',
                        label: 'Allergies',
                        sub_columns: [
                            {
                                type: 'pure',
                                id: 'j',
                                label: 'Drug',
                                data_type: 'STRING',
                                field_type: 'SHORTANS',
                            },
                            {
                                type: 'pure',
                                id: 'k',
                                label: 'Food',
                                data_type: 'STRING',
                                field_type: 'SHORTANS',
                            },
                        ]
                    },
                    {
                        type: 'pure',
                        id: 'l',
                        label: 'Others',
                        data_type: 'STRING',
                        field_type: 'SHORTANS',
                    },
                ]
            },
            {
                type: 'pure',
                id: 'm',
                label: 'Age',
                data_type: 'STRING',
                field_type: 'SHORTANS',
            },
        ]
    },
]

const rows: RowProperty[] = [
    {
        student_id: {
            type: 'pure',
            id: 'student_id',
            data: '6522781804'
        },
        personal_info: {
            type: 'group',
            id: 'personal_info',
            sub_data: {
                name: {
                    type: 'group',
                    id: 'name',
                    sub_data: {
                        first: {
                            type: 'pure',
                            id: 'first',
                            data: 'Gustybob'
                        },
                        last: {
                            type: 'pure',
                            id: 'last',
                            data: 'Trianglepants'
                        }
                    }
                }
            }
        }
    }
]