import { BsLine } from 'react-icons/bs';
import { HiOutlineMail } from 'react-icons/hi';
import Image from 'next/image';
import Link from 'next/link';
import MainWrapper from '@/components/globalui/main-wrapper';

export default function AboutPage(){
    return(
        <MainWrapper>
            <div className="w-full max-w-4xl p-4">
                <h1 className= "text-5xl font-bold text-center p-4">
                    Yooooo!
                </h1>
                <div className="text-center p-3 text-xl">
                    {`Hi!, We are SSC31 Only (We are all leaving next year💀💀💀)`}
                </div>
                <h2 className= "text-3xl font-bold text-center p-4">
                    Our Team
                </h2>
                <div className="p-3"> 
                    <Image
                    src="/static/members.png"
                    width={820}
                    height={820}
                    alt="SSC31 Members"
                    placeholder='blur'
                    blurDataURL='/static/members.png'
                    />
                </div>
                <h3 className= "text-3xl font-bold text-center p-2 py-6">
                    Contact Us
                </h3>
                <div className="flex justify-center items-center p-3 text-xl font-medium space-x-2">
                    <div className="text-2xl"><HiOutlineMail/></div>
                    <div>siitssc31official@gmail.com</div>
                </div>
                <div className = "flex flex-col items-center">
                    <Link href="https://lin.ee/6VM3E8L" className="flex items-center text-center p-3 text-xl font-medium space-x-2">
                        <div className="text-2xl"><BsLine/></div>
                        <div className="underline underline-offset-2">https://lin.ee/6VM3E8L</div>
                    </Link>
                </div>
                <h3 className= "text-3xl font-bold text-center p-2 py-6">
                    Privacy Policy
                </h3>
                <div className = "flex flex-col items-center text-xl font-bold">
                    <Link href="/privacy-policy" className="text-center text-blue-600 dark:text-blue-500 p-3">
                        <div className="underline underline-offset-2">Click to view our privacy policy</div>
                    </Link>
                </div>
                <div className="text-center p-8 text-2xl font-semibold text-red-600 dark:text-red-400">
                    Disclaimer: This site is not affiliated with SIIT.
                </div>
            </div>
        </MainWrapper>
    )
}