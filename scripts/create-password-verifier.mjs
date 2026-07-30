import { pbkdf2Sync, randomBytes } from "node:crypto";

const password = process.argv[2];
if (!password) {
  console.error("Usage: npm run password -- \"your signal password\"");
  process.exit(1);
}

const iterations = 310_000;
const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256");

console.log(JSON.stringify({
  salt: salt.toString("base64"),
  hash: hash.toString("base64"),
  iterations,
}, null, 2));
