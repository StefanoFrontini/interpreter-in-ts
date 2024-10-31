import * as Identifier from "#root/src/monkey/ast/identifier.ts";
import * as IntegerLiteral from "#root/src/monkey/ast/integerLiteral.ts";
import * as PrefixExpression from "#root/src/monkey/ast/prefixExpression.ts";
import { Readable } from "stream";

export type t = Identifier.t | IntegerLiteral.t | PrefixExpression.t;

const isIdentifer = (e: t): e is Identifier.t => {
  return e.token.type === "IDENT";
};

const isIntegerLiteral = (e: t): e is IntegerLiteral.t => {
  return e.token.type === "INT";
};

export const string = async (e: t): Promise<string> => {
  let stringExpr = "";
  if (isIdentifer(e)) {
    stringExpr = Identifier.string(e);
  }
  if (isIntegerLiteral(e)) {
    stringExpr = IntegerLiteral.string(e);
  }
  const readableStream = Readable.from([""]);
  readableStream.push(stringExpr);
  let result = "";
  for await (const chunk of readableStream) {
    result += chunk;
  }
  return result;
};
