"use client"

import {BiHomeCircle, BiUser } from 'react-icons/bi'
import {BsCalendarEvent, BsQuestionCircle, BsList} from 'react-icons/bs'
import Link from 'next/link'
import { Fragment} from 'react'
import { Menu, Transition } from '@headlessui/react'

export default function NavDropDown(){
    return (
        <div>
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className={styles.button}>
                        <div className="text-3xl"><BsList/></div>
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className={styles.menuItems}>
                        <div className="p-4">
                            {NAVIGATION_ITEMS.map((item) => (
                            <Menu.Item key={item.title} as={Fragment}>
                                <Link
                                    className={styles.itemLink}
                                    href={"/"+item.title.toLowerCase()}
                                    key = {item.title}
                                >
                                    <div><item.icon/></div>
                                    <div>{item.title}</div>
                                </Link>
                            </Menu.Item>
                            ))}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}

const NAVIGATION_ITEMS = [
    { title: 'Home', icon: BiHomeCircle },
    { title: 'Events', icon: BsCalendarEvent },
    { title: 'About', icon: BsQuestionCircle },
    { title: 'Profile', icon: BiUser },
]

const styles = {
    button: [
        'inline-flex rounded-md',
        'w-full px-4 py-2',
        'text-white text-sm font-medium',
        'focus:outline-none',
        'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75',
        'bg-black/20 hover:bg-black/30 transition-colors'
    ].join(' '),
    menuItems: [
        'absolute mt-3 w-48 origin-top-right',
        'rounded-md shadow-lg',
        'ring-1 ring-opacity-5 ring-black focus:outline-none',
        'bg-white dark:bg-black/90',
    ].join(' '),
    itemLink: [
        'flex justify-start items-center space-x-4',
        'w-fit py-2 px-4 rounded-3xl',
        'text-xl font-semibold text-black dark:text-white',
        'transition ease-in-out delay-50 duration-100',
        'bg-transparent',
        'hover:bg-black/10 dark:hover:bg-white/10 hover:-translate-y-1 hover:scale-110',
    ].join(' '),
}