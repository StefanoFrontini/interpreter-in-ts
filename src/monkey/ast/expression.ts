import * as Identifier from "#root/src/monkey/ast/identifier.ts";
import { Readable } from "stream";

export type t = Identifier.t;

export const string = async (e: t): Promise<string> => {
  const readableStream = Readable.from([""]);
  readableStream.push(Identifier.string(e));
  let result = "";
  for await (const chunk of readableStream) {
    result += chunk;
  }
  return result;
};
