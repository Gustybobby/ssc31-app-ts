"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { BiUserCircle } from "react-icons/bi";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

export default function NavSession() {

    const { data:session, status } = useSession()

    if(status === 'loading'){
        return(
            <div>
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button className={styles.button} disabled={true}>
                            <div className="text-2xl px-2 font-bold">?</div>
                        </Menu.Button>
                    </div>
                </Menu>
            </div>
        )
    }
    if(session?.user.id){
        return(
            <div>
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button className={styles.button}>
                            <div className="text-3xl"><BiUserCircle/></div>
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
                            <div className="p-4 text-sm text-right text-black dark:text-white">
                                {session.user.email}
                            </div>
                            <div className="p-2 text-right">
                                <button
                                    className={styles.signOutButton}
                                    onClick={() => signOut()}
                                >
                                    Sign Out
                                </button>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        )
    } 
    else if(session){
        signOut()
    }
    return(
        <div>
            <button className={styles.button}
                onClick={()=>signIn('google')}>
                    Sign In
            </button>  
        </div>
    )
}

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
        'absolute right-0 origin-top-right',
        'w-fit mt-3 rounded-md',
        'divide-y divide-gray-100',
        'ring-1 ring-opacity-5 ring-black',
        'bg-white dark:bg-black/90',
        'focus:outline-none',
    ].join(' '),
    signOutButton: [
        'p-2 rounded-3xl',
        'text-sm font-semibold text-black dark:text-white',
        'bg-transparent hover:bg-black/10 dark:hover:bg-white/10',
        'transition ease-in-out delay-50 duration-100',
        'hover:-translate-y-1 hover:scale-110',
    ].join(' ')
}