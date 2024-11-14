import * as Bool from "#root/src/monkey/object/bool.ts";
import * as Integer from "#root/src/monkey/object/integer.ts";
import * as Null from "#root/src/monkey/object/null.ts";

export type ObjectType = "INTEGER" | "BOOLEAN" | "NULL";

export const INTEGER_OBJ = "INTEGER",
  BOOLEAN_OBJ = "BOOLEAN",
  NULL_OBJ = "NULL";

export type t = Integer.t | Bool.t | Null.t;
