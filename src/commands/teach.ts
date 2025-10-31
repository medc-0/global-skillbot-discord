import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { readLessons, writeLessons } from "../utils/fileHandler";
import { addXP } from "../utils/pointsManager";

export const data = new SlashCommandBuilder()
  .setName("teach")
  .setDescription("Teach SkillBot something new.")
  .addStringOption(option =>
    option.setName("topic").setDescription("Topic to teach").setRequired(true)
  )
  .addStringOption(option =>
    option.setName("content").setDescription("What to teach about it").setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const topic = interaction.options.getString("topic")?.toLowerCase();
  const content = interaction.options.getString("content");

  if (!topic || !content) {
    await interaction.reply({ content: "Please provide both a topic and content.", ephemeral: true });
    return;
  }

  const lessons = await readLessons();
  if (!lessons[topic]) lessons[topic] = [];

  lessons[topic].push({ topic, content, createdBy: interaction.user.id, createdAt: new Date() });
  await writeLessons(lessons);

  await addXP(interaction.user.id, 20, "teach");

  await interaction.reply(
    `You taught me something new about "${topic}". +20 XP for contributing knowledge.`
  );
}
