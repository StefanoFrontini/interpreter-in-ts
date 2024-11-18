import * as Expression from "#root/src/monkey/ast/identifier.ts";
import * as Token from "#root/src/monkey/token/token.ts";
import { Readable } from "node:stream";
export type t = {
  tag: "returnStatement";
  token: Token.t;
  returnValue: Expression.t;
};
export const tokenLiteral = (r: t): string => r.token.literal;

export const string = async (r: t): Promise<string> => {
  const readableStream = Readable.from([""]);
  readableStream.push(`${tokenLiteral(r)} `);
  if (r.returnValue !== null) {
    readableStream.push(Expression.string(r.returnValue));
  }
  readableStream.push(";");
  let result = "";
  for await (const chunk of readableStream) {
    result += chunk;
  }
  return result;
};
