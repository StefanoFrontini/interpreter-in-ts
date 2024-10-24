import * as Repl from "#root/src/monkey/repl/repl.ts";
import * as os from "node:os";

const username = os.userInfo().username;
console.log(`Hello ${username}! This is the Monkey programming language!`);
console.log("Feel free to type in commands");
await Repl.start();
