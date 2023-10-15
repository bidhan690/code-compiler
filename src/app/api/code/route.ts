import { spawn } from "child_process";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { files } from "@/config/files";

export async function POST(req: NextRequest, res: NextResponse) {
  const { code, language } = await req.json();
  try {
    let executionCommand = "";
    let outputFileName = "";
   const file = files.find((file) => file.language === language)
    if (language === file?.language){
      outputFileName = `user_code.${file?.extension}`;
      executionCommand = `${file?.startCommand} user_code.${file?.extension}`;
    } else {
      return NextResponse.json(
        { error: "Language not supported" },
        { status: 400 },
      );
    }

    fs.writeFileSync(outputFileName, code);

    const child = spawn(executionCommand, { shell: true });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    await new Promise((resolve, reject) => {
      child.on("close", (code) => {
        if (code === 0) {
          resolve(void 0);
        } else {
          resolve(void 0);
        }
      });
    });
    if (stderr) throw new Error(stderr);
    return NextResponse.json({ stdout });
  } catch (error: unknown) {
    if (error instanceof Error && "message" in error) {
      return NextResponse.json(
        { error: error?.message ?? "" },
        { status: 500 },
      );
    } else {
      return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
  }
}
