import type { DataType, FieldType, GustybobbyOption } from "../typeconfig/form"

interface PureColumnProperty {
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

interface ColumnGroupProperty {
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

interface PureSingleRowProperty {
    type: 'pure_single'
    id: string
    data: RowData
}

interface PureMultipleRowProperty {
    type: 'pure_multiple'
    id: string
    data: RowData | RowData[]
}

interface RowGroupProperty {
    type: 'group'
    id: string
    sub_data: RowProperty['value']
}

type RowValueProperty = PureSingleRowProperty | PureMultipleRowProperty | RowGroupProperty

export interface RowProperty {
    key: string,
    value: {
        [key: string]: RowValueProperty
    }
}

interface PureSingleRow extends PureSingleRowProperty {
    max_row_span: number
    row_span?: number
}

interface PureMultipleRow extends PureMultipleRowProperty {
    max_row_span: number
    length?: number
    order?: number
    row_span?: number
}

interface RowGroup extends RowGroupProperty {
    sub_data: Row['value']
    max_row_span: number
}

type RowValue = PureSingleRow | PureMultipleRow | RowGroup

interface Row {
    key: string,
    value: {
        [key: string]: RowValue
    }
}

type ExpandedRowValue = PureSingleRow | PureMultipleRow

interface ExpandedRow {
    key: string,
    value: {
        [key: string]: ExpandedRowValue
    }
}

interface ExpandedRowArray {
    key: string,
    value: ExpandedRowValue[]
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
        table.columns = Table.getColumnsWithSpan(columns, table.max_depth)
        table.rows = Table.getRowsWithMaxSpan(rows)
        return table
    }

    static getRowSpan(rowValue: RowValue): number{
        if(rowValue.type === 'pure_multiple'){
            if(rowValue.order === undefined || rowValue.length === undefined){
                throw `${rowValue.id} type is pure_multiple but order or length is undefined`
            }
            const flooredRowSpan = Math.floor(rowValue.max_row_span / rowValue.length)
            return rowValue.order === (rowValue.length - 1)?
            rowValue.max_row_span - (flooredRowSpan*rowValue.order) : flooredRowSpan
        }
        return rowValue.max_row_span
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

    getRowsTableRows(): ExpandedRowArray[]{
        const rowsTableRows: ExpandedRowArray[] = []
        const pureColumns = Table.getPureColumns(this.columns)
        this.rows.forEach((row) => {
            for(var i=0;i<Object.values(row.value)[0].max_row_span;i++){
                rowsTableRows.push({
                    key: row.key+'_LEVEL_'+i,
                    value: Table.getRowTableRow(row, i, pureColumns),
                })
            }
        })
        return rowsTableRows
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

    private static getRowTableRow(row: Row, level: number, pureColumns: Column[]): ExpandedRowValue[]{
        let rowTableRowObject: ExpandedRow['value'] = {}
        for(const rowValue of Object.values(row.value)){
            rowTableRowObject = { ...rowTableRowObject, ...Table.getRowsAt(rowValue, level) }
        }
        const rowTableRow: ExpandedRowValue[] = Object.values(rowTableRowObject)
        const slicedPureColumns = pureColumns.slice(0,level === 0? rowTableRow.length : pureColumns.length)
        rowTableRow.sort((r1, r2) => {
            const r1Index = slicedPureColumns.findIndex((column) => column.id === r1.id)
            const r2Index = slicedPureColumns.findIndex((column) => column.id === r2.id)
            if(r1Index === -1 || r2Index === -1){
                throw `row ${row.key} skipped columns`
            }
            return r1Index - r2Index
        })
        return rowTableRow
    }

    private static getRowsAt(rowValue: RowValue, level: number): ExpandedRow['value']{
        if(rowValue.type === 'pure_single'){
            return level === 0? {
                [rowValue.id]: { ...rowValue, row_span: rowValue.max_row_span }
            } : {}
        }
        else if(rowValue.type === 'pure_multiple'){
            if(!Array.isArray(rowValue.data)){
                throw `cannot map already mapped data ${rowValue.id}`
            }
            return rowValue.data[level]? {
                [rowValue.id]: {
                    ...rowValue,
                    data: rowValue.data[level],
                    length: rowValue.data.length,
                    order: level,
                    row_span: Table.getRowSpan({
                        ...rowValue,
                        length: rowValue.data.length,
                        order: level,
                    })
                }
            } : {}
        }
        let levelRows: ExpandedRow['value'] = {}
        for(const value of Object.values(rowValue.sub_data)){
            levelRows = { ...levelRows, ...Table.getRowsAt(value, level)}
        }
        return levelRows
    }

    static getPureColumns(columns: Column[]): Column[]{
        let pureColumns: Column[] = []
        for(const column of columns){
            if(column.type === 'pure'){
                pureColumns = pureColumns.concat(column)
            } else {
                pureColumns = pureColumns.concat(Table.getPureColumns(column.sub_columns))
            }
        }
        return pureColumns
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

    private static getRowValueMaxDataLength(rowValue: RowValueProperty){
        if(rowValue.type ===  'pure_single'){
            return 1
        }
        if(rowValue.type === 'pure_multiple'){
            if(!Array.isArray(rowValue.data)){
                throw `${rowValue.id} is type pure_multiple but data is not an array`
            }
            return rowValue.data.length
        }
        let maxLength = 1
        for(const sub_value of Object.values(rowValue.sub_data)){
            maxLength = Math.max(Table.getRowValueMaxDataLength(sub_value), maxLength)
        }
        return maxLength
    }

    private static assignRowWithMaxSpan(row: RowValueProperty, maxSpan: number): RowValue{
        if(row.type === 'pure_single' || row.type === 'pure_multiple'){
            return { ...row, max_row_span: maxSpan }
        }
        return {
            ...row,
            max_row_span: maxSpan,
            sub_data: Object.fromEntries(Object.entries(row.sub_data).map(([key, value]) => [
                key, Table.assignRowWithMaxSpan(value, maxSpan)
            ]))
        }
    }

    private static getRowsWithMaxSpan(rows: RowProperty[]): Row[]{
        const rowsWithMaxSpan: Row[] = []
        for(const row of rows){
            let maxSpan = 1
            for(const [key, value] of Object.entries(row.value)){
                if(key !== value.id){
                    throw `key ${key} mismatch with id ${value.id}`
                }
                maxSpan = Math.max(Table.getRowValueMaxDataLength(value), maxSpan)
            }
            rowsWithMaxSpan.push({
                key: row.key,
                value: Object.fromEntries(Object.entries(row.value).map(([key, value]) => [
                    key, Table.assignRowWithMaxSpan(value, maxSpan)
                ]))
            })
        }
        return rowsWithMaxSpan
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
                id: 'year',
                label: 'Year',
                data_type: 'STRING',
                field_type: 'SHORTANS',
            },
        ]
    },
    {
        type: 'group',
        id: 'medical_info',
        label: 'Medical Info',
        sub_columns: [
            {
                type: 'group',
                id: 'restrictions',
                label: 'Restrictions',
                sub_columns: [
                    {
                        type: 'group',
                        id: 'allergies',
                        label: 'Allergies',
                        sub_columns: [
                            {
                                type: 'pure',
                                id: 'drug',
                                label: 'Drug',
                                data_type: 'STRING',
                                field_type: 'SHORTANS',
                            },
                            {
                                type: 'pure',
                                id: 'food',
                                label: 'Food',
                                data_type: 'STRING',
                                field_type: 'SHORTANS',
                            },
                        ]
                    },
                    {
                        type: 'pure',
                        id: 'other',
                        label: 'Others',
                        data_type: 'STRING',
                        field_type: 'SHORTANS',
                    },
                ]
            },
            {
                type: 'pure',
                id: 'age',
                label: 'Age',
                data_type: 'STRING',
                field_type: 'SHORTANS',
            },
        ]
    },
]

export const exampleRows: RowProperty[] = [
    {
        key: '6522781804',
        value: {
            student_id: {
                type: 'pure_single',
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
                                type: 'pure_multiple',
                                id: 'first',
                                data: ['Gustybob','Gustybobby']
                            },
                            last: {
                                type: 'pure_multiple',
                                id: 'last',
                                data: ['Squarepants', 'Trianglepants'],
                            }
                        }
                    },
                    year: {
                        type: 'pure_single',
                        id: 'year',
                        data: '3',
                    }
                }
            }
        }
    }
]