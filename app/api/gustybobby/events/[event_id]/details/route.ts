import prisma from "@/prisma-client";
import { setDifference, setToArray } from "@/server/set";
import type { EventDataRequest } from "@/server/typeconfig/event";
import { type NextRequest, NextResponse } from "next/server";

//get event details
export async function GET(req: NextRequest, { params }: { params: { event_id: string }}){
    try{
        const eventDetails = await prisma.event.findUniqueOrThrow({
            where:{
                id: params.event_id
            },
            include:{
                positions: {
                    orderBy:{
                        order: 'asc'
                    }
                },
                roles: {
                    orderBy:{
                        order: 'asc'
                    }
                },
            }
        })
        return NextResponse.json({ message: "SUCCESS", data: eventDetails }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}

//update event details
export async function PUT(req: NextRequest,{ params }: { params: { event_id: string }}){
    try{
        const edit = await req.json()
        const editData: EventDataRequest = edit.data
        const positionList = editData.positions.map((position) => position.label)
        const roleList = editData.roles.map((role)=>role.label)
        if(new Set(positionList).size !== positionList.length){
            throw "Duplicate positions"
        }
        if(new Set(roleList).size !== roleList.length){
            throw "Duplicate roles"
        }
        await prisma.$transaction(async(tx) => {
            const editedEvent = await tx.event.update({
                where:{
                    id: params.event_id
                },
                data:{
                    title: editData.title ?? undefined,
                    poster: editData.poster ?? undefined,
                    description: editData.description ?? undefined,
                    updated_at: new Date()
                }
            })
            console.log(editedEvent)
            let createIds: Set<string>, deleteIds: Set<string>
            //crud positions
            const currentPositionIds = (await tx.eventPosition.findMany({
                where: {
                    event_id: params.event_id
                },
                select: {
                    id: true,
                } 
            })).map(({ id }) => id)
            const newPositionIds = editData.positions.map((position) => position.id)
            createIds = setDifference<string>(new Set(newPositionIds), new Set(currentPositionIds))
            deleteIds = setDifference<string>(new Set(currentPositionIds), new Set(newPositionIds))
            for(var i=0;i<editData.positions.length;i++){
                const position = editData.positions[i]
                if(createIds.has(position.id)){
                    continue
                }
                const updatedPosition = await tx.eventPosition.update({
                    where: {
                        id: position.id
                    },
                    data: {
                        ...position,
                        id: undefined,
                        order: i,
                    }
                })
                console.log("updated position", updatedPosition)
            }
            const createPositions = editData.positions.filter((position) => createIds.has(position.id))
            const createdPositions = await tx.eventPosition.createMany({
                data: createPositions.map(({ id, ...position }, index) => ({
                    ...position,
                    order: currentPositionIds.length + index,
                    event_id: params.event_id
                }))
            })
            const deletedPositions = await tx.eventPosition.deleteMany({
                where: {
                    OR: setToArray(deleteIds).map((id) => ({ id }))
                }
            })
            console.log("created",createdPositions,"and deleted",deletedPositions,"positions")
            //crud roles
            const currentRoleIds = (await tx.eventRole.findMany({
                where: {
                    event_id: params.event_id
                },
                select: {
                    id: true,
                } 
            })).map(({ id }) => id)
            const newRoleIds = editData.roles.map((role) => role.id)
            createIds = setDifference<string>(new Set(newRoleIds), new Set(currentRoleIds))
            deleteIds = setDifference<string>(new Set(currentRoleIds), new Set(newRoleIds))
            for(var i=0;i<editData.roles.length;i++){
                const role = editData.roles[i]
                if(createIds.has(role.id)){
                    continue
                }
                const updatedRole = await tx.eventRole.update({
                    where: {
                        id: role.id
                    },
                    data: {
                        ...role,
                        id: undefined,
                        order: i,
                    }
                })
                console.log("updated role", updatedRole)
            }
            const createRoles = editData.roles.filter((role) => createIds.has(role.id))
            const createdRoles = await tx.eventRole.createMany({
                data: createRoles.map(({ id, ...role }, index) => ({
                    ...role,
                    order: currentRoleIds.length + index,
                    event_id: params.event_id
                }))
            })
            const deletedRoles = await tx.eventRole.deleteMany({
                where: {
                    OR: setToArray(deleteIds).map((id) => ({ id }))
                }
            })
            console.log("created",createdRoles,"and deleted",deletedRoles,"roles")
        })
        return NextResponse.json({ message: "SUCCESS" }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ messagee: "ERROR" }, { status: 400 })
    }
}