import * as ExpressionStatement from "#root/src/monkey/ast/expressionStatement.ts";
import * as LetStatement from "#root/src/monkey/ast/letStatement.ts";
import * as ReturnStatement from "#root/src/monkey/ast/returnStatement.ts";

export type t = LetStatement.t | ReturnStatement.t | ExpressionStatement.t;

export const tokenLiteral = (s: t): string => s.token.literal;

const isLetStatement = (s: t): s is LetStatement.t => {
  return s.token.literal === "let";
};
const isReturnStatement = (s: t): s is ReturnStatement.t => {
  return s.token.literal === "return";
};

export const string = async (s: t): Promise<string> =>
  isLetStatement(s)
    ? await LetStatement.string(s)
    : isReturnStatement(s)
    ? await ReturnStatement.string(s)
    : ExpressionStatement.string(s);
