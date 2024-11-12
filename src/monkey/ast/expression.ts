import * as BooleanExpression from "#root/src/monkey/ast/booleanExpression.ts";
import * as FunctionLiteral from "#root/src/monkey/ast/functionLiteral.ts";
import * as Identifier from "#root/src/monkey/ast/identifier.ts";
import * as IfExpression from "#root/src/monkey/ast/ifExpression.ts";
import * as InfixExpression from "#root/src/monkey/ast/infixExpression.ts";
import * as IntegerLiteral from "#root/src/monkey/ast/integerLiteral.ts";
import * as PrefixExpression from "#root/src/monkey/ast/prefixExpression.ts";
import { Readable } from "stream";

export type t =
  | Identifier.t
  | IntegerLiteral.t
  | PrefixExpression.t
  | InfixExpression.t
  | BooleanExpression.t
  | IfExpression.t
  | FunctionLiteral.t;

export const string = async (e: t): Promise<string> => {
  let stringExpr = "";
  switch (e["tag"]) {
    case "prefixExpression":
      stringExpr = await PrefixExpression.string(e);
      break;
    case "infixExpression":
      stringExpr = await InfixExpression.string(e);
      break;
    case "integerLiteral":
      stringExpr = IntegerLiteral.string(e);
      break;
    case "identifier":
      stringExpr = Identifier.string(e);
      break;
    case "booleanExpression":
      stringExpr = BooleanExpression.string(e);
      break;
    case "ifExpression":
      stringExpr = await IfExpression.string(e);
      break;
    case "functionLiteral":
      stringExpr = await FunctionLiteral.string(e);
      break;
    default:
      const _exhaustiveCheck: never = e;
      throw new Error(_exhaustiveCheck);
  }
  const readableStream = Readable.from([""]);
  readableStream.push(stringExpr);
  let result = "";
  for await (const chunk of readableStream) {
    result += chunk;
  }
  return result;
};
