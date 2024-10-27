// import * as Ast from "#root/src/monkey/ast/ast.ts";
import * as LetStatement from "#root/src/monkey/ast/letStatement.ts";
import * as Program from "#root/src/monkey/ast/program.ts";
import * as Statement from "#root/src/monkey/ast/statement.ts";
import * as Lexer from "#root/src/monkey/lexer/lexer.ts";
import * as Token from "#root/src/monkey/token/token.ts";

export interface t {
  l: Lexer.t;
  curToken: Token.t;
  peekToken: Token.t;
}

export const init = (l: Lexer.t): t => {
  const p: t = {
    l: l,
    curToken: Lexer.nextToken(l),
    peekToken: Lexer.nextToken(l),
  };
  return p;
};

export const nextToken = (p: t): void => {
  p.curToken = p.peekToken;
  p.peekToken = Lexer.nextToken(p.l);
};

const curTokenIs = (p: t, tokenType: Token.TokenType): boolean => {
  return p.curToken.type === tokenType;
};

const peekTokenIs = (p: t, tokenType: Token.TokenType): boolean => {
  return p.peekToken.type === tokenType;
};

const expectedPeek = (p: t, tokenType: Token.TokenType): boolean => {
  if (peekTokenIs(p, tokenType)) {
    nextToken(p);
    return true;
  } else {
    return false;
  }
};

const parseLetStatement = (p: t): LetStatement.t | null => {
  let stmt: LetStatement.t = {
    token: p.curToken,
    name: {
      token: p.curToken,
      value: p.curToken.literal,
    },
  };
  if (!expectedPeek(p, Token.IDENT)) {
    return null;
  }
  stmt.name = {
    token: p.curToken,
    value: p.curToken.literal,
  };
  if (!expectedPeek(p, Token.ASSIGN)) {
    return null;
  }
  while (!curTokenIs(p, Token.SEMICOLON)) {
    nextToken(p);
  }
  return stmt;
};

const parseStatement = (p: t): Statement.t | null => {
  switch (p.curToken.type) {
    case Token.LET:
      return parseLetStatement(p);
    default:
      return null;
  }
};

export const parseProgram = (p: t): Program.t => {
  const program: Program.t = {
    statements: [],
  };
  while (p.curToken.type !== Token.EOF) {
    const stmt = parseStatement(p);
    if (stmt) {
      program.statements.push(stmt);
    }
    nextToken(p);
  }
  return program;
};
