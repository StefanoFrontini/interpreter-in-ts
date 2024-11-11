import * as Statement from "#root/src/monkey/ast/statement.ts";
import * as Token from "#root/src/monkey/token/token.ts";
import { Readable } from "node:stream";
export type t = {
  tag: "blockStatement";
  token: Token.t;
  statements: Statement.t[];
};

export const tokenLiteral = (bs: t): string => bs.token.literal;

export const string = async (bs: t): Promise<string> => {
  const readableStream = Readable.from([""]);
  //   readableStream.push("{");
  for (const s of bs.statements) {
    readableStream.push(await Statement.string(s));
  }
  //   readableStream.push("}");
  let result = "";
  for await (const chunk of readableStream) {
    result += chunk;
  }
  return result;
};
