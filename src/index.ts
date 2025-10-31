import { config } from "dotenv";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from 'url';
import { Client, Collection, GatewayIntentBits, REST, Routes } from "discord.js";

// Initialize environment variables
config();

// ES Module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate environment variables
const requiredEnvVars = ['DISCORD_TOKEN', 'CLIENT_ID', 'GUILD_ID'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Create client instance with proper typing
class SkillBot extends Client {
  commands: Collection<string, any>;
  constructor() {
    super({ intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ] });
    this.commands = new Collection();
  }
}

const client = new SkillBot();

// Set up commands
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".ts") || f.endsWith(".js"));

const commands: any[] = [];

// Load commands
for (const file of commandFiles) {
  try {
    const filePath = path.join(commandsPath, file);
    const fileUrl = new URL(`file:///${filePath.replace(/\\/g, '/')}`);
    const command = await import(fileUrl.href);

    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
      console.log(`Loaded command: ${command.data.name}`);
    } else {
      console.warn(`Command at ${filePath} is missing required properties`);
    }
  } catch (error) {
    console.error(`Error loading command from ${file}:`, error);
  }
}

// Register slash commands
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log('Started refreshing slash commands...');

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: commands }
  );

  console.log('Successfully registered slash commands!');
} catch (error) {
  console.error('Error registering slash commands:', error);
}

// Event handlers
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}:`, error);

    const errorMessage = {
      content: 'There was an error executing this command!',
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

// Message-based aliases for convenience
client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  const content = message.content.trim();
  if (content.toLowerCase().startsWith("!help")) {
    const cmd = client.commands.get("help");
    if (cmd) {
      await cmd.execute({
        ...({} as any),
        reply: (options: any) => message.reply(options),
        user: message.author
      });
    }
    return;
  }

  if (content.toLowerCase().startsWith("!topics")) {
    const cmd = client.commands.get("topics");
    if (cmd) {
      await cmd.execute({
        ...({} as any),
        reply: (text: string) => message.reply(text),
        user: message.author
      });
    }
    return;
  }

  if (content.toLowerCase().startsWith("!learn")) {
    const parts = content.split(/\s+/);
    const topic = parts.slice(1).join(" ").toLowerCase();
    if (!topic) {
      await message.reply("Usage: !learn <topic>");
      return;
    }
    const cmd = client.commands.get("learn");
    if (cmd) {
      await cmd.execute({
        ...({} as any),
        options: { getString: () => topic },
        reply: (text: string | any) => message.reply(text),
        user: message.author
      });
    }
    return;
  }

  if (content.toLowerCase().startsWith("!teach")) {
    const rest = content.slice("!teach".length).trim();
    const sepIndex = rest.indexOf("|");
    if (sepIndex === -1) {
      await message.reply("Usage: !teach <topic> | <content>");
      return;
    }
    const topic = rest.slice(0, sepIndex).trim().toLowerCase();
    const contentText = rest.slice(sepIndex + 1).trim();
    if (!topic || !contentText) {
      await message.reply("Usage: !teach <topic> | <content>");
      return;
    }
    const cmd = client.commands.get("teach");
    if (cmd) {
      await cmd.execute({
        ...({} as any),
        options: { getString: (name: string) => (name === "topic" ? topic : contentText) },
        reply: (text: string | any) => message.reply(text),
        user: message.author
      });
    }
  }
});

// Ready event
client.once("ready", () => {
  console.log(`
╔══════════════════════════════════════╗
║             SkillBot                 ║
╠══════════════════════════════════════╣
║ Bot is Online!                       ║
║ Logged in as: ${client.user?.tag}    ║
║ Commands Loaded: ${client.commands.size}              ║
╚══════════════════════════════════════╝
  `);
});

// Error handling
client.on("error", (error) => {
  console.error("Client error:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

// Login
try {
  await client.login(process.env.DISCORD_TOKEN);
} catch (error) {
  console.error("Failed to log in:", error);
  process.exit(1);
}
