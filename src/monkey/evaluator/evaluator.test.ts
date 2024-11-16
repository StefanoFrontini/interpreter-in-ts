import * as Evaluator from "#root/src/monkey/evaluator/evaluator.ts";
import * as Lexer from "#root/src/monkey/lexer/lexer.ts";
import * as Bool from "#root/src/monkey/object/bool.ts";
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

const testBooleanObject = (obj: Obj.t | null, expected: boolean) => {
  assert.ok(obj, `obj is null. got=${obj}`);
  assert.strictEqual(
    obj["tag"],
    "boolean",
    `obj is not a Boolean. got=${obj["tag"]}`
  );
  const bool = obj as Bool.t;
  assert.strictEqual(
    bool.value,
    expected,
    `bool.value is not '${expected}'. got=${bool.value}`
  );
};

describe("evaluator", () => {
  it("TestEvalIntegerExpression", () => {
    const tests = [
      {
        input: "5",
        expected: 5,
      },
      {
        input: "10",
        expected: 10,
      },
      {
        input: "-5",
        expected: -5,
      },
      {
        input: "-10",
        expected: -10,
      },
    ];
    for (const tt of tests) {
      const evaluated = testEvalNode(tt.input);
      testIntegerObject(evaluated, tt.expected);
    }
  });
  it("TestEvalBooleanExpression", () => {
    const tests = [
      {
        input: "true",
        expected: true,
      },
      {
        input: "false",
        expected: false,
      },
    ];
    for (const tt of tests) {
      const evaluated = testEvalNode(tt.input);
      testBooleanObject(evaluated, tt.expected);
    }
  });
  it("TestBangOperator", () => {
    const tests = [
      {
        input: "!true",
        expected: false,
      },
      {
        input: "!false",
        expected: true,
      },
      {
        input: "!5",
        expected: false,
      },
      {
        input: "!!true",
        expected: true,
      },
      {
        input: "!!false",
        expected: false,
      },
      {
        input: "!!5",
        expected: true,
      },
    ];
    for (const tt of tests) {
      const evaluated = testEvalNode(tt.input);
      testBooleanObject(evaluated, tt.expected);
    }
  });
});
