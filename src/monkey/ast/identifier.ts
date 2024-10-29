import * as Token from "#root/src/monkey/token/token.ts";
export interface t {
  token: Token.t;
  value: string;
}

export const tokenLiteral = (i: t): string => i.token.literal;

export const string = (i: t): string => {
  return i.value;
  // const readableStream = new Readable({ encoding: "utf-8" });
  // readableStream.push(i.value);
  // return readableStream;
};
