import * as Lexer from "#root/src/monkey/lexer/lexer.ts";
import assert from "node:assert";
import { describe, it } from "node:test";
// import * as Ast from "#root/src/monkey/ast/ast.ts";
import * as Statement from "#root/src/monkey/ast/statement.ts";
import * as Parser from "#root/src/monkey/parser/parser.ts";
// import * as LetStatement from "#root/src/monkey/ast/letStatement.ts";
import * as Identifier from "#root/src/monkey/ast/identifier.ts";

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
      assert.notStrictEqual(
        stmt.name,
        undefined,
        `letStmt.name is not defined. got=${stmt.name}`
      );

      assert.strictEqual(
        stmt.name.value,
        tt.expectedIdentifier,
        `letStmt.name.value is not '${tt.expectedIdentifier}'. got=${stmt.name.value}`
      );
      assert.strictEqual(
        Identifier.tokenLiteral(stmt.name),
        tt.expectedIdentifier,
        `stmt.name.value is not '${tt.expectedIdentifier}'. got=${stmt.name.value}`
      );
    }
  });
});
