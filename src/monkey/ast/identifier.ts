import * as Token from "#root/src/monkey/token/token.ts";
export interface t {
  token: Token.t;
  value: string;
}

export const tokenLiteral = (i: t): string => i.token.literal;
