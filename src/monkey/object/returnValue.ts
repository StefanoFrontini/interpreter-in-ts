import * as Obj from "#root/src/monkey/object/obj.ts";
export type t = {
  tag: "returnValue";
  value: Obj.t;
};
export const type = (): Obj.ObjectType => Obj.RETURN_VALUE_OBJ;

export const inspect = (rv: t): string => Obj.inspect(rv.value);
