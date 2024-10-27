import * as LetStatement from "#root/src/monkey/ast/letStatement.ts";

export type t = LetStatement.t;

export const tokenLiteral = (s: t): string => s.token.literal;
