# DWACN (DiscordBot without a cool name)

This library is a small library that adds some extra fun to your Discord server. The server adds more commands for minigames, memes and currency for uses to maintain (a full list of features and command coming soon™).

The bot is written using `TypeScript` and the `Discord.JS` library.

## Requirements

-   An editor with TypeScript support ([Visual Studio Code](https://code.visualstudio.com/)) is recommended.
-   [Yarn](https://classic.yarnpkg.com/en/docs/install/)
-   [Node](https://nodejs.org/en/download/) (preferably V10)

## Installation

1. Open the project and install all dependencies using: `yarn`
2. Copy the `.env-example` file in the root of the project and rename it to `.env`. Fill the requested data.

-   **_DISCORD_API_KEY_**: This is the token that gives access the Discord API. You can fill it if you already have one, or [request one using this guide]().

3. Run `yarn dev` to start a development server. the terminal logs: `Logged in as NAME_OF_YOUR_BOT!` and you see that your bot is online in your server (can take a minute).

## Pull requests
Pull requests are required to add a new feature or bug fix to the bot. The project is using `Eslint` and `Prettier` to enforce a codestyle and these tests are required to merge to the `master` branch.