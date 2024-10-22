import * as lexer from "#root/src/monkey/lexer/lexer.ts";
import * as token from "#root/src/monkey/token/token.ts";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("token", () => {
  it("Can read tokens", () => {
    const input = "=+(){},;";

    const tests: Array<{
      expectedType: token.TokenType;
      expectedLiteral: string;
    }> = [
      { expectedType: token.ASSIGN, expectedLiteral: "=" },
      { expectedType: token.PLUS, expectedLiteral: "+" },
      { expectedType: token.LPAREN, expectedLiteral: "(" },
      { expectedType: token.RPAREN, expectedLiteral: ")" },
      { expectedType: token.LBRACE, expectedLiteral: "{" },
      { expectedType: token.RBRACE, expectedLiteral: "}" },
      { expectedType: token.COMMA, expectedLiteral: "," },
      { expectedType: token.SEMICOLON, expectedLiteral: ";" },
      { expectedType: token.EOF, expectedLiteral: "" },
    ];

    const l = lexer.init(input);

    for (const [i, tt] of tests.entries()) {
      const tok = lexer.nextToken(l);
      assert.strictEqual(
        tok.type,
        tt.expectedType,
        `tests[${i}] - tokentype wrong, expected: ${tt.expectedType}, got: ${tok.type}`
      );
      assert.strictEqual(
        tok.literal,
        tt.expectedLiteral,
        `tests[${i}] - literal wrong, expected: ${tt.expectedLiteral}, got: ${tok.literal}`
      );
    }
  });
});
