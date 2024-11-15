import * as Evaluator from "#root/src/monkey/evaluator/evaluator.ts";
import * as Lexer from "#root/src/monkey/lexer/lexer.ts";
import * as Integer from "#root/src/monkey/object/integer.ts";
import * as Obj from "#root/src/monkey/object/obj.ts";
import * as Parser from "#root/src/monkey/parser/parser.ts";
import assert from "node:assert";
import { describe, it } from "node:test";

const testEvalNode = (input: string): Obj.t | null => {
  const l = Lexer.init(input);
  const p = Parser.init(l);
  const program = Parser.parseProgram(p);
  return Evaluator.evalNode(program);
};

const testIntegerObject = (obj: Obj.t | null, expected: number) => {
  assert.ok(obj, `obj is null. got=${obj}`);
  assert.strictEqual(
    obj["tag"],
    "integer",
    `obj is not an Integer. got=${obj["tag"]}`
  );
  const il = obj as Integer.t;
  assert.strictEqual(
    il.value,
    expected,
    `il.value is not '${expected}'. got=${il.value}`
  );
};

describe("evaluator", () => {
  it("TestEvalIntegerExpression", async () => {
    const tests = [
      {
        input: "5",
        expected: 5,
      },
      {
        input: "10",
        expected: 10,
      },
    ];
    for (const tt of tests) {
      const evaluated = testEvalNode(tt.input);
      testIntegerObject(evaluated, tt.expected);
    }
  });
});
