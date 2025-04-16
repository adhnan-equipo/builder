import React from 'react'
import { BubbleMenu, Editor } from '@tiptap/react'
import {
    BoldIcon,
    Code2Icon,
    ItalicIcon,
    StrikethroughIcon,
} from 'lucide-react';
import { RiH1, RiH2, RiLink, RiLinkUnlink } from 'react-icons/ri';
import { setLink } from '@/constants/set-link';

type PopoverProps = {
    editor: Editor
}

function PopoverEditor({ editor }: PopoverProps) {
    const isSelectionOverLink = editor.getAttributes('link').href

    return (
        <BubbleMenu className="Popover bg-white shadow-lg rounded-md p-4 flex space-x-2" editor={editor}>
            <div className="icon cursor-pointer hover:bg-gray-200 p-2 rounded" onClick={() => editor.chain().focus().toggleBold().run()}>
                <BoldIcon />
            </div>
            <div className="icon cursor-pointer hover:bg-gray-200 p-2 rounded" onClick={() => editor.chain().focus().toggleItalic().run()}>
                <ItalicIcon />
            </div>
            <div className="icon cursor-pointer hover:bg-gray-200 p-2 rounded" onClick={() => editor.chain().focus().toggleStrike().run()}>
                <StrikethroughIcon />
            </div>
            <div className="icon cursor-pointer hover:bg-gray-200 p-2 rounded" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                <RiH1 />
            </div>
            <div className="icon cursor-pointer hover:bg-gray-200 p-2 rounded" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                <RiH2 />
            </div>
            <div className="icon cursor-pointer hover:bg-gray-200 p-2 rounded" onClick={() =>
                isSelectionOverLink ? editor.chain().focus().unsetLink().run() : setLink(editor)
            }>
                {isSelectionOverLink ? <RiLinkUnlink /> : <RiLink />}
            </div>
            <div className="icon cursor-pointer hover:bg-gray-200 p-2 rounded" onClick={() => editor.chain().focus().toggleCode().run()}>
                <Code2Icon />
            </div>
        </BubbleMenu>
    )
}

export { PopoverEditor }

