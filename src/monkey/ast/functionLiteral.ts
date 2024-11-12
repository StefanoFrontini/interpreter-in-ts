import * as BlockStatement from "#root/src/monkey/ast/blockStatement.ts";
import * as Identifier from "#root/src/monkey/ast/identifier.ts";
import * as Token from "#root/src/monkey/token/token.ts";
import { Readable } from "node:stream";
export type t = {
  tag: "functionLiteral";
  token: Token.t;
  parameters: Identifier.t[];
  body: BlockStatement.t;
};

export const tokenLiteral = (fl: t): string => fl.token.literal;

export const string = async (fl: t): Promise<string> => {
  const readableStream = Readable.from([""]);
  const params: string[] = [];
  for (const p of fl.parameters) {
    params.push(Identifier.string(p));
  }
  readableStream.push(tokenLiteral(fl));
  readableStream.push("(");
  readableStream.push(params.join(", "));
  readableStream.push(") ");
  readableStream.push(BlockStatement.string(fl.body));

  let result = "";
  for await (const chunk of readableStream) {
    result += chunk;
  }
  return result;
};
