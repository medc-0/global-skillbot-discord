import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import fs from "fs-extra";
import path from "path";

export const command = new SlashCommandBuilder()
    .setName("learn")
    .setDescription("Get a random learning tip from a topic")
    .addStringOption(option =>
        option
            .setName("topic")
            .setDescription("The topic to learn (python, javascript, ai)")
            .setRequired(true)
    );

export async function execute(interaction: CommandInteraction) {
    const topic = interaction.options.get("topic")?.value as string;

    const filePath = path.join(__dirname, "../data/lessons.json");
    const data = await fs.readJson(filePath);

    if (!data[topic]) {
        await interaction.reply(`[X] I don't have any tips for **${topic}** yet.`);
        return;
    }

    const tips = data[topic];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    await interaction.reply(`🧠 **${topic.toUpperCase()} Tip:** ${randomTip}`)

}
