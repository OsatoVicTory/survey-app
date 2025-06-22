"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { MdFormatBold, MdFormatItalic, MdLink, MdOutlineFormatUnderlined } from "react-icons/md";
import styles from "./styles.module.css";
import { useCallback, useRef, useState } from "react";
import { AiOutlineClose, AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { Skeleton } from "./loadingSpinner";

export default function TextEditor(
    { showLists, update, value, title }: 
    { 
        showLists: boolean | undefined, update: (str: string) => void, 
        value: string | undefined, title: boolean | undefined 
    }
) {

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: styles.Tet_text_ol,
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: styles.Tet_text_ol,
                    },
                },
            }),
            Link.configure({ 
                autolink: true,
                openOnClick: true,
                linkOnPaste: true,
                // protocols: ["https"], 
            }),
            Underline,
        ],
        immediatelyRender: false,
        content: value || "<p>Untitled</p>",
        editorProps: {
            attributes: {
                class: styles.Tet_text_editor,
            }
        },
        onUpdate({ editor }) {
            const updatedHTML = editor.getHTML();
            update(updatedHTML.trim());
        },
    });

    return (
        <div className={`${styles.Text_editor} ${styles[`Txt_ed_${title}`]} w-full`}>
            {!editor && <div className={`${styles.Te_loading} w-full`}>
                <Skeleton />
            </div>}
            
            {editor && <div className="w-full">
                <EditorContent editor={editor} />
                <ToolBar editor={editor} showLists={showLists} />
            </div>}
        </div>
    );
};

function ToolBar({ editor, showLists }: { editor: Editor | null, showLists: boolean | undefined }) {
    if(!editor) return null;

    const [showLinkModal, setShowLinkModal] = useState<boolean>(false);

    const setLink = useCallback((text: string, url: string) => {
        if(!editor) return;
        editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
        setShowLinkModal(false);
    }, [editor]);

    const linkFn = useCallback(() => {
        if(!editor) return;
        if(editor.isActive('link')) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            setShowLinkModal(true);
        }
    }, [editor]);

    return (
        <div className={styles.Te_ctrls}>
            <button 
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={styles[`Te_ctrl_${editor.isActive('bold')}`]}
            >
                <MdFormatBold className={styles.Tec_icon} />
            </button>
            <button 
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={styles[`Te_ctrl_${editor.isActive('italic')}`]}
            >
                <MdFormatItalic className={styles.Tec_icon} />
            </button>
            <button 
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={styles[`Te_ctrl_${editor.isActive('underline')}`]}
            >
                <MdOutlineFormatUnderlined className={styles.Tec_icon} />
            </button>
            <button onClick={linkFn}
            className={styles[`Te_ctrl_${editor.isActive('link')}`]}
            >
                <MdLink className={styles.Tec_icon} />
            </button>

            <button 
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${styles[`Te_ctrl_${editor.isActive('orderedList')}`]} ${styles[`Te_ctrl_display_${showLists}`]}`}
            >
                <AiOutlineOrderedList className={styles.Tec_icon} />
            </button>
            <button 
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${styles[`Te_ctrl_${editor.isActive('bulletList')}`]} ${styles[`Te_ctrl_display_${showLists}`]}`}
            >
                <AiOutlineUnorderedList className={styles.Tec_icon} />
            </button>

            <span>{showLinkModal && <LinkModal setLink={setLink} closeModal={() => setShowLinkModal(false)} />}</span>
        </div>
    );
};

function LinkModal({ setLink, closeModal }: { setLink: (text: string, href: string) => void, closeModal: () => void }) {

    const url = useRef<HTMLInputElement | null>(null);
    // const text = useRef<HTMLInputElement | null>(null);

    const handleSave = useCallback(() => {
        if(!url.current) return;
        setLink("", url.current.value);
    }, []);

    return (
        <div className={styles.LinkModal}>
            <div className={styles.LM}>
                <div className={styles.LM_top}>
                    <h3>Add Link</h3>
                    <button className={styles.LMT} onClick={closeModal}>
                        <AiOutlineClose className={styles.LMT_icon} />
                    </button>
                </div>
                <div className={styles.LM_body}>
                    <div className={styles.LMB_field}>
                        <label>Enter url link for the selected text</label>
                        <input placeholder="https://survey-app.com" ref={url} />
                    </div>
                    {/* <div className={styles.LMB_field}>
                        <label>Text</label>
                        <input placeholder="Enter the text to display" />
                    </div> */}
                </div>
                <div className={styles.LM_base}>
                    <button onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    )
};