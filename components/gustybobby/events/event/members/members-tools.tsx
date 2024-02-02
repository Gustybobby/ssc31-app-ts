"use client"

import { popOverStyles } from "@/components/styles/popovers"
import { sectionStyles } from "@/components/styles/sections";
import { Popover, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { FaGear } from "react-icons/fa6";

export default function MembersTools(){
    return (
        <Popover className="relative">
            <Popover.Button className={popOverStyles.popOverButton()}>
                <div className="p-1 flex items-center space-x-2">
                    <FaGear className="text-xl"/>
                </div>
            </Popover.Button>
            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Popover.Panel className={popOverStyles.popOverPanel('w-60 p-2 rounded-lg')}>
                    <div className="space-y-2">
                        <span className="text-lg font-bold">Tools</span>
                        <button className={sectionStyles.button({ color: 'green', border: false, hover: true })}>
                            <span className="text-base">Activate SELECTED members</span>
                        </button>
                        <button className={sectionStyles.button({ color: 'yellow', border: false, hover: true })}>
                            <span className="text-base">Reject PENDING members</span>
                        </button>
                        <button className={sectionStyles.button({ color: 'red', border: false, hover: true })}>
                            <span className="text-base">Delete REJECTED members</span>
                        </button>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}