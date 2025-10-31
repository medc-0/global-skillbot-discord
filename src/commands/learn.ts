import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { readLessons } from "../utils/fileHandler";
import { addXP } from "../utils/pointsManager";

export const data = new SlashCommandBuilder()
  .setName("learn")
  .setDescription("Learn something about a specific topic.")
  .addStringOption(option =>
    option.setName("topic").setDescription("Topic name").setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const topic = interaction.options.getString("topic")?.toLowerCase();
  const lessons = await readLessons();

  const topicList = lessons[topic];
  if (!topicList) {
    await interaction.reply(
      `I don't know anything about "${topic}" yet. Use /teach to share knowledge.`
    );
    return;
  }

  const lesson = topicList[Math.floor(Math.random() * topicList.length)];
  await addXP(interaction.user.id, 10, "learn");

  const content = typeof lesson === "string" ? lesson : lesson.content;
  await interaction.reply(`[*${topic.toUpperCase()}*]\n${content}\n\n+10 XP earned! Keep learning.`);
}
