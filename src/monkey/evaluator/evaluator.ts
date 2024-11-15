import * as Ast from "#root/src/monkey/ast/ast.ts";
import * as Statement from "#root/src/monkey/ast/statement.ts";
import * as Integer from "#root/src/monkey/object/integer.ts";
import * as Obj from "#root/src/monkey/object/obj.ts";

const evalStatements = (statements: Statement.t[]): Obj.t | null => {
  let result: Obj.t | null = null;
  for (const statement of statements) {
    result = evalNode(statement);
  }
  return result;
};

export const evalNode = (node: Ast.t): Obj.t | null => {
  switch (node["tag"]) {
    case "program":
      return evalStatements(node["statements"]);
    case "expressionStatement":
      return evalNode(node["expression"]);
    case "integerLiteral":
      return {
        tag: "integer",
        value: node["value"],
      } as Integer.t;
    default:
      return null;
    //   const _exhaustiveCheck: never = node;
    //   throw new Error(_exhaustiveCheck);
  }
};
