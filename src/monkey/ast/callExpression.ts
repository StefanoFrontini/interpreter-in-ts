import * as Expression from "#root/src/monkey/ast/expression.ts";
import * as Token from "#root/src/monkey/token/token.ts";
import { Readable } from "node:stream";
export type t = {
  tag: "callExpression";
  token: Token.t;
  function: Expression.t;
  arguments: Expression.t[];
};

export const tokenLiteral = (ce: t): string => ce.token.literal;

export const string = async (ce: t): Promise<string> => {
  const readableStream = Readable.from([""]);
  const args: string[] = [];
  for (const a of ce.arguments) {
    args.push(await Expression.string(a));
  }
  readableStream.push(Expression.string(ce.function));
  readableStream.push("(");
  readableStream.push(args.join(", "));
  readableStream.push(")");
  let result = "";
  for await (const chunk of readableStream) {
    result += chunk;
  }
  return result;
};
