import * as Bool from "#root/src/monkey/object/bool.ts";
import * as Integer from "#root/src/monkey/object/integer.ts";
import * as Null from "#root/src/monkey/object/null.ts";

export type ObjectType = "INTEGER" | "BOOLEAN" | "NULL";

export const INTEGER_OBJ = "INTEGER",
  BOOLEAN_OBJ = "BOOLEAN",
  NULL_OBJ = "NULL";

export type t = Integer.t | Bool.t | Null.t;

export const inspect = (obj: t): string => {
  switch (obj["tag"]) {
    case "integer":
      return Integer.inspect(obj);
    case "boolean":
      return Bool.inspect(obj);
    case "null":
      return Null.inspect();
    default:
      const _exhaustiveCheck: never = obj;
      throw new Error(_exhaustiveCheck);
  }
};
