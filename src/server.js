import { connectDatabase } from "./config/database.js";
import { env, validateEnv } from "./config/env.js";
import { createApp } from "./app.js";

validateEnv();
await connectDatabase();

const app = createApp();

app.listen(env.port, () => {
  console.log(`${env.appName} API listening on http://localhost:${env.port}`);
});
