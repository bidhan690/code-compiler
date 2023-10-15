import { FC } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface terminalProps {
  code: string;
}

const Terminal: FC<terminalProps> = ({ code }) => {
  const splittedCode = code
    .split("\n")
    .map((line, index) => <p key={index}>{line}</p>);
  return (
    <ScrollArea className="h-[90vh] w-full lg:w-[28rem] bg-black text-white  rounded p-4">
      <div className=" p-2 overflow-auto">
        <div className="flex gap-1">
          <span>~</span>
          <span className="mx-0.5">{splittedCode}</span>
          <span className="animate-pulse w-1.5 h-6 bg-gray-300" />
        </div>
      </div>
    </ScrollArea>
  );
};

export default Terminal;
