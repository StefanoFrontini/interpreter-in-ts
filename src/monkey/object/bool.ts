import * as Obj from "#root/src/monkey/object/obj.ts";
export type t = {
  tag: "boolean";
  value: boolean;
};

export const inspect = (b: t): string => b.value.toString();

export const type = (): Obj.ObjectType => Obj.BOOLEAN_OBJ;
