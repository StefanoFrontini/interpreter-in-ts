import * as Expression from "#root/src/monkey/ast/expression.ts";
import * as Token from "#root/src/monkey/token/token.ts";
import { Readable } from "stream";
export type t = {
  tag: "prefixExpression";
  token: Token.t;
  operator: string;
  right: Expression.t;
};

export const tokenLiteral = (p: t): string => p.token.literal;

export const string = async (p: t): Promise<string> => {
  const readableStream = Readable.from([""]);
  readableStream.push("(");
  readableStream.push(p.operator);
  readableStream.push(Expression.string(p.right));
  readableStream.push(")");
  let result = "";
  for await (const chunk of readableStream) {
    result += chunk;
  }
  return result;
};
