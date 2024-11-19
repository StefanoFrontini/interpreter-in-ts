import * as Obj from "#root/src/monkey/object/obj.ts";
export type t = {
  tag: "error";
  message: string;
};

export const type = (): Obj.ObjectType => Obj.ERROR_OBJ;

export const inspect = (e: t): string => `ERROR: ${e.message}`;
