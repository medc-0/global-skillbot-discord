import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getUser, calculateLevelProgress } from "../utils/pointsManager";

export const data = new SlashCommandBuilder()
  .setName("profile")
  .setDescription("View your SkillBot learning profile.");

export async function execute(interaction: ChatInputCommandInteraction) {
  const userId = interaction.user.id;
  const user = await getUser(userId);

  const { level, currentInLevel, neededForLevel, remaining, percent } = calculateLevelProgress(user.xp);
  const filled = Math.round(percent / 10);
  const bar = `${"█".repeat(filled)}${"░".repeat(10 - filled)} ${percent}%`;

  const embed = new EmbedBuilder()
    .setTitle(`${interaction.user.username} — Profile`)
    .setColor(0x00B894)
    .addFields(
      { name: "Level", value: `${level}`, inline: true },
      { name: "XP", value: `${user.xp}`, inline: true },
      { name: "Streak", value: `${user.streak} day(s)`, inline: true },
    )
    .addFields(
      { name: "Progress", value: `${bar}\n${currentInLevel}/${neededForLevel} XP (Next in ${remaining} XP)` }
    );

  await interaction.reply({ embeds: [embed] });
}