import * as Obj from "#root/src/monkey/object/obj.ts";
export type t = {
  // outer: t | null;
  store: Map<string, Obj.t>;
};

export const newEnvironment = (): t => {
  return {
    // outer: null,
    store: new Map<string, Obj.t>(),
  };
};

export const get = (e: t, name: string): Obj.t | null => {
  return e.store.get(name) ?? null;
};

export const set = (e: t, name: string, val: Obj.t): Obj.t => {
  e.store.set(name, val);
  return val;
};
