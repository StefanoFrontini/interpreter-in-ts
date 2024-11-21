import * as BlockStatement from "#root/src/monkey/ast/blockStatement.ts";
import * as Identifier from "#root/src/monkey/ast/identifier.ts";
import * as Environment from "#root/src/monkey/object/environment.ts";
import * as Obj from "#root/src/monkey/object/obj.ts";
import { Readable } from "node:stream";
export type t = {
  tag: "function";
  parameters: Array<Identifier.t>;
  body: BlockStatement.t;
  env: Environment.t;
};

export const type = (): Obj.ObjectType => Obj.FUNCTION_OBJ;
export const inspect = async (f: t): Promise<string> => {
  const readableStream = Readable.from([""]);
  const params: string[] = [];
  for (const p of f.parameters) {
    params.push(Identifier.string(p));
  }
  readableStream.push(`fn(${params.join(", ")}) {\n`);
  readableStream.push(BlockStatement.string(f.body));
  readableStream.push("\n}");
  let result = "";
  for await (const chunk of readableStream) {
    result += chunk;
  }
  return result;
};
