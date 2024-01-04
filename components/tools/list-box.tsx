import { GustybobbyOption } from "@/server/typeconfig/form";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, type MutableRefObject, useEffect, useRef, useState } from "react";
import { AiOutlineCheck, AiOutlineDown } from "react-icons/ai";

interface SingleSelectConfig {
    list: GustybobbyOption[]
    setList: (list: any[]) => void
    width: string
    maxHeight: string
    divClassName?: string
    disabled?: boolean
}

export function ListBoxSingleSelect({ list, setList, width, maxHeight, divClassName = 'relative', disabled = false }: SingleSelectConfig){
    return (
        <div className={divClassName}>
            <Listbox
                onChange={(id) => {
                    const newList = list.map((item) => ({...item}))
                    const prevActiveItem = newList.find((item)=>item.active)
                    if(prevActiveItem){
                        prevActiveItem.active = false
                    }
                    const newActiveItemIndex = newList.findIndex((item)=>item.id === id)
                    if(newActiveItemIndex >= 0){
                        newList[newActiveItemIndex].active = true
                    }
                    setList(newList)
                }}
            >
                <Listbox.Button>
                    <div className={styles.listButton(width, disabled)}>
                        {list.find((item)=>item.active)?.label ?? '-'}
                        <span className="relative right-0 text-sm">
                            <AiOutlineDown/>
                        </span>
                    </div>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    {!disabled &&
                    <Listbox.Options className={styles.options(maxHeight)}>
                    {list.map((option) => (
                        <Listbox.Option 
                            className={styles.optionItem(option.active,width)}
                            key={option.id}
                            value={option.id}
                        >
                            {option.label}
                            {option.active && <span className="text-xs"><AiOutlineCheck/></span>}
                        </Listbox.Option>
                    ))}
                    </Listbox.Options>
                    }
                </Transition>
            </Listbox>
        </div>
    )
}

interface MultiSelectConfig {
    list: GustybobbyOption[]
    setList: (list: any[]) => void
    placeholder: string
    width: string
    maxHeight: string
    disabled?: boolean
}

export function ListBoxMultiSelect({ list, setList, placeholder, width, maxHeight, disabled = false }: MultiSelectConfig){

    const [open, setOpen] = useState(false)

    return (
        <OutsideAlerter clickOutside={() => setOpen(false)}>
            <Listbox
                onChange={(id) => {
                    const selectedItem = list.find((item)=>item.id === id)
                    if(selectedItem){
                        selectedItem.active = !selectedItem.active
                    }
                    setList(list)
                }}
            >
                <Listbox.Button onClick={()=>setOpen(!open)}>
                    <div className={styles.listButton(width, disabled)}>
                        {placeholder}<span className="relative right-0 text-sm"><AiOutlineDown/></span>
                    </div>
                </Listbox.Button>
                <Transition
                    show={disabled? false : open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className={styles.options(maxHeight)} static>
                    {list.map((option) => (
                        <Listbox.Option 
                            className={styles.optionItem(option.active,width)}
                            key={option.id}
                            value={option.id}
                        >
                            {option.label}
                            {option.active && <span className="text-xs"><AiOutlineCheck/></span>}
                        </Listbox.Option>
                    ))}
                    </Listbox.Options>
                </Transition>
            </Listbox>
        </OutsideAlerter>
    )
}

function useOutsideAlerter(ref: MutableRefObject<any>, clickOutside = () => {}){
    useEffect(() => {
        function handleClickOutside(e: any) {
            if (ref.current && !ref.current.contains(e.target)) {
                clickOutside()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [ref, clickOutside])
}

export default function OutsideAlerter({ children, clickOutside = () => {} }: { children: React.ReactNode, clickOutside: () => void }){

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, clickOutside);

    return <div ref={wrapperRef} className="relative">{children}</div>;
}

const styles = {
    listButton: (width: string, disabled: boolean) => [
        'flex flex-row justify-between items-center',
        width,
        'px-2 py-1 rounded-md shadow-md',
        disabled? 'text-gray-600 dark:text-gray-400' : '',
        'border border-gray-400 dark:border-gray-700',
        'bg-gray-200 dark:bg-gray-800 transition-colors',
        'hover:border-black dark:hover:border-gray-400',
    ].join(' '),
    options: (max_height: string) => [
        'absolute overflow-auto',
        'w-fit z-10 mt-1 py-1 rounded-md shadow-lg', max_height,
        'text-base sm:text-sm',
        'ring-1 ring-black/5',
        'bg-gray-200 dark:bg-gray-700',
    ].join(' '),
    optionItem: (active: boolean,width: string) => [
        'relative flex justify-between items-center cursor-pointer select-none',
        width,
        'px-2 py-2',
        'hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors',
        active? 'bg-gray-100 dark:bg-gray-600' : '',
    ].join(' ')
}