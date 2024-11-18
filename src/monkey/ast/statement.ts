import * as BlockStatement from "#root/src/monkey/ast/blockStatement.ts";
import * as ExpressionStatement from "#root/src/monkey/ast/expressionStatement.ts";
import * as LetStatement from "#root/src/monkey/ast/letStatement.ts";
import * as ReturnStatement from "#root/src/monkey/ast/returnStatement.ts";

export type t =
  | LetStatement.t
  | ReturnStatement.t
  | ExpressionStatement.t
  | BlockStatement.t;

export const tokenLiteral = (s: t): string => s.token.literal;

export const string = async (s: t): Promise<string> => {
  switch (s["tag"]) {
    case "letStatement":
      return LetStatement.string(s);
    case "returnStatement":
      return await ReturnStatement.string(s);
    case "blockStatement":
      return await BlockStatement.string(s);
    case "expressionStatement":
      return await ExpressionStatement.string(s);
    default:
      const _exhaustiveCheck: never = s;
      return _exhaustiveCheck;
  }
};
