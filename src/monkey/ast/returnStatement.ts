import * as Expression from "#root/src/monkey/ast/expression.ts";
import * as Token from "#root/src/monkey/token/token.ts";
export interface t {
  token: Token.t;
  returnValue?: Expression.t;
}
export const tokenLiteral = (r: t): string => r.token.literal;
