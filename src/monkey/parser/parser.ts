// import * as Ast from "#root/src/monkey/ast/ast.ts";
import * as Expression from "#root/src/monkey/ast/expression.ts";
import * as ExpressionStatement from "#root/src/monkey/ast/expressionStatement.ts";
import * as IntegerLiteral from "#root/src/monkey/ast/integerLiteral.ts";
import * as LetStatement from "#root/src/monkey/ast/letStatement.ts";
import * as Program from "#root/src/monkey/ast/program.ts";
import * as ReturnStatement from "#root/src/monkey/ast/returnStatement.ts";
import * as Statement from "#root/src/monkey/ast/statement.ts";
import * as Lexer from "#root/src/monkey/lexer/lexer.ts";
import * as Token from "#root/src/monkey/token/token.ts";

const LOWEST = 1,
  EQUALS = 2,
  LESSGREATER = 3,
  SUM = 4,
  PRODUCT = 5,
  PREFIX = 6,
  CALL = 7;

export interface t {
  l: Lexer.t;
  curToken: Token.t;
  peekToken: Token.t;
  errors: string[];
  prefixParseFns: Map<Token.TokenType, (p: t) => Expression.t>;
  infixParseFns: Map<Token.TokenType, (p: t) => Expression.t>;
}

const registerPrefix = (
  p: t,
  tokenType: Token.TokenType,
  fn: (p: t) => Expression.t
): void => {
  p.prefixParseFns.set(tokenType, fn);
};
const registerInfix = (
  p: t,
  tokenType: Token.TokenType,
  fn: (p: t) => Expression.t
): void => {
  p.infixParseFns.set(tokenType, fn);
};
const errors = (p: t): string[] => p.errors;

export const peekError = (p: t, tokenType: Token.TokenType): void => {
  const msg = `expected next token to be ${tokenType}, got ${p.peekToken.type} instead`;
  p.errors.push(msg);
};

const parseIntegerLiteral = (p: t): Expression.t => {
  const lit: IntegerLiteral.t = {
    token: p.curToken,
    value: Number(p.curToken.literal),
  };
  return lit;
};

const parseIdentifier = (p: t): Expression.t => {
  return {
    token: p.curToken,
    value: p.curToken.literal,
  };
};

export const init = (l: Lexer.t): t => {
  const p: t = {
    l: l,
    curToken: Lexer.nextToken(l),
    peekToken: Lexer.nextToken(l),
    errors: [],
    prefixParseFns: new Map<Token.TokenType, (p: t) => Expression.t>(),
    infixParseFns: new Map<Token.TokenType, (p: t) => Expression.t>(),
  };
  registerPrefix(p, Token.IDENT, parseIdentifier);
  registerPrefix(p, Token.INT, parseIntegerLiteral);
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
    peekError(p, tokenType);
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
    value: {
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

const parseReturnStatement = (p: t): ReturnStatement.t | null => {
  const stmt: ReturnStatement.t = {
    token: p.curToken,
    returnValue: {
      token: p.curToken,
      value: p.curToken.literal,
    },
  };
  nextToken(p);
  while (!curTokenIs(p, Token.SEMICOLON)) {
    nextToken(p);
  }
  return stmt;
};

const parseExpression = (p: t, precedence: number): Expression.t | null => {
  const prefix = p.prefixParseFns.get(p.curToken.type);
  if (!prefix) return null;
  const leftExp = prefix(p);
  // while (
  //   !curTokenIs(p, Token.SEMICOLON) &&
  //   precedence < peekPrecedence(p)
  // ) {
  //   const infix = infixParseFns.get(p.peekToken.type);
  //   if (infix) {
  //     nextToken(p);
  //     leftExp = infix(p);
  //   }
  // }
  return leftExp;
};

const parseExpressionStatement = (p: t): ExpressionStatement.t => {
  const stmt: ExpressionStatement.t = {
    token: p.curToken,
    expression: parseExpression(p, LOWEST),
  };
  if (peekTokenIs(p, Token.SEMICOLON)) {
    nextToken(p);
  }
  return stmt;
};

const parseStatement = (p: t): Statement.t | null => {
  switch (p.curToken.type) {
    case Token.LET:
      return parseLetStatement(p);
    case Token.RETURN:
      return parseReturnStatement(p);
    default:
      return parseExpressionStatement(p);
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
