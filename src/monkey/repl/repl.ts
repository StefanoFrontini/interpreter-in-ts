import * as Lexer from "#root/src/monkey/lexer/lexer.ts";
// import * as Token from "#root/src/monkey/token/token.ts";
import * as Evaluator from "#root/src/monkey/evaluator/evaluator.ts";
import * as Environment from "#root/src/monkey/object/environment.ts";
import * as Obj from "#root/src/monkey/object/obj.ts";
import * as Parser from "#root/src/monkey/parser/parser.ts";
import { stdin as input, stdout as output } from "node:process";
import * as readline from "node:readline/promises";

const rl = readline.createInterface({ input, output });
const PROMPT = ">> ";

const printParserErrors = (errors: string[]): void => {
  for (const msg of errors) {
    console.error("parser errors: ", msg);
  }
};

export const start = async (): Promise<void> => {
  const env = Environment.newEnvironment();
  while (true) {
    const line = await rl.question(PROMPT);
    const l = Lexer.init(line);
    const p = Parser.init(l);
    const program = Parser.parseProgram(p);
    // console.dir(program, { depth: null });
    if (p.errors.length !== 0) {
      printParserErrors(p.errors);
      continue;
    }
    const evaluated = Evaluator.evalNode(program, env);
    if (evaluated) {
      console.log(Obj.inspect(evaluated));
    }
    // console.log(await Program.string(program));
    // let tok = Lexer.nextToken(l);
    // while (tok.type !== Token.EOF) {
    //   console.log(tok);
    //   tok = Lexer.nextToken(l);
    // }
    // rl.close();
  }
};
