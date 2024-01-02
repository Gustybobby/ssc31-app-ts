"use client";

import { Transition } from "@headlessui/react";
import { Fragment } from "react";

export function FadeIn({ children, show, duration, delay, as }: TransitionProps){
    return(
        <Transition
            appear={true}
            show={show}
            as={as}
            enter={`transform transition ${duration} ${delay}`}
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave={`transform ${duration} transition ease-in-out`}
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            {children}
        </Transition>
    )
}

export function ZoomIn({children, show, duration, delay, as}: TransitionProps){
    return(
        <Transition
            appear={true}
            show={show}
            as={as}
            enter={`transform transition ${duration} ${delay}`}
            enterFrom="opacity-0 scale-75"
            enterTo="opacity-100 scale-100"
            leave={`transform ${duration} transition ease-in-out`}
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-75"
        >
            {children}
        </Transition>
    )
}

export function RollDown({children, show, duration, delay, as}: TransitionProps){
    return(
        <Transition
            appear={true}
            show={show}
            as={as}
            enter={`transform transition ${duration} ${delay}`}
            enterFrom="opacity-0 scale-y-0 -translate-y-1/2"
            enterTo="opacity-100 scale-y-100 translate-y-0"
            leave={`transform ${duration} transition ease-in-out`}
            leaveFrom="opacity-100 scale-y-100 translate-y-0"
            leaveTo="opacity-0 scale-y-0 -translate-y-1/2"
        >
            {children}
        </Transition>
    )
}

export const delayOneByOne = [
    'delay-0', 'delay-[50ms]',
    'delay-[100ms]', 'delay-[150ms]',
    'delay-[200ms]', 'delay-[250ms]',
    'delay-[300ms]', 'delay-[350ms]',
    'delay-[400ms]', 'delay-[450ms]',
    'delay-[500ms]', 'delay-[550ms]',
    'delay-[600ms]', 'delay-[650ms]',
    'delay-[700ms]', 'delay-[750ms]',
    'delay-[800ms]', 'delay-[850ms]',
    'delay-[900ms]', 'delay-[950ms]',
]

export interface TransitionProps {
    children: React.ReactNode
    show: boolean
    duration?: string
    delay?: string
    as: 'div' | typeof Fragment
}