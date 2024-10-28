import * as LetStatement from "#root/src/monkey/ast/letStatement.ts";
import * as ReturnStatement from "#root/src/monkey/ast/returnStatement.ts";

export type t = LetStatement.t | ReturnStatement.t;

export const tokenLiteral = (s: t): string => s.token.literal;
