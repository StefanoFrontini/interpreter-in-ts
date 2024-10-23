import * as Lexer from "#root/src/monkey/lexer/lexer.ts";
import * as Token from "#root/src/monkey/token/token.ts";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("lexer", () => {
  it("TestNextToken", () => {
    const input = `let five = 5;
    let ten = 10;

    let add = fn(x, y) {
      x + y;
    };

    let result = add(five, ten);
    !-/*5;
    5 < 10 > 5;
    `;

    const tests: Array<{
      expectedType: Token.TokenType;
      expectedLiteral: string;
    }> = [
      { expectedType: Token.LET, expectedLiteral: "let" },
      { expectedType: Token.IDENT, expectedLiteral: "five" },
      { expectedType: Token.ASSIGN, expectedLiteral: "=" },
      { expectedType: Token.INT, expectedLiteral: "5" },
      { expectedType: Token.SEMICOLON, expectedLiteral: ";" },
      { expectedType: Token.LET, expectedLiteral: "let" },
      { expectedType: Token.IDENT, expectedLiteral: "ten" },
      { expectedType: Token.ASSIGN, expectedLiteral: "=" },
      { expectedType: Token.INT, expectedLiteral: "10" },
      { expectedType: Token.SEMICOLON, expectedLiteral: ";" },
      { expectedType: Token.LET, expectedLiteral: "let" },
      { expectedType: Token.IDENT, expectedLiteral: "add" },
      { expectedType: Token.ASSIGN, expectedLiteral: "=" },
      { expectedType: Token.FUNCTION, expectedLiteral: "fn" },
      { expectedType: Token.LPAREN, expectedLiteral: "(" },
      { expectedType: Token.IDENT, expectedLiteral: "x" },
      { expectedType: Token.COMMA, expectedLiteral: "," },
      { expectedType: Token.IDENT, expectedLiteral: "y" },
      { expectedType: Token.RPAREN, expectedLiteral: ")" },
      { expectedType: Token.LBRACE, expectedLiteral: "{" },
      { expectedType: Token.IDENT, expectedLiteral: "x" },
      { expectedType: Token.PLUS, expectedLiteral: "+" },
      { expectedType: Token.IDENT, expectedLiteral: "y" },
      { expectedType: Token.SEMICOLON, expectedLiteral: ";" },
      { expectedType: Token.RBRACE, expectedLiteral: "}" },
      { expectedType: Token.SEMICOLON, expectedLiteral: ";" },
      { expectedType: Token.LET, expectedLiteral: "let" },
      { expectedType: Token.IDENT, expectedLiteral: "result" },
      { expectedType: Token.ASSIGN, expectedLiteral: "=" },
      { expectedType: Token.IDENT, expectedLiteral: "add" },
      { expectedType: Token.LPAREN, expectedLiteral: "(" },
      { expectedType: Token.IDENT, expectedLiteral: "five" },
      { expectedType: Token.COMMA, expectedLiteral: "," },
      { expectedType: Token.IDENT, expectedLiteral: "ten" },
      { expectedType: Token.RPAREN, expectedLiteral: ")" },
      { expectedType: Token.SEMICOLON, expectedLiteral: ";" },
      { expectedType: Token.BANG, expectedLiteral: "!" },
      { expectedType: Token.MINUS, expectedLiteral: "-" },
      { expectedType: Token.SLASH, expectedLiteral: "/" },
      { expectedType: Token.ASTERISK, expectedLiteral: "*" },
      { expectedType: Token.INT, expectedLiteral: "5" },
      { expectedType: Token.SEMICOLON, expectedLiteral: ";" },
      { expectedType: Token.INT, expectedLiteral: "5" },
      { expectedType: Token.LT, expectedLiteral: "<" },
      { expectedType: Token.INT, expectedLiteral: "10" },
      { expectedType: Token.GT, expectedLiteral: ">" },
      { expectedType: Token.INT, expectedLiteral: "5" },
      { expectedType: Token.SEMICOLON, expectedLiteral: ";" },
      { expectedType: Token.EOF, expectedLiteral: "" },
    ];

    const l = Lexer.init(input);

    for (const [i, tt] of tests.entries()) {
      const tok = Lexer.nextToken(l);
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
