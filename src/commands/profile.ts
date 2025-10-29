import { SlashCommandBuilder } from "discord.js";
import { getUser } from "../utils/pointsManager.js";

export const data = new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View your SkillBot learning profile.");

export async function execute(interaction: any) {
    const userId = interaction.user.id;
    const user = await getUser(userId);

    const level = Math.floor(user.xp / 100) + 1;
    const nextLevelXP = (level * 100) - user.xp;

    const lines = [
        `User: ${interaction.user.username}`,
        `Level: ${level}`,
        `XP: ${user.xp}`,
        `Streak: ${user.streak} day(s)`,
        `Next Level In: ${nextLevelXP} XP`,
    ];

    await interaction.reply(lines.join("\n"));
}