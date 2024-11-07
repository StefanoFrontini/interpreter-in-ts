import * as Expression from "#root/src/monkey/ast/expression.ts";
import * as Token from "#root/src/monkey/token/token.ts";
import { Readable } from "node:stream";
export interface t {
  _tag: "infixExpression";
  token: Token.t;
  left: Expression.t;
  operator: string;
  right: Expression.t;
}

export const tokenLiteral = (i: t): string => i.token.literal;

export const string = async (i: t): Promise<string> => {
  const readableStream = Readable.from([""]);
  readableStream.push("(");
  readableStream.push(Expression.string(i.left));
  readableStream.push(" " + i.operator + " ");
  readableStream.push(Expression.string(i.right));
  readableStream.push(")");
  let result = "";
  for await (const chunk of readableStream) {
    result += chunk;
  }
  return result;
};
