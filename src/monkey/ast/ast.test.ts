import * as Program from "#root/src/monkey/ast/program.ts";
import * as Token from "#root/src/monkey/token/token.ts";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("ast", () => {
  it("TestString", async () => {
    const program: Program.t = {
      statements: [
        {
          token: { type: Token.LET, literal: "let" },
          name: {
            token: { type: Token.IDENT, literal: "myVar" },
            value: "myVar",
          },
          value: {
            token: { type: Token.ASSIGN, literal: "anotherVar" },
            value: "anotherVar",
          },
        },
      ],
    };
    assert.strictEqual(
      await Program.string(program),
      "let myVar = anotherVar;",
      `program.string() wrong. got=${await Program.string(program)}`
    );
  });
});
