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

const testNullObject = (obj: Obj.t | null) => {
  assert.ok(obj, `obj is null. got=${obj}`);
  assert.strictEqual(
    obj["tag"],
    "null",
    `obj is not a Null. got=${obj["tag"]}`
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
      {
        input: "5 + 5 + 5 + 5 - 10",
        expected: 10,
      },
      {
        input: "2 * 2 * 2 * 2 * 2",
        expected: 32,
      },
      {
        input: "-50 + 100 + -50",
        expected: 0,
      },
      {
        input: "5 * 2 + 10",
        expected: 20,
      },
      {
        input: "5 + 2 * 10",
        expected: 25,
      },
      {
        input: "20 + 2 * -10",
        expected: 0,
      },
      {
        input: "50 / 2 * 2 + 10",
        expected: 60,
      },
      {
        input: "2 * (5 + 10)",
        expected: 30,
      },
      {
        input: "3 * 3 * 3 + 10",
        expected: 37,
      },
      {
        input: "3 * (3 * 3) + 10",
        expected: 37,
      },
      {
        input: "(5 + 10 * 2 + 15 / 3) * 2 + -10",
        expected: 50,
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
      {
        input: "1 < 2",
        expected: true,
      },
      {
        input: "1 > 2",
        expected: false,
      },
      {
        input: "1 < 1",
        expected: false,
      },
      {
        input: "1 > 1",
        expected: false,
      },
      {
        input: "1 == 1",
        expected: true,
      },
      {
        input: "1 != 1",
        expected: false,
      },
      {
        input: "1 == 2",
        expected: false,
      },
      {
        input: "1 != 2",
        expected: true,
      },
      {
        input: "true == true",
        expected: true,
      },
      {
        input: "false == false",
        expected: true,
      },
      {
        input: "true == false",
        expected: false,
      },
      {
        input: "true != false",
        expected: true,
      },
      {
        input: "(1 < 2) == true",
        expected: true,
      },
      {
        input: "(1 < 2) == false",
        expected: false,
      },
      {
        input: "(1 > 2) == true",
        expected: false,
      },
      {
        input: "(1 > 2) == false",
        expected: true,
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
  it("TestIfElseExpressions", () => {
    const tests = [
      {
        input: "if (true) { 10 }",
        expected: 10,
      },
      {
        input: "if (false) { 10 }",
        expected: null,
      },
      {
        input: "if (1) { 10 }",
        expected: 10,
      },
      {
        input: "if (1 < 2) { 10 }",
        expected: 10,
      },
      {
        input: "if (1 > 2) { 10 }",
        expected: null,
      },
      {
        input: "if (1 > 2) { 10 } else { 20 }",
        expected: 20,
      },
      {
        input: "if (1 < 2) { 10 } else { 20 }",
        expected: 10,
      },
    ];
    for (const tt of tests) {
      const evaluated = testEvalNode(tt.input);
      if (tt.expected) {
        testIntegerObject(evaluated, tt.expected);
      } else {
        testNullObject(evaluated);
      }
    }
  });
  it("TestReturnStatements", () => {
    const tests = [
      {
        input: "return 10;",
        expected: 10,
      },
      {
        input: "return 10; 9;",
        expected: 10,
      },
      {
        input: "return 2 * 5; 9;",
        expected: 10,
      },
      {
        input: "9; return 2 * 5; 9;",
        expected: 10,
      },
      {
        input: `
                if (10 > 1) {
                    if (10 > 1) {
                        return 10;
                        }
                    return 1;
                }
        `,
        expected: 10,
      },
    ];
    for (const tt of tests) {
      const evaluated = testEvalNode(tt.input);
      testIntegerObject(evaluated, tt.expected);
    }
  });
});
