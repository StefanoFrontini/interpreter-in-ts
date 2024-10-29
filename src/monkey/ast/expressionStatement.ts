import * as Expression from "#root/src/monkey/ast/expression.ts";
import * as Token from "#root/src/monkey/token/token.ts";
export interface t {
  token: Token.t;
  expression: Expression.t;
}

export const tokenLiteral = (e: t): string => e.token.literal;

export const string = (e: t): string => {
  //   if (e.expression !== null) {
  //     return e.expression.string();
  //   }
  return "";
  //   const readableStream = new Readable({ encoding: "utf-8" });
  //   readableStream.push(Expression.string(e.expression));
  //   readableStream.push(";");
  //   return readableStream;
};
