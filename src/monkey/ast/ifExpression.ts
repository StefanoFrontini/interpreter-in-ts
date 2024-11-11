import * as BlockStatement from "#root/src/monkey/ast/blockStatement.ts";
import * as Expression from "#root/src/monkey/ast/expression.ts";
import * as Token from "#root/src/monkey/token/token.ts";
import { Readable } from "node:stream";
export type t = {
  tag: "ifExpression";
  token: Token.t;
  condition: Expression.t;
  consequence: BlockStatement.t;
  alternative: BlockStatement.t | null;
};

export const tokenLiteral = (ie: t): string => ie.token.literal;

export const string = async (ie: t): Promise<string> => {
  const readableStream = Readable.from([""]);
  readableStream.push("if");
  readableStream.push(Expression.string(ie.condition));
  readableStream.push(" ");
  readableStream.push(BlockStatement.string(ie.consequence));
  if (ie.alternative !== null) {
    readableStream.push("else ");
    readableStream.push(BlockStatement.string(ie.alternative));
  }
  let result = "";
  for await (const chunk of readableStream) {
    result += chunk;
  }
  return result;
};
