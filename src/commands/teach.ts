import { SlashCommandBuilder } from "discord.js";
import { readLessons, writeLessons } from "../utils/fileHandler.js";
import { addXP } from "../utils/pointsManager.js";

export const data = new SlashCommandBuilder()
  .setName("teach")
  .setDescription("Teach SkillBot something new.")
  .addStringOption((option) =>
    option.setName("topic").setDescription("Topic to teach").setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("content").setDescription("What to teach about it").setRequired(true)
  );

export async function execute(interaction: any) {
  const topic = interaction.options.getString("topic")?.toLowerCase();
  const content = interaction.options.getString("content");

  const lessons = await readLessons();
  if (!lessons[topic]) lessons[topic] = [];

  lessons[topic].push(content);
  await writeLessons(lessons);

  await addXP(interaction.user.id, 20);

  await interaction.reply(
    `You taught me something new about "${topic}". +20 XP for contributing knowledge.`
  );
}
