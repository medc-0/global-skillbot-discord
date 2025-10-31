import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Show all available commands.");

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle("SkillBot — Help")
    .setColor(0x5865F2)
    .setDescription([
      "Use these commands to learn, teach, and track your progress:",
      "",
      "• /learn topic:<name> — Learn about a topic",
      "• /teach topic:<name> content:<text> — Teach SkillBot",
      "• /topics — List all topics",
      "• /profile — View your XP and streak",
      "• /help — Show this help menu",
      "",
      "Tip: You can also use text aliases: !learn, !teach, !help"
    ].join("\n"));

  await interaction.reply({ embeds: [embed] });
}
