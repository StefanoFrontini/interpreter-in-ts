import * as BooleanExpression from "#root/src/monkey/ast/booleanExpression.ts";
import * as CallExpression from "#root/src/monkey/ast/callExpression.ts";
import * as Expression from "#root/src/monkey/ast/expression.ts";
import * as ExpressionStatement from "#root/src/monkey/ast/expressionStatement.ts";
import * as FunctionLiteral from "#root/src/monkey/ast/functionLiteral.ts";
import * as Identifier from "#root/src/monkey/ast/identifier.ts";
import * as IfExpression from "#root/src/monkey/ast/ifExpression.ts";
import * as InfixExpression from "#root/src/monkey/ast/infixExpression.ts";
import * as IntegerLiteral from "#root/src/monkey/ast/integerLiteral.ts";
import * as LetStatement from "#root/src/monkey/ast/letStatement.ts";
import * as PrefixExpression from "#root/src/monkey/ast/prefixExpression.ts";
import * as Program from "#root/src/monkey/ast/program.ts";
import * as ReturnStatement from "#root/src/monkey/ast/returnStatement.ts";
import * as Statement from "#root/src/monkey/ast/statement.ts";
import * as Lexer from "#root/src/monkey/lexer/lexer.ts";
import * as Parser from "#root/src/monkey/parser/parser.ts";
import * as Token from "#root/src/monkey/token/token.ts";
import assert from "node:assert";
import { describe, it } from "node:test";
const testIntegerLiteral = (exp: Expression.t, value: number) => {
  assert.strictEqual(
    exp["tag"],
    "integerLiteral",
    `exp is not an Integer Literal. got=${exp["tag"]}`
  );
  const il = exp as IntegerLiteral.t;
  assert.strictEqual(
    il.value,
    value,
    `il.value is not '${value}'. got=${il.value}`
  );
  assert.strictEqual(
    IntegerLiteral.tokenLiteral(il),
    value.toString(),
    `il.tokenLiteral() is not '${value}'. got=${IntegerLiteral.tokenLiteral(
      il
    )}`
  );
};

const testIdentifier = (exp: Expression.t, value: string) => {
  assert.strictEqual(
    exp["tag"],
    "identifier",
    `exp is not an Identifier. got=${exp["tag"]}`
  );
  const ident = exp as Identifier.t;
  assert.strictEqual(
    ident.value,
    value,
    `ident.value is not '${value}'. got=${ident.value}`
  );
  assert.strictEqual(
    Identifier.tokenLiteral(ident),
    value,
    `ident.tokenLiteral() is not '${value}'. got=${Identifier.tokenLiteral(
      ident
    )}`
  );
};

const testBooleanLiteral = (exp: Expression.t, value: boolean) => {
  assert.strictEqual(
    exp["tag"],
    "booleanExpression",
    `exp is not an Boolean. got=${exp["tag"]}`
  );
  const bool = exp as BooleanExpression.t;
  assert.strictEqual(
    bool.value,
    value,
    `booleanExpression.value is not '${value}'. got=${bool.value}`
  );
  assert.strictEqual(
    BooleanExpression.tokenLiteral(bool),
    value.toString(),
    `booleanExpression.tokenLiteral() is not '${value}'. got=${BooleanExpression.tokenLiteral(
      bool
    )}`
  );
};

const testLiteralExpression = (
  exp: Expression.t,
  expected: string | number | boolean
) => {
  switch (exp["tag"]) {
    case "integerLiteral":
      assert.strictEqual(
        typeof expected,
        "number",
        `invalid expected value, got ${typeof expected}`
      );
      if (typeof expected === "number") {
        testIntegerLiteral(exp, expected);
      }
      break;
    case "identifier":
      assert.strictEqual(
        typeof expected,
        "string",
        `invalid expected value, got ${typeof expected}`
      );
      if (typeof expected === "string") {
        testIdentifier(exp, expected);
      }
      break;
    case "booleanExpression":
      assert.strictEqual(
        typeof expected,
        "boolean",
        `invalid expected value, got ${typeof expected}`
      );
      if (typeof expected === "boolean") {
        testBooleanLiteral(exp, expected);
      }
      break;
    default:
      assert.ok(false, `unknown expression type: ${exp["tag"]}`);
  }
};

const testInfixExpression = (
  exp: Expression.t,
  left: number | string | boolean,
  operator: string,
  right: number | string | boolean
) => {
  assert.strictEqual(
    exp["tag"],
    "infixExpression",
    `exp is not an InfixExpression. got=${exp["tag"]}`
  );
  const ie = exp as InfixExpression.t;
  testLiteralExpression(ie.left, left);
  assert.strictEqual(
    ie.operator,
    operator,
    `ie.operator is not '${operator}'. got=${ie.operator}`
  );
  testLiteralExpression(ie.right, right);
};

const testLetStatement = (s: Statement.t, name: string) => {
  assert.strictEqual(
    Statement.tokenLiteral(s),
    "let",
    `s.tokenLiteral is not 'let'. got=${Statement.tokenLiteral(s)}`
  );
  assert.strictEqual(
    s["tag"],
    "letStatement",
    `s is not a letStatement. got=${s["tag"]}`
  );
  const letStmt = s as LetStatement.t;
  assert.strictEqual(
    letStmt.name.value,
    name,
    `letStmt.name.value is not '${name}'. got=${letStmt.name.value}`
  );
  assert.strictEqual(
    Identifier.tokenLiteral(letStmt.name),
    name,
    `letStmt.name.tokenLiteral() is not '${name}'. got=${Identifier.tokenLiteral(
      letStmt.name
    )}`
  );
};

describe("parser", () => {
  it("TestLetStatements", () => {
    const tests = [
      {
        input: `let x = 5;`,
        expectedIdentifier: "x",
        expectedValue: 5,
      },
      {
        input: `let y = true;`,
        expectedIdentifier: "y",
        expectedValue: true,
      },
      {
        input: `let foobar = y;`,
        expectedIdentifier: "foobar",
        expectedValue: "y",
      },
    ];

    for (const tt of tests) {
      const l = Lexer.init(tt.input);
      const p = Parser.init(l);
      const program = Parser.parseProgram(p);
      assert.strictEqual(
        p.errors.length,
        0,
        `Parser.errors() returned ${p.errors.length} errors:\n${p.errors.join(
          "\n"
        )}`
      );
      assert.notStrictEqual(
        program,
        null,
        "Parser.parseProgram() returned null"
      );
      assert.strictEqual(
        program.statements.length,
        1,
        `program.statements does not contain 1 statements. got: ${program?.statements.length}`
      );
      testLetStatement(program.statements[0], tt.expectedIdentifier);
      const stmt = program.statements[0] as LetStatement.t;
      testLiteralExpression(stmt.value, tt.expectedValue);
    }
  });
  it("TestReturnStatements", () => {
    const tests = [
      {
        input: `return 5;`,
        expectedValue: 5,
      },
      {
        input: `return true;`,
        expectedValue: true,
      },
      {
        input: `return foobar;`,
        expectedValue: "foobar",
      },
    ];
    for (const tt of tests) {
      const l = Lexer.init(tt.input);
      const p = Parser.init(l);
      const program = Parser.parseProgram(p);
      assert.strictEqual(
        p.errors.length,
        0,
        `Parser.errors() returned ${p.errors.length} errors:\n${p.errors.join(
          "\n"
        )}`
      );
      assert.notStrictEqual(
        program,
        null,
        "Parser.parseProgram() returned null"
      );
      assert.strictEqual(
        program.statements.length,
        1,
        `program.statements does not contain 1 statements. got: ${program?.statements.length}`
      );
      const stmt = program.statements[0];
      assert.strictEqual(
        stmt["tag"],
        "returnStatement",
        `stmt.expression is not a ReturnStatement. got=${stmt["tag"]}`
      );
      const returnStmt = stmt as ReturnStatement.t;
      assert.strictEqual(
        Statement.tokenLiteral(returnStmt),
        "return",
        `Statement.tokenLiteral is not 'return'. got=${Statement.tokenLiteral(
          returnStmt
        )}`
      );
      testLiteralExpression(returnStmt.returnValue, tt.expectedValue);
    }
  });
  it("TestIdentifierExpression", () => {
    const input = "foobar;";
    const l = Lexer.init(input);
    const p = Parser.init(l);
    const program = Parser.parseProgram(p);
    assert.strictEqual(
      p.errors.length,
      0,
      `Parser.errors() returned ${p.errors.length} errors:\n${p.errors.join(
        "\n"
      )}`
    );
    assert.notStrictEqual(program, null, "Parser.parseProgram() returned null");
    assert.strictEqual(
      program.statements.length,
      1,
      `
      program.statements has not enough statements. got=${program.statements.length}`
    );

    assert.ok(
      program.statements[0].hasOwnProperty("expression"),
      `program.statements[0] is not an ExpressionStatement. got=${program.statements[0]}`
    );
    const exprStmt = program.statements[0] as ExpressionStatement.t;
    assert.strictEqual(
      exprStmt.expression.token.type,
      Token.IDENT,
      `exprStmt.expression.token is not 'IDENT'. got=${exprStmt.expression.token.type}`
    );
    const ident = exprStmt.expression as Identifier.t;
    assert.strictEqual(
      ident.value,
      "foobar",
      `ident.value is not 'foobar'. got=${ident.value}`
    );
    assert.strictEqual(
      Identifier.tokenLiteral(ident),
      "foobar",
      `ident.tokenLiteral() is not 'foobar'. got=${Identifier.tokenLiteral(
        ident
      )}`
    );
  });
  it("TestIntegerLiteralExpression", () => {
    const input = "5;";
    const l = Lexer.init(input);
    const p = Parser.init(l);
    const program = Parser.parseProgram(p);
    assert.strictEqual(
      p.errors.length,
      0,
      `Parser.errors() returned ${p.errors.length} errors:\n${p.errors.join(
        "\n"
      )}`
    );
    assert.notStrictEqual(program, null, "Parser.parseProgram() returned null");
    assert.strictEqual(
      program.statements.length,
      1,
      `
      program.statements has not enough statements. got=${program.statements.length}`
    );
    assert.ok(
      program.statements[0].hasOwnProperty("expression"),
      `program.statements[0] is not an ExpressionStatement. got=${program.statements[0]}`
    );
    const exprStmt = program.statements[0] as ExpressionStatement.t;
    assert.strictEqual(
      exprStmt.expression.token.type,
      Token.INT,
      `exprStmt.expression.token is not 'INT'. got=${exprStmt.expression.token.type}`
    );
    const literal = exprStmt.expression as IntegerLiteral.t;
    assert.strictEqual(
      literal.value,
      5,
      `literal.value is not '5'. got=${literal.value}`
    );
  });
  it("TestParsingPrefixExpressions", () => {
    const prefixTests = [
      {
        input: "!5;",
        operator: "!",
        value: 5,
      },
      {
        input: "-15;",
        operator: "-",
        value: 15,
      },
    ];
    for (const tt of prefixTests) {
      const l = Lexer.init(tt.input);
      const p = Parser.init(l);
      const program = Parser.parseProgram(p);
      assert.strictEqual(
        p.errors.length,
        0,
        `Parser.errors() returned ${p.errors.length} errors:\n${p.errors.join(
          "\n"
        )}`
      );
      assert.notStrictEqual(
        program,
        null,
        "Parser.parseProgram() returned null"
      );
      assert.strictEqual(
        program.statements.length,
        1,
        `
        program.statements does not contain 1 statement. got=${program.statements.length}`
      );
      assert.ok(
        program.statements[0].hasOwnProperty("expression"),
        `
      program.statements[0] is not an ExpressionStatement. got=${program.statements[0]}`
      );
      const exprStmt = program.statements[0] as ExpressionStatement.t;
      assert.strictEqual(
        exprStmt.expression["tag"],
        "prefixExpression",
        `exprStmt.expression is not a Prefix Expression. got=${exprStmt.expression}`
      );
      const exp = exprStmt.expression as PrefixExpression.t;
      assert.strictEqual(
        exp.operator,
        tt.operator,
        `exp.operator is not '${tt.operator}'. got=${exp.operator}`
      );
      assert.strictEqual(
        exp.right.token.type,
        Token.INT,
        `exp.right.token is not 'INT'. got=${exp.right.token.type}`
      );
      const intLiteral = exp.right as IntegerLiteral.t;
      assert.strictEqual(
        intLiteral.value,
        tt.value,
        `intLiteral.value is not '${tt.value}'. got=${intLiteral.value}`
      );
      assert.strictEqual(
        IntegerLiteral.tokenLiteral(intLiteral),
        tt.value.toString(),
        `intLiteral.tokenLiteral() is not '${
          tt.value
        }'. got=${IntegerLiteral.tokenLiteral(intLiteral)}`
      );
    }
  });
  it("TestParsingInfixExpressions", () => {
    const infixTests = [
      {
        input: "5 + 5;",
        leftValue: 5,
        operator: "+",
        rightValue: 5,
      },
      {
        input: "5 - 5;",
        leftValue: 5,
        operator: "-",
        rightValue: 5,
      },
      {
        input: "5 * 5;",
        leftValue: 5,
        operator: "*",
        rightValue: 5,
      },
      {
        input: "5 / 5;",
        leftValue: 5,
        operator: "/",
        rightValue: 5,
      },
      {
        input: "5 > 5;",
        leftValue: 5,
        operator: ">",
        rightValue: 5,
      },
      {
        input: "5 < 5;",
        leftValue: 5,
        operator: "<",
        rightValue: 5,
      },
      {
        input: "5 == 5;",
        leftValue: 5,
        operator: "==",
        rightValue: 5,
      },
      {
        input: "5 != 5;",
        leftValue: 5,
        operator: "!=",
        rightValue: 5,
      },
      {
        input: "true == true",
        leftValue: true,
        operator: "==",
        rightValue: true,
      },
      {
        input: "true != false",
        leftValue: true,
        operator: "!=",
        rightValue: false,
      },
      {
        input: "false == false",
        leftValue: false,
        operator: "==",
        rightValue: false,
      },
    ];
    for (const tt of infixTests) {
      const l = Lexer.init(tt.input);
      const p = Parser.init(l);
      const program = Parser.parseProgram(p);
      assert.strictEqual(
        p.errors.length,
        0,
        `Parser.errors() returned ${p.errors.length} errors:\n${p.errors.join(
          "\n"
        )}`
      );
      assert.notStrictEqual(
        program,
        null,
        "Parser.parseProgram() returned null"
      );
      assert.strictEqual(
        program.statements.length,
        1,
        `
        program.statements does not contain 1 statement. got=${program.statements.length}`
      );
      assert.ok(
        program.statements[0].hasOwnProperty("expression"),
        `
      program.statements[0] is not an ExpressionStatement. got=${program.statements[0]}`
      );
      const exprStmt = program.statements[0] as ExpressionStatement.t;
      testInfixExpression(
        exprStmt.expression,
        tt.leftValue,
        tt.operator,
        tt.rightValue
      );
    }
  });
  it("TestOperatorPrecedenceParsing", async () => {
    const tests = [
      {
        input: "-a * b",
        expected: "((-a) * b)",
      },
      {
        input: "!-a",
        expected: "(!(-a))",
      },
      {
        input: "a + b + c",
        expected: "((a + b) + c)",
      },
      {
        input: "a + b - c",
        expected: "((a + b) - c)",
      },
      {
        input: "a * b * c",
        expected: "((a * b) * c)",
      },
      {
        input: "a * b / c",
        expected: "((a * b) / c)",
      },
      {
        input: "a + b / c",
        expected: "(a + (b / c))",
      },
      {
        input: "a + b * c + d / e - f",
        expected: "(((a + (b * c)) + (d / e)) - f)",
      },
      {
        input: "3 + 4; -5 * 5",
        expected: "(3 + 4)((-5) * 5)",
      },
      {
        input: "5 > 4 == 3 < 4",
        expected: "((5 > 4) == (3 < 4))",
      },
      {
        input: "5 < 4 != 3 > 4",
        expected: "((5 < 4) != (3 > 4))",
      },
      {
        input: "3 + 4 * 5 == 3 * 1 + 4 * 5",
        expected: "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))",
      },
      {
        input: "true",
        expected: "true",
      },
      {
        input: "false",
        expected: "false",
      },
      {
        input: "3 > 5 == false",
        expected: "((3 > 5) == false)",
      },
      {
        input: "3 < 5 == true",
        expected: "((3 < 5) == true)",
      },
      {
        input: "1 + (2 + 3) + 4",
        expected: "((1 + (2 + 3)) + 4)",
      },
      {
        input: "(5 + 5) * 2",
        expected: "((5 + 5) * 2)",
      },
      {
        input: "2 / (5 + 5)",
        expected: "(2 / (5 + 5))",
      },
      {
        input: "-(5 + 5)",
        expected: "(-(5 + 5))",
      },
      {
        input: "!(true == true)",
        expected: "(!(true == true))",
      },
      {
        input: "a + add(b * c) + d",
        expected: "((a + add((b * c))) + d)",
      },
      {
        input: "add(a, b, 1, 2 * 3, 4 + 5, add(6, 7 * 8))",
        expected: "add(a, b, 1, (2 * 3), (4 + 5), add(6, (7 * 8)))",
      },
      {
        input: "add(a + b + c * d / f + g)",
        expected: "add((((a + b) + ((c * d) / f)) + g))",
      },
    ];

    for (const tt of tests) {
      const l = Lexer.init(tt.input);
      const p = Parser.init(l);
      const program = Parser.parseProgram(p);
      // console.log("program", JSON.stringify(program, null, 2));
      // console.dir(program, { depth: null });
      assert.strictEqual(
        p.errors.length,
        0,
        `Parser.errors() returned ${p.errors.length} errors:\n${p.errors.join(
          "\n"
        )}`
      );
      assert.strictEqual(
        await Program.string(program),
        tt.expected,
        `Parser.parseProgram() returned incorrect program. expected=${
          tt.expected
        }, got=${await Program.string(program)}`
      );
    }
  });
  it("TestBooleanExpression", async () => {
    const tests = [
      {
        input: "true;",
        expected: "true",
      },
      {
        input: "false;",
        expected: "false",
      },
    ];
    for (const tt of tests) {
      const l = Lexer.init(tt.input);
      const p = Parser.init(l);
      const program = Parser.parseProgram(p);
      assert.strictEqual(
        p.errors.length,
        0,
        `Parser.errors() returned ${p.errors.length} errors:\n${p.errors.join(
          "\n"
        )}`
      );
      assert.strictEqual(
        await Program.string(program),
        tt.expected,
        `Parser.parseProgram() returned incorrect program. expected=${
          tt.expected
        }, got=${await Program.string(program)}`
      );
    }
  });
  it("TestIfExpression", async () => {
    const input = "if (x < y) { x }";
    const l = Lexer.init(input);
    const p = Parser.init(l);
    const program = Parser.parseProgram(p);
    assert.strictEqual(
      p.errors.length,
      0,
      `Parser.errors() returned ${p.errors.length} errors:\n${p.errors.join(
        "\n"
      )}`
    );
    assert.strictEqual(
      program.statements[0]["tag"],
      "expressionStatement",
      `program.statements[0] is not an ExpressionStatement. got=${program.statements[0]["tag"]}`
    );
    const exp = program.statements[0] as ExpressionStatement.t;
    assert.strictEqual(
      exp.expression["tag"],
      "ifExpression",
      `exp.expression is not a If Expression. got=${exp.expression}`
    );
    const ie = exp.expression as IfExpression.t;
    testInfixExpression(ie.condition, "x", "<", "y");
    assert.strictEqual(
      ie.consequence.statements.length,
      1,
      `ie.consequence.statements.length is not 1. got=${ie.consequence.statements.length}`
    );
    assert.strictEqual(
      ie.consequence.statements[0]["tag"],
      "expressionStatement",
      `ie.consequence.statements[0] is not an ExpressionStatement. got=${ie.consequence.statements[0]}`
    );
    testIdentifier(ie.consequence.statements[0].expression, "x");
    assert.strictEqual(
      ie.alternative,
      undefined,
      `ie.alternative is not null. got=${ie.alternative}`
    );
  });
  it("TestIfElseExpression", async () => {
    const input = "if (x < y) { x } else { y }";
    const l = Lexer.init(input);
    const p = Parser.init(l);
    const program = Parser.parseProgram(p);
    assert.strictEqual(
      p.errors.length,
      0,
      `Parser.errors() returned ${p.errors.length} errors:\n${p.errors.join(
        "\n"
      )}`
    );
    assert.strictEqual(
      program.statements[0]["tag"],
      "expressionStatement",
      `program.statements[0] is not an ExpressionStatement. got=${program.statements[0].tag}`
    );
    const exp = program.statements[0] as ExpressionStatement.t;
    assert.strictEqual(
      exp.expression["tag"],
      "ifExpression",
      `exp.expression is not a If Expression. got=${exp.expression}`
    );
    const ie = exp.expression as IfExpression.t;
    testInfixExpression(ie.condition, "x", "<", "y");
    assert.strictEqual(
      ie.consequence.statements.length,
      1,
      `ie.consequence.statements.length is not 1. got=${ie.consequence.statements.length}`
    );
    assert.strictEqual(
      ie.consequence.statements[0]["tag"],
      "expressionStatement",
      `ie.consequence.statements[0] is not an ExpressionStatement. got=${ie.consequence.statements[0]}`
    );
    testIdentifier(ie.consequence.statements[0].expression, "x");
    assert.strictEqual(
      ie.alternative?.statements.length,
      1,
      `ie.alternative.statements.length is not 1. got=${ie.alternative?.statements.length}`
    );
    assert.strictEqual(
      ie.alternative.statements[0]["tag"],
      "expressionStatement",
      `ie.alternative.statements[0] is not an ExpressionStatement. got=${ie.alternative.statements[0]}`
    );
    testIdentifier(ie.alternative.statements[0].expression, "y");
  });
  it("TestFunctionLiteralParsing", async () => {
    const input = "fn(x, y) { x + y; }";
    const l = Lexer.init(input);
    const p = Parser.init(l);
    const program = Parser.parseProgram(p);
    assert.strictEqual(
      p.errors.length,
      0,
      `Parser.errors() returned ${p.errors.length} errors:\n${p.errors.join(
        "\n"
      )}`
    );
    assert.strictEqual(
      program.statements.length,
      1,
      `program.statements does not contain 1 statements. got=${program.statements.length}`
    );
    assert.strictEqual(
      program.statements[0]["tag"],
      "expressionStatement",
      `program.statements[0] is not an ExpressionStatement. got=${program.statements[0]["tag"]}`
    );
    const exp = program.statements[0] as ExpressionStatement.t;
    assert.strictEqual(
      exp.expression["tag"],
      "functionLiteral",
      `exp.expression is not a FunctionLiteral. got=${exp.expression}`
    );
    const fl = exp.expression as FunctionLiteral.t;
    assert.strictEqual(
      fl.parameters.length,
      2,
      `fl.parameters.length is not 2. got=${fl.parameters.length}`
    );
    testLiteralExpression(fl.parameters[0], "x");
    testLiteralExpression(fl.parameters[1], "y");
    assert.strictEqual(
      fl.body.statements.length,
      1,
      `fn.body.statements.length is not 1. got=${fl.body.statements.length}`
    );
    assert.strictEqual(
      fl.body.statements[0]["tag"],
      "expressionStatement",
      `fn.body.statements[0] is not an ExpressionStatement. got=${fl.body.statements[0]}`
    );
    testInfixExpression(fl.body.statements[0].expression, "x", "+", "y");
  });
  it("TestFunctionParameterParsing", () => {
    const tests = [
      {
        input: "fn() {}",
        expectedParams: [],
      },
      {
        input: "fn(x) {}",
        expectedParams: ["x"],
      },
      {
        input: "fn(x, y, z) {}",
        expectedParams: ["x", "y", "z"],
      },
    ];
    for (const tt of tests) {
      const l = Lexer.init(tt.input);
      const p = Parser.init(l);
      const program = Parser.parseProgram(p);
      assert.strictEqual(
        p.errors.length,
        0,
        `Parser.errors() returned ${p.errors.length} errors:\n${p.errors.join(
          "\n"
        )}`
      );
      const stmt = program.statements[0] as ExpressionStatement.t;
      assert.strictEqual(
        stmt.expression["tag"],
        "functionLiteral",
        `stmt.expression is not a FunctionLiteral. got=${stmt.expression}`
      );
      const fl = stmt.expression as FunctionLiteral.t;
      assert.strictEqual(
        fl.parameters.length,
        tt.expectedParams.length,
        `fl.parameters.length is not ${tt.expectedParams.length}. got=${fl.parameters.length}`
      );
      for (const [i, ident] of tt.expectedParams.entries()) {
        testLiteralExpression(fl.parameters[i], ident);
      }
    }
  });
  it("TestCallExpressionParsing", () => {
    const input = "add(1, 2 * 3, 4 + 5);";
    const l = Lexer.init(input);
    const p = Parser.init(l);
    const program = Parser.parseProgram(p);
    assert.strictEqual(
      p.errors.length,
      0,
      `Parser.errors() returned ${p.errors.length} errors:\n${p.errors.join(
        "\n"
      )}`
    );
    assert.strictEqual(
      program.statements.length,
      1,
      `program.statements does not contain 1 statements. got=${program.statements.length}`
    );
    assert.strictEqual(
      program.statements[0]["tag"],
      "expressionStatement",
      `program.statements[0] is not an ExpressionStatement. got=${program.statements[0]["tag"]}`
    );
    const exp = program.statements[0] as ExpressionStatement.t;
    assert.strictEqual(
      exp.expression["tag"],
      "callExpression",
      `exp.expression is not a CallExpression. got=${exp.expression}`
    );
    const ce = exp.expression as CallExpression.t;
    testIdentifier(ce.function, "add");
    assert.strictEqual(
      ce.arguments.length,
      3,
      `ce.arguments.length is not 3. got=${ce.arguments.length}`
    );
    testLiteralExpression(ce.arguments[0], 1);
    testInfixExpression(ce.arguments[1], 2, "*", 3);
    testInfixExpression(ce.arguments[2], 4, "+", 5);
  });
});
