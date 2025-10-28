import { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const token: any = process.env.DISCORD_TOKEN;
const clientId: string = "1432851942601916617" // from discord developer portal

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Commands
const commands = [
    new SlashCommandBuilder()
        .setName("learn")
        .setDescription("Start learning a new Topic")
        .addStringOption(opt =>
            opt.setName("topic").setDescription("Topic to learn?").setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName("xp")
        .setDescription("Check your learning XP"),
].map(cmd => cmd.toJSON());

// REGISTER cmds
const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        console.log("Registering slash commands...");
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log("Slash commands registered");
    } catch (error) {
        console.log(error);
    }
})();

// bot logic
client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}.`);
});

const xpMap = new Map<string, number>();

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, options, user } = interaction;

    if (commandName === "learn") {
        const topic = options.getString("topic", true);
        const xp = (xpMap.get(user.id) || 0) + 10;
        xpMap.set(user.id, xp);

        await interaction.reply(`You started learning **${topic}**! (+10xp)\nYour Total XP: ${xp}`);
    }

    if (commandName === "xp") {
        const xp = xpMap.get(user.id) || 0;
        await interaction.reply(`${user.username}, you have **${xp} XP**! Keep learning!`);
    }
});

client.login(token);