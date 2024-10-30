import * as Lexer from "#root/src/monkey/lexer/lexer.ts";
import assert from "node:assert";
import { describe, it } from "node:test";
// import * as Ast from "#root/src/monkey/ast/ast.ts";
import * as ExpressionStatement from "#root/src/monkey/ast/expressionStatement.ts";
import * as Identifier from "#root/src/monkey/ast/identifier.ts";
import * as IntegerLiteral from "#root/src/monkey/ast/integerLiteral.ts";
import * as LetStatement from "#root/src/monkey/ast/letStatement.ts";
import * as Statement from "#root/src/monkey/ast/statement.ts";
import * as Parser from "#root/src/monkey/parser/parser.ts";
import * as Token from "#root/src/monkey/token/token.ts";

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
});
