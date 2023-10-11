"use client"
import CodeEditor from '@/components/code-editor';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { useRef } from 'react';
import { io } from "socket.io-client";

const socket = io(
   "https://bidhan88.webpubsub.azure.com",
  {
    path: "/clients/socketio/hubs/Hub"
  }
);

export default function Home() {
socket.on("hello", (arg) => {
    console.log(arg);
});


//   function showValue() {
// socket.emit("howdy", editorRef.current?.getValue())
//   }


  return (
  <div className=''>
      <CodeEditor />
       </div>
     )
}
