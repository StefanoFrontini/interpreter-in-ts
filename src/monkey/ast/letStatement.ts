import * as Expression from "#root/src/monkey/ast/expression.ts";
import * as Identifier from "#root/src/monkey/ast/identifier.ts";
import * as Token from "#root/src/monkey/token/token.ts";
export interface t {
  token: Token.t;
  name: Identifier.t;
  value?: Expression.t;
}
