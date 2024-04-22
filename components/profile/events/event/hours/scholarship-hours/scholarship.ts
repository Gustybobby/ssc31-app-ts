import type { ContentConfigProperty } from "@/server/classes/forms/contentconfig"

export const maxHours = (actHrs: number) => Math.min(actHrs-1,20)

export const scholFormDesc = (actHrs: number) => [
    "<xl|b>This form is for scholarship students to transfer their activity hours</>",
    `<green|b|2xl>You have ${actHrs.toFixed(0)} activity hours</>`,
    `<blue|b|2xl>You can transfer ${maxHours(actHrs).toFixed(0)} hours</>`,
    "<pink|b>Rules for transfering activity hours:</>",
    "1. You can only transfer a total of <blue>( your activity hours - 1 )</>",
    "2. Each event has a maximum limit of scholarship hours transfer of 20 hours per event",
    "3. You can allocate your hours to current and previous semesters only",
    "<red>Filling this form as a none scholarship student may result in a loss of activity hours</>"
].join("\n")

export const scholFieldConfig = (id: string, year: number, sem: number): ContentConfigProperty => ({
    id,
    label: `Year ${year} Semester ${sem}`,
    required: false,
    placeholder: "0 - 20",
    success: "Valid Hours",
    error: "0 - 20 Hours only",
    default_value: "",
    options: [],
    data_type: "NUM",
    field_type: "SHORTANS",
    min_length: 0,
    max_length: 20,
})

export function transferableSems(eventCreatedAt: Date){
    const month = eventCreatedAt.getMonth()
    let currentYear = eventCreatedAt.getFullYear()
    let currentSem = 2
    if (month < 7){
        currentYear--
    }
    else if (month < 10){
        currentSem--
    }
    const semYears: [number,number][] = []
    let back = 0
    while (back < 4){
        semYears.push([currentSem, currentYear])
        if (currentSem == 1){
            currentSem = 2
            currentYear --
            back ++
        } else {
            currentSem = 1
        }
    }
    return semYears
}