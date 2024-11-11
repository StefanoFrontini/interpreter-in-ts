import * as Lexer from "#root/src/monkey/lexer/lexer.ts";
import assert from "node:assert";
import { describe, it } from "node:test";
// import * as Ast from "#root/src/monkey/ast/ast.ts";
import * as BooleanExpression from "#root/src/monkey/ast/booleanExpression.ts";
import * as Expression from "#root/src/monkey/ast/expression.ts";
import * as ExpressionStatement from "#root/src/monkey/ast/expressionStatement.ts";
import * as Identifier from "#root/src/monkey/ast/identifier.ts";
import * as InfixExpression from "#root/src/monkey/ast/infixExpression.ts";
import * as IntegerLiteral from "#root/src/monkey/ast/integerLiteral.ts";
import * as LetStatement from "#root/src/monkey/ast/letStatement.ts";
import * as PrefixExpression from "#root/src/monkey/ast/prefixExpression.ts";
import * as Program from "#root/src/monkey/ast/program.ts";
import * as Statement from "#root/src/monkey/ast/statement.ts";
import * as Parser from "#root/src/monkey/parser/parser.ts";
import * as Token from "#root/src/monkey/token/token.ts";

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

describe("parser", () => {
  it("TestLetStatements", () => {
    const input = `
        let x = 5;
        let y = 10;
        let foobar = 838383;
        `;
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
      program?.statements.length,
      3,
      `program.statements does not contain 3 statements. got: ${program?.statements.length}`
    );

    const tests: Array<{ expectedIdentifier: string }> = [
      { expectedIdentifier: "x" },
      { expectedIdentifier: "y" },
      { expectedIdentifier: "foobar" },
    ];

    for (const [i, tt] of tests.entries()) {
      const stmt = program.statements[i];
      assert.strictEqual(
        Statement.tokenLiteral(stmt),
        "let",
        `Statement.tokenLiteral is not 'let'. got=${Statement.tokenLiteral(
          stmt
        )}`
      );
      let letStmt = stmt as LetStatement.t;

      assert.notStrictEqual(
        letStmt.name,
        undefined,
        `letStmt.name is not defined. got=${letStmt.name}`
      );

      assert.strictEqual(
        letStmt.name.value,
        tt.expectedIdentifier,
        `letStmt.name.value is not '${tt.expectedIdentifier}'. got=${letStmt.name.value}`
      );
      assert.strictEqual(
        Identifier.tokenLiteral(letStmt.name),
        tt.expectedIdentifier,
        `letStmt.name.value is not '${tt.expectedIdentifier}'. got=${letStmt.name.value}`
      );
    }
  });
  it("TestReturnStatements", () => {
    const input = `
        return 5;
        return 10;
        return 993322;
        `;
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
      3,
      `
      program.statements does not contain 3 statements. got=${program.statements.length}`
    );

    for (const stmt of program.statements) {
      assert.strictEqual(
        Statement.tokenLiteral(stmt),
        "return",
        `Statement.tokenLiteral is not 'return'. got=${Statement.tokenLiteral(
          stmt
        )}`
      );
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
    // const isExpressionStatement = (
    //   s: Statement.t
    // ): s is ExpressionStatement.t => s.hasOwnProperty("expression");

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
});
