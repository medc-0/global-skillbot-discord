import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Show all available commands.");

export async function execute(interaction: any) {
  await interaction.reply(
    [
      "SkillBot Commands:",
      "--------------------------------",
      "/learn <topic>      → Learn about a topic",
      "/teach <topic> <content> → Teach SkillBot new info",
      "/topics            → View all topics I know",
      "/help              → Show this help menu",
      "--------------------------------",
      "SkillBot is here to learn *with you!*"
    ].join("\n")
  );
}
