"use client";
import Link from "next/link";
import { FadeIn } from "@/components/tools/transition";
import { Fragment } from "react";
import { eventStyles } from "@/components/styles/events";
import PosterSection from "../sections/poster-section";
import { BasicSyntaxedContentDisplay } from "@/components/tools/paragraph";

export default function EventDetailedPost(
    { id, title, poster, description }:
    { id: string, title: string, poster: string | null, description: string }
){
    return(
        <div className={eventStyles.box({ size: 'auto', round: false })}>
            <FadeIn show={true} delay="delay-75" duration="duration-150" as={Fragment}>
                <h1 className="text-black dark:text-yellow-400 text-center text-4xl font-bold p-8">
                    {title}
                </h1>
            </FadeIn>
            <FadeIn show={true} delay="delay-150" duration="duration-150" as="div">
                <PosterSection 
                    poster={poster}
                    width={768}
                    height={768}
                />
            </FadeIn>
            <FadeIn show={true} delay="delay-200" duration="duration-150" as={Fragment}>
                <div className="w-full px-2">
                    <BasicSyntaxedContentDisplay
                        className="flex flex-col justify-start p-4 rounded-2xl space-y-2 bg-gray-200 dark:bg-transparent"
                        textString={description}
                    />
                </div>
            </FadeIn>
            <FadeIn show={true} delay="delay-300" duration="duration-150" as={Fragment}>
                <div className="w-full flex justify-end items-center">
                    <Link href={`/events/${id}/forms/join`} className={eventStyles.link({ color: 'green' })}>
                        Join
                    </Link>
                </div>
            </FadeIn>
        </div>
    )
}