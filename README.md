# FFXIV Discord Status Bot
TL;DR I got so bored waiting for Character Creation restriction to drop on a server I wanted to play on. I made a discord bot to check when it would be free lol.

Gets realtime world status scraped directly from <a href="https://na.finalfantasyxiv.com/lodestone/worldstatus/"></a> using <a href="https://github.com/hydrabolt/discord.js/">discord.js</a> as the Discord client.

# Commands:
`!status [query]` => returns a status information of a World or Server. Example: `!status balmung`

# Config
- `token` - The Discord Bot token
- `prefix` - The command prefix to use
- `defaultWorld` - The default world to show when the status command is invoked
- `deleteInvoke` - Deletes invoked message

# Installation
Requires NodeJS: https://nodejs.org/en/download/

Once you have NodeJS installed, running `npm install` from the bot directory should install all required packages then `node index.js` to run the bot
