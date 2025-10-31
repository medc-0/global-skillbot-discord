import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { readLessons } from "../utils/fileHandler";

export const data = new SlashCommandBuilder()
  .setName("topics")
  .setDescription("List all available learning topics.");

export async function execute(interaction: ChatInputCommandInteraction) {
  const lessons = await readLessons();
  const topics = Object.keys(lessons);

  if (topics.length === 0) {
    await interaction.reply("I don’t know any topics yet. You can add some with /teach.");
    return;
  }

  await interaction.reply(`Available topics:\n- ${topics.join("\n- ")}`);
}
