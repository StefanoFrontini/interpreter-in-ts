import * as BlockStatement from "#root/src/monkey/ast/blockStatement.ts";
import * as Identifier from "#root/src/monkey/ast/identifier.ts";
import * as Evaluator from "#root/src/monkey/evaluator/evaluator.ts";
import * as Lexer from "#root/src/monkey/lexer/lexer.ts";
import * as Bool from "#root/src/monkey/object/bool.ts";
import * as Environment from "#root/src/monkey/object/environment.ts";
import * as Integer from "#root/src/monkey/object/integer.ts";
import * as Obj from "#root/src/monkey/object/obj.ts";
import * as Parser from "#root/src/monkey/parser/parser.ts";
import assert from "node:assert";
import { describe, it } from "node:test";
const testEvalNode = (input: string): Obj.t | null => {
  const l = Lexer.init(input);
  const p = Parser.init(l);
  const program = Parser.parseProgram(p);
  const env = Environment.newEnvironment();
  return Evaluator.evalNode(program, env);
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
  it("TestErrorHandling", () => {
    const tests = [
      {
        input: "5 + true;",
        expectedMessage: "type mismatch: INTEGER + BOOLEAN",
      },
      {
        input: "5 + true; 5;",
        expectedMessage: "type mismatch: INTEGER + BOOLEAN",
      },
      {
        input: "-true",
        expectedMessage: "unknown operator: -BOOLEAN",
      },
      {
        input: "true + false;",
        expectedMessage: "unknown operator: BOOLEAN + BOOLEAN",
      },
      {
        input: "5; true + false; 5",
        expectedMessage: "unknown operator: BOOLEAN + BOOLEAN",
      },
      {
        input: "if (10 > 1) { true + false; }",
        expectedMessage: "unknown operator: BOOLEAN + BOOLEAN",
      },
      {
        input: "if (10 > 1) { if (10 > 1) { return true + false; } return 1; }",
        expectedMessage: "unknown operator: BOOLEAN + BOOLEAN",
      },
      {
        input: "foobar",
        expectedMessage: "identifier not found: foobar",
      },
    ];

    for (const tt of tests) {
      const evaluated = testEvalNode(tt.input);
      if (!evaluated) {
        continue;
      }
      assert.strictEqual(
        evaluated["tag"],
        "error",
        `evaluated is not an error object. got=${evaluated["tag"]}`
      );
      assert.strictEqual(
        evaluated["message"],
        tt.expectedMessage,
        `wrong error message. expected=${tt.expectedMessage}, got=${evaluated["message"]}`
      );
    }
  });
  it("TestLetStatements", () => {
    const tests = [
      {
        input: "let a = 5; a;",
        expected: 5,
      },
      {
        input: "let a = 5 * 5; a;",
        expected: 25,
      },
      {
        input: "let a = 5; let b = a; b;",
        expected: 5,
      },
      {
        input: "let a = 5; let b = a; let c = a + b + 5; c;",
        expected: 15,
      },
    ];
    for (const tt of tests) {
      const evaluated = testEvalNode(tt.input);
      testIntegerObject(evaluated, tt.expected);
    }
  });
  it("TestFunctionObject", async () => {
    const input = "fn(x) { x + 2; };";
    const evaluated = testEvalNode(input);
    if (!evaluated) {
      throw new Error("evaluated is null");
    }
    assert.strictEqual(
      evaluated["tag"],
      "function",
      `evaluated is not a function object. got=${evaluated["tag"]}`
    );
    assert.strictEqual(
      evaluated["parameters"].length,
      1,
      `function has wrong parameters. got=${evaluated["parameters"].length}`
    );
    assert.strictEqual(
      Identifier.string(evaluated["parameters"][0]),
      "x",
      `parameter is not 'x'. got=${evaluated["parameters"][0]["value"]}`
    );

    const expectedBody = "(x + 2)";
    assert.strictEqual(
      await BlockStatement.string(evaluated["body"]),
      expectedBody,
      `body is not ${expectedBody}. got=${BlockStatement.string(
        evaluated["body"]
      )}`
    );
  });
  it("TestFunctionApplication", () => {
    const tests = [
      {
        input: "let identity = fn(x) { x; }; identity(5);",
        expected: 5,
      },
      {
        input: "let identity = fn(x) { return x; }; identity(5);",
        expected: 5,
      },
      {
        input: "let double = fn(x) { x * 2; }; double(5);",
        expected: 10,
      },
      {
        input: "let add = fn(x, y) { x + y; }; add(5, 5);",
        expected: 10,
      },
      {
        input: "let add = fn(x, y) { x + y; }; add(5 + 5, add(5, 5));",
        expected: 20,
      },
      {
        input: "fn(x) { x; }(5)",
        expected: 5,
      },
    ];
    for (const tt of tests) {
      const evaluated = testEvalNode(tt.input);
      if (!evaluated) {
        throw new Error("evaluated is null");
      }
      testIntegerObject(evaluated, tt.expected);
    }
  });
  it("TestClosures", () => {
    const input = `
      let newAdder = fn(x) {
        fn(y) { x + y };
      };
      let addTwo = newAdder(2);
      addTwo(2);
    `;
    const evaluated = testEvalNode(input);
    if (!evaluated) {
      throw new Error("evaluated is null");
    }
    testIntegerObject(evaluated, 4);
  });
});
