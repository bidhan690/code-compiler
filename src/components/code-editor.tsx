"use client"

import { cn } from '@/lib/utils';
import { Editor } from '@monaco-editor/react';
import { FC, useEffect, useRef, useState } from 'react'

interface CodeEditorProps {

}

const CodeEditor: FC<CodeEditorProps> = ({}) => {
 const editorRef = useRef(null);
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [srcDoc, setSrcDoc] = useState("");

 useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html lang="en">
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>
      `);
    }, 200);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  function handleEditorDidMount(editor:any, monaco:any) {
    editorRef.current = editor;
  }
  function handleHtmlChange(value:any, event:any) {
    setHtml(value);
  }
 function handleCssChange(value:any, event:any) {
    setCss(value);
  }
 function handleJsChange(value:any, event:any) {
    setJs(value);
  }

const languages = [
    {
      name:"html",
      defaultValue:`<h1>Hello, world!</h1>`
    },
    {
      name:"css",
      defaultValue:`h1 {
  color: red;
}`
    },
    {
      name:"javascript",
      defaultValue:`const greet = "Hello, world!";`
    }

  ]
  return (
  <div className='flex flex-col '>
      <div className='p-4 h-96 flex gap-x-2 justify-between'>
{languages.map(lang => (
<LangEditor
            key={lang.name}
lang={lang.name}
defaultValue={lang.defaultValue}
handleChange={lang.name === "html" ? handleHtmlChange : lang.name === "css" ? handleCssChange : handleJsChange}

          />
))}
       </div>
<div className="border-t h-96">
 <iframe
          srcDoc={srcDoc}
          title="output"
          sandbox="allow-scripts"
          frameBorder="0"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  )
}

export default CodeEditor


interface LangEditorProps {
lang?:string
defaultValue?:string
handleChange?:any
handleEditorDidMount?:any
}

const LangEditor: FC<LangEditorProps> = ({lang,defaultValue,handleChange,handleEditorDidMount}) => {
const [isFullScreen, setIsFullScreen] = useState(false)

  return <div className="h-full w-full flex flex-col gap-y-2">
    <div className='flex justify-between'>
    <h2>{lang?.toUpperCase()}</h2>
      <button onClick={()=> setIsFullScreen((prev) => !prev)}>Full screen</button>
    </div>
    <Editor
       className={cn("h-full w-full",{
        "h-screen w-screen": isFullScreen,
      })}
       defaultLanguage={lang ?? "javascript"}
       theme="vs-dark"
        defaultValue={defaultValue ?? `const greet = "Hello, world!";`}
        onChange={handleChange}
      />

  </div>
}

export {LangEditor}
