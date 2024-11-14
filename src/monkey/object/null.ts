import * as Obj from "#root/src/monkey/object/obj.ts";

export type t = {
  tag: "null";
};

export const inspect = (): string => "null";

export const type = (): Obj.ObjectType => Obj.NULL_OBJ;
