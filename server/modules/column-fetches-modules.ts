import type { PrismaClient } from "@prisma/client"
import type { ColumnFetches, TableView } from "../typeconfig/event"

export function filteredColumnFetches(column_fetches: ColumnFetches, table_view: TableView | null): ColumnFetches{
    return Object.fromEntries(Object.entries(column_fetches ?? {}).filter(([_, group]) => {
        return !table_view || group.view_table.includes(table_view)
    }))
}

export async function getAllRequiredForms(prisma: PrismaClient, column_fetches: ColumnFetches, isAdmin: boolean){
    const formIds = Object.values(column_fetches ?? {}).map((group) => Object.keys(group.forms)).flat()
    const forms = await prisma.eventForm.findMany({
        where: {
            OR: uniqueFormIdsWhereInput(formIds)
        },
        select: {
            id: true,
            global_position_access: isAdmin? false : {
                select: {
                    id: true
                }
            },
            global_role_access: isAdmin? false : {
                select: {
                    id: true
                }
            },
            form_fields: true,
            responses_list: {
                select: {
                    member_id: true,
                    response: true,
                }
            }
        }
    })
    return Object.fromEntries(forms.map((form) => [form.id, form]))
}

const uniqueFormIdsWhereInput = (formIds: string[]) => {
    const ids = [] as { id: string }[]
    (new Set(formIds)).forEach((id) => ids.push({ id }))
    return ids
}