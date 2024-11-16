import * as Ast from "#root/src/monkey/ast/ast.ts";
import * as Statement from "#root/src/monkey/ast/statement.ts";
import * as Bool from "#root/src/monkey/object/bool.ts";
import * as Integer from "#root/src/monkey/object/integer.ts";
import * as Null from "#root/src/monkey/object/null.ts";
import * as Obj from "#root/src/monkey/object/obj.ts";

const evalStatements = (statements: Statement.t[]): Obj.t | null => {
  let result: Obj.t | null = null;
  for (const statement of statements) {
    result = evalNode(statement);
  }
  return result;
};

const TRUE: Bool.t = {
  tag: "boolean",
  value: true,
};

const FALSE: Bool.t = {
  tag: "boolean",
  value: false,
};

const NULL: Null.t = {
  tag: "null",
};

const nativeBoolToBooleanObject = (input: boolean): Bool.t =>
  input ? TRUE : FALSE;

const evalBangOperatorExpression = (right: Obj.t | null): Obj.t | null => {
  if (right === null) {
    return NULL;
  }
  switch (right["tag"]) {
    case "boolean":
      return nativeBoolToBooleanObject(!right["value"]);
    case "null":
      return TRUE;
    default:
      return FALSE;
    //   const _exhaustiveCheck: never = right;
    //   throw new Error(_exhaustiveCheck);
  }
};

const evalMinusPrefixOperatorExpression = (
  right: Obj.t | null
): Obj.t | null => {
  if (right === null) {
    return NULL;
  }
  switch (right["tag"]) {
    case "integer":
      return {
        tag: "integer",
        value: -right["value"],
      } as Integer.t;
    default:
      return NULL;
    //   const _exhaustiveCheck: never = right;
    //   throw new Error(_exhaustiveCheck);
  }
};

const evalPrefixExpression = (
  operator: string,
  right: Obj.t | null
): Obj.t | null => {
  switch (operator) {
    case "!":
      return evalBangOperatorExpression(right);
    case "-":
      return evalMinusPrefixOperatorExpression(right);
    default:
      return NULL;
    //   const _exhaustiveCheck: never = operator;
    //   throw new Error(_exhaustiveCheck);
  }
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
    case "booleanExpression":
      return nativeBoolToBooleanObject(node["value"]);
    case "prefixExpression":
      const right = evalNode(node["right"]);
      return evalPrefixExpression(node["operator"], right);
    default:
      return null;
    //   const _exhaustiveCheck: never = node;
    //   throw new Error(_exhaustiveCheck);
  }
};
