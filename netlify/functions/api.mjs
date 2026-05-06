// netlify/functions/api.mjs
import serverless from "serverless-http";
import { createApp } from "../../src/app.js";
import { connectDatabase } from "../../src/config/database.js";
import { validateEnv } from "../../src/config/env.js";

let cachedHandler;

async function getHandler() {
  if (!cachedHandler) {
    validateEnv();
    await connectDatabase();
    cachedHandler = serverless(createApp());
  }

  return cachedHandler;
}

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const expressHandler = await getHandler();
  return expressHandler(event, context);
};
