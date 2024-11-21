import * as Obj from "#root/src/monkey/object/obj.ts";
export type t = {
  tag: "returnValue";
  value: Obj.t;
};
export const type = (): Obj.ObjectType => Obj.RETURN_VALUE_OBJ;

export const inspect = async (rv: t): Promise<string> => Obj.inspect(rv.value);
