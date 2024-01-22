import { extractTextFromResponseData } from "../inputfunction"
import type { DataType, FieldType, GustybobbyOption } from "../typeconfig/form"
import { FormConfigProperty } from "./forms/formconfig"

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
    id: string,
    raw_data: string,
    data: RowData
}

interface PureMultipleRowProperty {
    type: 'pure_multiple'
    id: string
    raw_data: string,
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

export type TransformationOperator = 'has' | 'starts' | 'ends' | '=' | '>' | '<'

export interface TransformationSort {
    column_id: string,
    direction: 'asc' | 'desc'
}

export interface TransformationFilter {
    column_id: string,
    value: string,
    operator: TransformationOperator
}

export interface TableProperty {
    columns: Column[]
    original_columns: Column[]
    rows: Row[]
    original_rows: Row[]
    max_depth: number
    transformation?: {
        sorts?: TransformationSort[]
        filters?: {
            [column_id: string]: TransformationFilter
        }
    }
}

export default class Table {
    columns: TableProperty['columns']
    original_columns: TableProperty['columns']
    rows: TableProperty['rows']
    original_rows: TableProperty['rows']
    max_depth: TableProperty['max_depth']
    transformation?: TableProperty['transformation']

    constructor(table: TableProperty){
        this.columns = table.columns
        this.original_columns = table.original_columns
        this.rows = table.rows
        this.original_rows = table.original_rows
        this.max_depth = table.max_depth
    }

    static clone(table: Table): Table{
        return new Table({
            ...table,
            columns: Table.cloneColumns(table.columns),
            original_columns: Table.cloneColumns(table.original_columns),
            rows: Table.cloneRows(table.rows),
            original_rows: Table.cloneRows(table.original_rows),
        })
    }

    static initialize({ columns, rows, transformation }: {
        columns: ColumnProperty[],
        rows: RowProperty[],
        transformation?: TableProperty['transformation']
    }): Table{
        const table = new Table({ columns: [], rows: [], max_depth: 0, original_columns: [], original_rows: [] })
        table.max_depth = Table.getColumnsMaxDepth(columns)
        table.columns = Table.getColumnsWithSpan(columns, table.max_depth)
        table.original_columns = Table.getColumnsWithSpan(columns, table.max_depth) 
        table.rows = Table.getRowsWithMaxSpan(rows)
        table.original_rows = Table.getRowsWithMaxSpan(rows)
        table.transformation = transformation
        table.transform()
        return table
    }

    static formColumnAdapter({ field_order, form_fields, id, title }: FormConfigProperty, options?: {
        label_max_length?: number
    }): ColumnProperty{
        if(!field_order || !form_fields || !id || !title){
            throw 'form column adapter property is undefined'
        }
        const sub_columns: ColumnProperty[] = []
        for(const field_id of field_order){
            if(form_fields[field_id].field_type === 'INFO'){
                continue
            }
            sub_columns.push({
                type: 'pure',
                id: field_id,
                label: form_fields[field_id].label.slice(0, options?.label_max_length),
                data_type: form_fields[field_id].data_type,
                field_type: form_fields[field_id].field_type,
                options: form_fields[field_id].options,
            })
        }
        return { id, sub_columns, type: 'group', label: title }
    }
    
    static formResponseAdapter({ form_id, id, member_id, response,
    }: {
        form_id: string,
        id: string,
        member_id: string,
        response: { [key: string]: string }
    },
    form_config: FormConfigProperty,
    options?: {
        reference_key?: 'id' | 'member_id'
    }
    ): RowProperty{
        if(!form_config.field_order || !form_config.form_fields){
            throw 'field order or form_fields is undefined'
        }
        const rowValueProperty: RowValueProperty = {
            type: 'group',
            id: form_id,
            sub_data: Object.fromEntries(form_config.field_order
                .filter((field_id) => form_config.form_fields?.[field_id].field_type !== 'INFO')
                .map((field_id) => {
                    const fieldType = form_config.form_fields?.[field_id].field_type ?? 'SHORTANS'
                    const extractedData = extractTextFromResponseData(response[field_id] ?? '', fieldType)
                    return [field_id, {
                        type: 'pure_single',
                        id: field_id,
                        raw_data: extractedData,
                        data: extractedData,
                    }]
            }))
        }
        const rowKey = options?.reference_key === 'member_id'? member_id : id
        return { key: rowKey, value: { [form_id]: rowValueProperty } }
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

    transform(){
        for(const [column_id, filter] of Object.entries(this.transformation?.filters ?? {})){
            this.rows = this.rows.filter(row => {
                let data = null
                for(const [id, value] of Object.entries(row.value)){
                    data = Table.findRowValueRawDataById(value, column_id, id === column_id)
                    if(data || data === ''){
                        break
                    }
                }
                if(!data && data !== ''){
                    return false
                }
                if(Array.isArray(data)){
                    let match = false
                    data.forEach((dataString) => {
                        match = Table.filterOperation(dataString.toString(), filter)
                    })
                    return match
                }
                return Table.filterOperation(data.toString(), filter)
            })
        }
    }

    private static findRowValueRawDataById(rowValue: RowValue, column_id: string, found: boolean): (RowData | RowData[] | null){
        switch(rowValue.type){
            case 'group':
                let data = null
                for(const [id, value] of Object.entries(rowValue.sub_data)){
                    data = Table.findRowValueRawDataById(value, column_id, id === column_id)
                    if(data){
                        return data
                    }
                }
                return data
            case 'pure_multiple':
            case 'pure_single':
                if(!found){
                    return null
                }
                return rowValue.raw_data
        }
    }

    private static filterOperation(data: string, filter: TransformationFilter): boolean{
        switch(filter.operator){
            case 'has':
                return data.includes(filter.value)
            case 'starts':
                return data.startsWith(filter.value)
            case 'ends':
                return data.endsWith(filter.value)
            case '<':
                if(!isNaN(Number(data)) && !isNaN(Number(filter.value))){
                    return Number(data) < Number(filter.value)
                }
                return data < filter.value
            case '=':
                if(!isNaN(Number(data)) && !isNaN(Number(filter.value))){
                    return Number(data) === Number(filter.value)
                }
                return data === filter.value
            case '>':
                if(!isNaN(Number(data)) && !isNaN(Number(filter.value))){
                    return Number(data) > Number(filter.value)
                }
                return data > filter.value
            default:
                throw `${filter.operator} is not a valid operator`
        }
    }

    private static cloneRows(rows: Row[]): Row[]{
        return rows.map(row => {
            return {
                ...row,
                value: Object.fromEntries(Object.entries(row.value).map(([key, value]) => [
                    key, Table.cloneRowValue(value)
                ]))
            }
        })
    }

    private static cloneColumns(columns: Column[]): Column[]{
        return columns.map(column => {
            if(column.type === 'group'){
                return {
                    ...column,
                    sub_columns: Table.cloneColumns(column.sub_columns)
                }
            }
            return {
                ...column,
                options: column.options? column.options.map((option) => ({...option})) : column.options,
            }
        })
    } 

    private static cloneRowValue(rowValue: RowValue): RowValue{
        switch(rowValue.type){
            case 'group':
                return {
                    ...rowValue,
                    sub_data: Object.fromEntries(Object.entries(rowValue.sub_data).map(([key, value]) => [
                        key, Table.cloneRowValue(value)
                    ]))
                }
            case 'pure_multiple':
                if(Array.isArray(rowValue.data)){
                    return { ...rowValue, data: [...rowValue.data] }
                }
                return { ...rowValue }
            case 'pure_single':
                return { ...rowValue }
            
        }
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

    private static getRowSpan(rowValue: RowValue): number{
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
            const rowScale = Math.floor(rowValue.max_row_span/rowValue.data.length)
            if(level % rowScale !== 0){
                return {}
            }
            const scaledLevel = Math.floor(level/rowScale)
            return rowValue.data[scaledLevel]? {
                [rowValue.id]: {
                    ...rowValue,
                    data: rowValue.data[scaledLevel],
                    length: rowValue.data.length,
                    order: scaledLevel,
                    row_span: Table.getRowSpan({
                        ...rowValue,
                        length: rowValue.data.length,
                        order: scaledLevel,
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
                    console.log(key, value, row.value)
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