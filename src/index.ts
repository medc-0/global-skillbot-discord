import { Client, GatewayIntentBits, REST, Routes, Collection } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Commands
const commands: any[] = []
const commandFiles = fs.readdirSync(path.join(__dirname, "commands"))

for (const file of commandFiles) {
    const { command, execute } = await import(`./commands/${file}`);
    commands.push(command.toJSON());
    (client as any).commands = (client as any).commands || new Collection();
    (client as any).commands.set(command.name, execute);
}

// bot logic
client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}.`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const execute = (client as any).commands.get(interaction.commandName);
    if (execute) await execute(interaction);
});

// Register commands
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);
await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
    body: commands,
});

client.login(process.env.TOKEN);