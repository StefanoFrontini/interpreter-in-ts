import * as Statement from "#root/src/monkey/ast/statement.ts";
export interface t {
  statements: Statement.t[];
}
export const tokenLiteral = (p: t): string => {
  if (p.statements.length > 0) {
    return Statement.tokenLiteral(p.statements[0]);
  } else {
    return "";
  }
};
