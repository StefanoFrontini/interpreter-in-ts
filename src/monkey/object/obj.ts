import * as Bool from "#root/src/monkey/object/bool.ts";
import * as ErrorObj from "#root/src/monkey/object/errorObj.ts";
import * as Integer from "#root/src/monkey/object/integer.ts";
import * as Null from "#root/src/monkey/object/null.ts";
import * as ReturnValue from "#root/src/monkey/object/returnValue.ts";

export type ObjectType =
  | "INTEGER"
  | "BOOLEAN"
  | "NULL"
  | "RETURN_VALUE"
  | "ERROR_OBJ";

export const INTEGER_OBJ = "INTEGER",
  BOOLEAN_OBJ = "BOOLEAN",
  NULL_OBJ = "NULL",
  RETURN_VALUE_OBJ = "RETURN_VALUE",
  ERROR_OBJ = "ERROR_OBJ";

export type t = Integer.t | Bool.t | Null.t | ReturnValue.t | ErrorObj.t;

export const inspect = (obj: t): string => {
  switch (obj["tag"]) {
    case "integer":
      return Integer.inspect(obj);
    case "boolean":
      return Bool.inspect(obj);
    case "null":
      return Null.inspect();
    case "returnValue":
      return ReturnValue.inspect(obj);
    case "error":
      return ErrorObj.inspect(obj);
    default:
      const _exhaustiveCheck: never = obj;
      throw new Error(_exhaustiveCheck);
  }
};

export const type = (obj: t): ObjectType => {
  switch (obj["tag"]) {
    case "integer":
      return INTEGER_OBJ;
    case "boolean":
      return BOOLEAN_OBJ;
    case "null":
      return NULL_OBJ;
    case "returnValue":
      return RETURN_VALUE_OBJ;
    case "error":
      return ERROR_OBJ;
    default:
      const _exhaustiveCheck: never = obj;
      throw new Error(_exhaustiveCheck);
  }
};
