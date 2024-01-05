import { sectionStyles } from "@/components/styles/sections";
import Link from "next/link";

export default function ViewFormLink({ eventId, formId }: { eventId: string, formId: string }){
    return(
        <div className="flex justify-end order-5">
            <Link
                target="_blank"
                href={`/events/${eventId}/forms/${formId}`}
                className={sectionStyles.button({ color: 'blue', hover: true, border: true })}
            >
                View
            </Link>
        </div>
    )
}