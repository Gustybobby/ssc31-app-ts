import { stringChanges } from "@/server/set"
import Image from "next/image"
import Link from "next/link"
import { Fragment, memo } from "react"
import { textColorClassVariants } from "../styles/class-variants"

function DisplaySyntaxedContentComponent({ string }: { string: string }){
    const syntaxedDataList = writeSyntaxedContent(string)
    if(!syntaxedDataList){
        return <></>
    }
    if(syntaxedDataList === '/INVALID SYNTAX/'){
        return <span className="text-red-600 dark:text-red-400">Invalid Syntax Format</span>
    }
    return(
        <div className="text-lg text-left">
        {syntaxedDataList.map((data,index)=>{
            return <Fragment key={index}>{codeToHTML(data, index !== syntaxedDataList.length - 1)}</Fragment>
        })}
        </div>
    )
}
export const DisplaySyntaxedContent = memo(DisplaySyntaxedContentComponent)

type SyntaxData = { code: string[], content: string }

export function writeSyntaxedContent(string: string): (SyntaxData[] | '/INVALID SYNTAX/' | null){
    if(!string?.length){
        return null
    }
    const results = []
    var i = 0
    var pText = ''
    while (i<string.length){
        if(string[i] === '<'){
            if(pText.length !== 0){
                results.push({ code: ['p'], content: pText })
                pText = ''
            }
            const closeOpenIndex = string.indexOf('>', i)
            if(closeOpenIndex === -1){
                return '/INVALID SYNTAX/'
            }
            const closeSyntaxIndex = string.indexOf('</>', closeOpenIndex)
            if(closeSyntaxIndex === -1){
                return '/INVALID SYNTAX/'
            }
            const code = string.slice(i+1, closeOpenIndex).split('|')
            const content = string.slice(closeOpenIndex+1, closeSyntaxIndex)
            results.push({ code, content })
            i = closeSyntaxIndex+3
            continue
        }
        pText += string[i]
        i++
    }
    if(pText.length !== 0){
        results.push({ code: ['p'], content: pText })
        pText = ''
    }
    return results
}

export function formatText(string = '', prevString = ''){
    let newStringLines = string?.split('\n') ?? []
    let prevStringLines = prevString?.split('\n') ?? []
    newStringLines = newStringLines.map((line,index) => autoCloseSyntax(line ?? '', prevStringLines[index] ?? ''))
    return newStringLines.join('\n')
}

function autoCloseSyntax(string = '', prevString = ''){
    if((prevString?.length ?? 0) > string.length || string.lastIndexOf('</>') === string.length - 3){
        return string
    }
    const changes = stringChanges(string, prevString)
    if(changes.size === 1 && changes.has('>')){
        return string + '</>'
    }
    return string
}


function codeToHTML(data: SyntaxData, spacing: boolean){
    const link = codeLink(data.code)
    if(link){
        return <LinkHTML link={link} data={data} spacing={spacing}/>
    }
    const imageUrl = codeImageUrl(data.code)
    if(imageUrl){
        return <ImageHTML url={imageUrl} data={data} spacing={spacing}/>
    }
    return(
        <>
            <span
                className={[
                    'inline-flex',
                    data.code?.map((code) => syntaxCodeClassName[code] ?? '').join(' '),
                ].join(' ')}
            >
                {data.content}
            </span>
            {spacing && <>&nbsp;</>}
        </>
    )
}

function LinkHTML({ link, data, spacing }: { link: string, data: SyntaxData, spacing: boolean }){
    return(
        <>
            <Link
                className={[
                    'inline-flex',
                    data.code?.map((code) => syntaxCodeClassName[code] ?? '').join(' '),
                ].join(' ')}
                href={link}
                target="_blank"
            >
                {data.content}
            </Link>
            {spacing && <>&nbsp;</>}
        </>
    )
}

function codeLink(code: string[] = []){
    for(const syntax of code){
        if(syntax.includes('link=')){
            return syntax.slice(5)
        }
    }
    return null
}

function ImageHTML({ url, data, spacing }: { url: string, data: SyntaxData, spacing: boolean }){
    const { width, height } = extractDim(data.code)
    return(
        <>
            <Image
                src={url}
                width={width}
                height={height}
                alt={data.content ?? 'paragraph image'}
                quality={80}
            />
            {spacing && <>&nbsp;</>}
        </>
    )
}

function extractDim(code: string[]){
    const width = Number(code.find((syntax) => syntax.startsWith('w='))?.split('=')[1])
    const height = Number(code.find((syntax) => syntax.startsWith('h='))?.split('=')[1])
    if(!width || !height || isNaN(width) || isNaN(height)){
        return { width: 384 , height: 384 }
    }
    return { width, height }
}

function codeImageUrl(code: string[] = []){
    for(const syntax of code){
        if(syntax.includes('image=https://files.edgestore.dev/')){
            return syntax.slice(6)
        }
    }
    return null
}

const syntaxCodeClassName: {
    [key: string]: string
} = {
    'u': 'underline',
    'b': 'font-bold',
    'xl': 'text-xl',
    '2xl': 'text-2xl',
    'it': 'italic',
    ...textColorClassVariants,
}

function ParagraphToolInstructionComponent(){
    return(
        <>
            <div className="font-bold text-lg">Code List</div>
            <div>Format: {'<code1|code2|...>text</>'}</div>
            <div>1. u : underline</div>
            <div>2. b : bold</div>
            <div>3. xl : text-xl</div>
            <div>4. 2xl: text-2xl</div>
            <div>5. it: italic</div>
            <div>6. color: red, yellow, blue, green, etc.</div>
            <div>7. link=url: link</div>
            <div>8. image=url, w=width, h=height: image, edgestore only</div>
        </>
    )
}
export const ParagraphToolInstruction = memo(ParagraphToolInstructionComponent)

function BasicSyntaxedContentDisplayComponent({ textString, className }: { textString: string, className?: string }){
    return(
        <div className={className}>
            {textString.split('\n').map((line,index)=>(
                <DisplaySyntaxedContent key={index} string={line}/>
            ))}
        </div>
    )
}
export const BasicSyntaxedContentDisplay = memo(BasicSyntaxedContentDisplayComponent)

export const descriptionTextAreaStyle = [
    'w-full h-64 p-2 rounded-md',
    'text-xl',
    'placeholder:text-gray-600 dark:placeholder:text-gray-400',
    'border border-gray-600',
    'bg-gray-200 dark:bg-black/70',
].join(' ')
