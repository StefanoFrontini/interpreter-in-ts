import * as Identifier from "#root/src/monkey/ast/identifier.ts";
import * as Token from "#root/src/monkey/token/token.ts";
import { Readable } from "node:stream";
export type t = {
  tag: "letStatement";
  token: Token.t;
  name: Identifier.t;
  value: Identifier.t;
};

export const tokenLiteral = (s: t): string => s.token.literal;

export const string = async (s: t): Promise<string> => {
  const readableStream = Readable.from([""]);
  readableStream.push(`${tokenLiteral(s)} ${Identifier.string(s.name)} = `);
  if (s.value !== null) {
    readableStream.push(Identifier.string(s.value));
  }
  readableStream.push(";");
  let result = "";
  for await (const chunk of readableStream) {
    result += chunk;
  }
  return result;
};
