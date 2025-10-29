import { SlashCommandBuilder } from "discord.js";
import { readLessons } from "../utils/fileHandler.js";
import { addXP } from "../utils/pointsManager.js";

export const data = new SlashCommandBuilder()
  .setName("learn")
  .setDescription("Learn something about a specific topic.")
  .addStringOption((option) =>
    option.setName("topic").setDescription("Topic name").setRequired(true)
  );

export async function execute(interaction: any) {
  const topic = interaction.options.getString("topic")?.toLowerCase();
  const lessons = await readLessons();

  const topicList = lessons[topic];
  if (!topicList) {
    await interaction.reply(
      `I don't know anything about "${topic}" yet. You can teach me with /teach.`
    );
    return;
  }

  const lesson = topicList[Math.floor(Math.random() * topicList.length)];
  await addXP(interaction.user.id, 10);

  await interaction.reply(
    `[*${topic.toUpperCase()}*]\n${lesson}\n\n+10 XP earned. Keep going!`
  );
}
