import { env } from "../../environment";

/**
 * Constant with the alias for every single command
 */
export const COMMAND_PREFIX = "?";
export const KARMA_REACTIONS = ["👎", "👍", "upvote", "downvote"];
export const BOT_OWNER_ID = process.env.BOT_OWNER_ID || env.BOT_OWNER_ID;
