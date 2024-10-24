import * as Lexer from "#root/src/monkey/lexer/lexer.ts";
import * as Token from "#root/src/monkey/token/token.ts";
import { stdin as input, stdout as output } from "node:process";
import * as readline from "node:readline/promises";

const rl = readline.createInterface({ input, output });
const PROMPT = ">> ";

export const start = async (): Promise<void> => {
  while (true) {
    const line = await rl.question(PROMPT);
    const l = Lexer.init(line);
    let tok = Lexer.nextToken(l);
    while (tok.type !== Token.EOF) {
      console.log(tok);
      tok = Lexer.nextToken(l);
    }
    // rl.close();
  }
};
