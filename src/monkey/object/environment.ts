import * as Obj from "#root/src/monkey/object/obj.ts";
export type t = {
  store: Map<string, Obj.t>;
  outer: t | null;
};

export const newEnvironment = (): t => {
  return {
    store: new Map<string, Obj.t>(),
    outer: null,
  };
};

export const newEnclosedEnvironment = (outer: t): t => {
  const env = newEnvironment();
  env.outer = outer;
  return env;
};

export const get = (e: t, name: string): Obj.t | null => {
  if (!e.store.has(name) && e.outer) return get(e.outer, name);
  return e.store.get(name) ?? null;
};

export const set = (e: t, name: string, val: Obj.t): Obj.t => {
  e.store.set(name, val);
  return val;
};
