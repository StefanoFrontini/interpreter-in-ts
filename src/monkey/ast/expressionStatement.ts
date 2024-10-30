import * as Expression from "#root/src/monkey/ast/expression.ts";
import * as Token from "#root/src/monkey/token/token.ts";
export interface t {
  token: Token.t;
  expression: Expression.t;
}

export const tokenLiteral = (e: t): string => e.token.literal;

export const string = (e: t): Promise<string> => {
  if (e.expression !== null) {
    return Expression.string(e.expression);
  }
  return Promise.resolve("");
};
