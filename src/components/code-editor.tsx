"use client";

import { cn } from "@/lib/utils";
import { Editor } from "@monaco-editor/react";
import { FC, useEffect, useRef, useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { files } from "@/config/files";
import Terminal from "./terminal";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface CodeEditorProps {}

const CodeEditor: FC<CodeEditorProps> = ({}) => {
 

  const [fileName, setFileName] = useState(files[0].name ?? "");
  const [file, setFile] = useState(
    files.find((item) => item.name === fileName),
  );
  const [codeValue, setCodeValue] = useState("");
  const [executedCode, setExecutedCode] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
  socket.emit("code", codeValue);
  socket.on("code-state-from-server", (data) => {
    setCodeValue(data);
  })
  },[codeValue])

  useEffect(() => {
    const selectedFile = files.find((item) => item.name === fileName);
    setFile(selectedFile);
  }, [files, fileName]);

  useEffect(() => {
    setCodeValue(file?.value ?? "");
  }, [file]);

  const mutation = useMutation({
    mutationFn: async (data: { language: string; code: string }) => {
      return axios.post("/api/code", data);
    },
    onSuccess: (data) => {
      setExecutedCode(data.data.stdout);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        setExecutedCode(error.response?.data?.error ?? "Something went wrong");
      }
    },
  });

  const executeCode = () => {
    setExecutedCode("");
    mutation.mutate({
      language: file?.language.toLowerCase() ?? "",
      code: codeValue,
    });
  };

  return (
    <div className="w-full p-2 flex flex-col lg:flex-row justify-between gap-3">
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Select onValueChange={setFileName} defaultValue={fileName}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {files.map((item) => (
                <SelectItem key={item.name} value={item.name}>
                  {item.language.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="w-20" onClick={executeCode}>
            {mutation.isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "Run"
            )}
          </Button>
        </div>
        <Editor
          height="90vh"
          theme="vs-dark"
          path={file?.name}
          onChange={(val) => setCodeValue(val ?? "")}
          defaultLanguage={file?.language}
          defaultValue={file?.value}
          loading={
            <div className="flex flex-col gap-2 items-center">
              <Loader2 className="w-20 h-20 animate-spin" />
              <h1 className="text-2xl font-bold">Loading Editor...</h1>
            </div>
          }
          value={codeValue}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h2>Output</h2>
          <Button onClick={() => setExecutedCode("")}>Clear</Button>
        </div>
        <Terminal code={executedCode} />
      </div>
    </div>
  );
};

export default CodeEditor;

interface LangEditorProps {
  lang?: string;
  defaultValue?: string;
  handleChange?: any;
  handleEditorDidMount?: any;
}

const LangEditor: FC<LangEditorProps> = ({
  lang,
  defaultValue,
  handleChange,
  handleEditorDidMount,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  // <div className="border-t h-96">
  //  <iframe
  //           srcDoc={srcDoc}
  //           title="output"
  //           sandbox="allow-scripts"
  //           frameBorder="0"
  //           height="100%"
  //           width="100%"
  //         />
  //       </div>
  return (
    <div className="h-full w-full flex flex-col gap-y-2">
      <div className="flex justify-between">
        <h2>{lang?.toUpperCase()}</h2>
        <button onClick={() => setIsFullScreen((prev) => !prev)}>
          Full screen
        </button>
      </div>
      <Editor
        className={cn("h-full w-full", {
          "h-screen w-screen": isFullScreen,
        })}
        defaultLanguage={lang ?? "javascript"}
        theme="vs-dark"
        defaultValue={defaultValue ?? `const greet = "Hello, world!";`}
        onChange={handleChange}
      />
    </div>
  );
};

export { LangEditor };
