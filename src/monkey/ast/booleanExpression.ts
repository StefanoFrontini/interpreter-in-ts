import * as Token from "#root/src/monkey/token/token.ts";
export type t = {
  tag: "booleanExpression";
  token: Token.t;
  value: boolean;
};

export const tokenLiteral = (b: t): string => b.token.literal;

export const string = (b: t): string => b.token.literal;
