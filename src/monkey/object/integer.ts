import * as Obj from "#root/src/monkey/object/obj.ts";
export type t = {
  tag: "integer";
  value: number;
};

export const inspect = (i: t): string => i.value.toString();

export const type = (): Obj.ObjectType => Obj.INTEGER_OBJ;
