import * as Ast from "#root/src/monkey/ast/ast.ts";
import * as BlockStatement from "#root/src/monkey/ast/blockStatement.ts";
import * as Identifier from "#root/src/monkey/ast/identifier.ts";
import * as IfExpression from "#root/src/monkey/ast/ifExpression.ts";
import * as Program from "#root/src/monkey/ast/program.ts";
import * as Bool from "#root/src/monkey/object/bool.ts";
import * as Environment from "#root/src/monkey/object/environment.ts";
import * as ErrorObj from "#root/src/monkey/object/errorObj.ts";
import * as Function from "#root/src/monkey/object/function.ts";
import * as Integer from "#root/src/monkey/object/integer.ts";
import * as Null from "#root/src/monkey/object/null.ts";
import * as Obj from "#root/src/monkey/object/obj.ts";
// const evalStatements = (statements: Statement.t[]): Obj.t | null => {
//   let result: Obj.t | null = null;
//   for (const statement of statements) {
//     result = evalNode(statement, env);
//     if (result !== null && result["tag"] === "returnValue") {
//       return result["value"];
//     }
//   }
//   return result;
// };

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

const evalIfExpression = (
  ie: IfExpression.t,
  env: Environment.t
): Obj.t | null => {
  //   console.dir(ie, { depth: null });
  const condition = evalNode(ie["condition"], env);
  if (isError(condition)) return condition;
  if (isTruthy(condition)) {
    return evalNode(ie["consequence"], env);
  } else if (ie["alternative"]) {
    return evalNode(ie["alternative"], env);
  } else {
    return NULL;
  }
};
const evalProgram = (program: Program.t, env: Environment.t): Obj.t | null => {
  let result: Obj.t | null = null;
  for (const statement of program.statements) {
    result = evalNode(statement, env);
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

const evalBlockStatement = (
  block: BlockStatement.t,
  env: Environment.t
): Obj.t | null => {
  let result: Obj.t | null = null;
  for (const statement of block.statements) {
    result = evalNode(statement, env);
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

const evalIdentifier = (
  node: Identifier.t,
  env: Environment.t
): Obj.t | null => {
  const val = Environment.get(env, node["value"]);
  if (!val) {
    return newError(`identifier not found: ${node["value"]}`);
  }
  return val;
};

const evalExpressions = (exps: Ast.t[], env: Environment.t): Obj.t[] => {
  const result: Obj.t[] = [];
  for (const e of exps) {
    const evaluated = evalNode(e, env);
    if (!evaluated) return [newError("evaluated is null")];
    if (isError(evaluated)) return [evaluated];
    result.push(evaluated);
  }
  return result;
};

const extendFunctionEnv = (fn: Obj.t, args: Obj.t[]): Environment.t => {
  const env = Environment.newEnclosedEnvironment(fn["env"]);
  for (const [paramIdx, param] of fn["parameters"].entries()) {
    Environment.set(env, param["value"], args[paramIdx]);
  }
  return env;
};

const unwrapReturnValue = (obj: Obj.t): Obj.t => {
  if (Obj.type(obj) === Obj.RETURN_VALUE_OBJ) {
    return obj["value"];
  }
  return obj;
};
const applyFunction = (fn: Obj.t, args: Obj.t[]): Obj.t | null => {
  if (Obj.type(fn) !== Obj.FUNCTION_OBJ) {
    return newError(`not a function: ${Obj.type(fn)}`);
  }
  const extendedEnv = extendFunctionEnv(fn, args);
  const evaluated = evalNode(fn["body"], extendedEnv);
  if (!evaluated) return newError("evaluated is null");
  if (isError(evaluated)) return evaluated;
  return unwrapReturnValue(evaluated);
};
export const evalNode = (node: Ast.t, env: Environment.t): Obj.t | null => {
  //   console.dir(node, { depth: null });
  switch (node["tag"]) {
    case "program":
      return evalProgram(node, env);
    case "expressionStatement":
      return evalNode(node["expression"], env);
    case "integerLiteral":
      return {
        tag: "integer",
        value: node["value"],
      } as Integer.t;
    case "booleanExpression":
      return nativeBoolToBooleanObject(node["value"]);
    case "prefixExpression":
      const right = evalNode(node["right"], env);
      if (isError(right)) return right;
      return evalPrefixExpression(node["operator"], right);
    case "infixExpression":
      const left = evalNode(node["left"], env);
      if (isError(left)) return left;
      const rt = evalNode(node["right"], env);
      if (isError(rt)) return rt;
      return evalInfixExpression(node["operator"], left, rt);
    case "blockStatement":
      return evalBlockStatement(node, env);
    case "ifExpression":
      return evalIfExpression(node, env);
    case "returnStatement":
      const val = evalNode(node["returnValue"], env);
      if (isError(val)) return val;
      return {
        tag: "returnValue",
        value: val ?? NULL,
      };
    case "identifier":
      return evalIdentifier(node, env);
    case "letStatement":
      const letValue = evalNode(node["value"], env);
      if (!letValue) return null;
      if (isError(letValue)) return letValue;
      Environment.set(env, node["name"]["value"], letValue);
      return letValue;
    case "functionLiteral":
      return {
        tag: "function",
        parameters: node["parameters"],
        body: node["body"],
        env: env,
      } as Function.t;
    case "callExpression":
      const func = evalNode(node["function"], env);
      if (!func) return newError("func is null");
      if (isError(func)) return func;
      const args = evalExpressions(node["arguments"], env);
      if (args.length === 1 && isError(args[0])) return args[0];
      return applyFunction(func, args);

    default:
      return null;
  }
};
