import * as Token from "#root/src/monkey/token/token.ts";
export interface t {
  _tag: "integerLiteral";
  token: Token.t;
  value: number;
}

export const tokenLiteral = (i: t): string => i.token.literal;

export const string = (i: t): string => {
  return i.token.literal;
};
