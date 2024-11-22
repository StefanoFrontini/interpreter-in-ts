import * as Obj from "#root/src/monkey/object/obj.ts";
export type t = {
  tag: "string";
  value: string;
};

export const type = (): Obj.ObjectType => Obj.STRING_OBJ;

export const inspect = (s: t): string => s.value;
