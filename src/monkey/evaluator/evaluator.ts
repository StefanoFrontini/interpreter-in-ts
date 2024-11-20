import * as Ast from "#root/src/monkey/ast/ast.ts";
import * as BlockStatement from "#root/src/monkey/ast/blockStatement.ts";
import * as IfExpression from "#root/src/monkey/ast/ifExpression.ts";
import * as Program from "#root/src/monkey/ast/program.ts";
import * as Statement from "#root/src/monkey/ast/statement.ts";
import * as Bool from "#root/src/monkey/object/bool.ts";
import * as ErrorObj from "#root/src/monkey/object/errorObj.ts";
import * as Integer from "#root/src/monkey/object/integer.ts";
import * as Null from "#root/src/monkey/object/null.ts";
import * as Obj from "#root/src/monkey/object/obj.ts";

const evalStatements = (statements: Statement.t[]): Obj.t | null => {
  let result: Obj.t | null = null;
  for (const statement of statements) {
    result = evalNode(statement);
    if (result !== null && result["tag"] === "returnValue") {
      return result["value"];
    }
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

const newError = (message: string, ..._args: string[]): ErrorObj.t => {
  return {
    tag: "error",
    message: message + _args.join("\n"),
  };
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
    return newError(`right expression is null`);
  }
  if (Obj.type(right) !== Obj.INTEGER_OBJ) {
    return newError(`unknown operator: -`, Obj.type(right));
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
  if (right === null) {
    return newError(`right expression is null`);
  }
  switch (operator) {
    case "!":
      return evalBangOperatorExpression(right);
    case "-":
      return evalMinusPrefixOperatorExpression(right);
    default:
      return newError(`unknown operator: ${operator}`, Obj.type(right));
    //   const _exhaustiveCheck: never = operator;
    //   throw new Error(_exhaustiveCheck);
  }
};

const evalIntegerInfixExpression = (
  operator: string,
  left: Obj.t | null,
  right: Obj.t | null
): Obj.t => {
  if (left === null || right === null) {
    return newError(`left or right expression is null`);
  }
  switch (operator) {
    case "+":
      return {
        tag: "integer",
        value: left["value"] + right["value"],
      } as Integer.t;
    case "-":
      return {
        tag: "integer",
        value: left["value"] - right["value"],
      } as Integer.t;
    case "*":
      return {
        tag: "integer",
        value: left["value"] * right["value"],
      } as Integer.t;
    case "/":
      return {
        tag: "integer",
        value: left["value"] / right["value"],
      } as Integer.t;
    case "<":
      return nativeBoolToBooleanObject(left["value"] < right["value"]);
    case ">":
      return nativeBoolToBooleanObject(left["value"] > right["value"]);
    case "==":
      return nativeBoolToBooleanObject(left["value"] === right["value"]);
    case "!=":
      return nativeBoolToBooleanObject(left["value"] !== right["value"]);
    default:
      return newError(
        `unknown operator: ${Obj.type(left)} ${operator} ${Obj.type(right)}`
      );
    //   const _exhaustiveCheck: never = operator;
    //   throw new Error(_exhaustiveCheck);
  }
};

const evalInfixExpression = (
  operator: string,
  left: Obj.t | null,
  right: Obj.t | null
): Obj.t | null => {
  if (left === null || right === null) {
    return newError(`left or right expression is null`);
  }
  if (left["tag"] === "integer" && right["tag"] === "integer") {
    return evalIntegerInfixExpression(operator, left, right);
  }
  if (operator === "==") {
    return nativeBoolToBooleanObject(left === right);
  }
  if (operator === "!=") {
    return nativeBoolToBooleanObject(left !== right);
  }
  if (Obj.type(left) !== Obj.type(right)) {
    return newError(
      `type mismatch: ${Obj.type(left)} ${operator} ${Obj.type(right)}`
    );
  }
  return newError(
    `unknown operator: ${Obj.type(left)} ${operator} ${Obj.type(right)}`
  );
};

const isTruthy = (obj: Obj.t | null): boolean => {
  if (obj === null) {
    return false;
  }
  switch (obj["tag"]) {
    case "boolean":
      return obj["value"];
    case "null":
      return false;
    default:
      return true;
    //   const _exhaustiveCheck: never = obj;
    //   throw new Error(_exhaustiveCheck);
  }
};

const evalIfExpression = (ie: IfExpression.t): Obj.t | null => {
  //   console.dir(ie, { depth: null });
  const condition = evalNode(ie["condition"]);
  if (isError(condition)) return condition;
  if (isTruthy(condition)) {
    return evalNode(ie["consequence"]);
  } else if (ie["alternative"]) {
    return evalNode(ie["alternative"]);
  } else {
    return NULL;
  }
};
const evalProgram = (program: Program.t): Obj.t | null => {
  let result: Obj.t | null = null;
  for (const statement of program.statements) {
    result = evalNode(statement);
    if (!result) return newError("result is null");
    switch (Obj.type(result)) {
      case Obj.RETURN_VALUE_OBJ:
        return result["value"];
      case Obj.ERROR_OBJ:
        return result;
    }
    // if (result !== null && result["tag"] === "returnValue") {
    //   return result["value"];
    // }
  }
  return result;
};

const evalBlockStatement = (block: BlockStatement.t): Obj.t | null => {
  let result: Obj.t | null = null;
  for (const statement of block.statements) {
    result = evalNode(statement);
    if (result !== null) {
      if (
        Obj.type(result) === Obj.RETURN_VALUE_OBJ ||
        Obj.type(result) === Obj.ERROR_OBJ
      ) {
        return result;
      }
    }
  }
  return result;
};

const isError = (obj: Obj.t | null): boolean => {
  if (obj === null) {
    return false;
  }
  return Obj.type(obj) === Obj.ERROR_OBJ;
};

export const evalNode = (node: Ast.t): Obj.t | null => {
  //   console.dir(node, { depth: null });
  switch (node["tag"]) {
    case "program":
      return evalProgram(node);
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
      if (isError(right)) return right;
      return evalPrefixExpression(node["operator"], right);
    case "infixExpression":
      const left = evalNode(node["left"]);
      if (isError(left)) return left;
      const rt = evalNode(node["right"]);
      if (isError(rt)) return rt;
      return evalInfixExpression(node["operator"], left, rt);
    case "blockStatement":
      return evalBlockStatement(node);
    case "ifExpression":
      return evalIfExpression(node);
    case "returnStatement":
      const val = evalNode(node["returnValue"]);
      if (isError(val)) return val;
      return {
        tag: "returnValue",
        value: val ?? NULL,
      };
    default:
      return null;
    //   const _exhaustiveCheck: never = node;
    //   throw new Error(_exhaustiveCheck);
  }
};
