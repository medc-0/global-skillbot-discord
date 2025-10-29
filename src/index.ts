import "dotenv/config";
import fs from "fs-extra";
import path from "path";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { REST, Routes } from "discord.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
(client as any).commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"));

const commands: any[] = [];

for (const file of commandFiles) {
  const command = await import(path.join(commandsPath, file));
  (client as any).commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

try {
  console.log("Registering slash commands...");
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
    { body: commands }
  );
  console.log("Slash commands registered successfully.");
} catch (err) {
  console.error("Error registering commands:", err);
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = (client as any).commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: "An error occurred.", ephemeral: true });
  }
});

client.once("ready", () => {
  console.log(`SkillBot is online as ${client.user?.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
