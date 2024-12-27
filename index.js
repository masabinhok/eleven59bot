const express = require("express");
const app = express();
require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const Deadline = require("./models/deadline");
const {checkDeadlines, listDeadlines} = require("./utils/deadline");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World");
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  if (/^(hello|hi)$/i.test(content)) {
    const user = message.author;
    message.reply(`Hello ${user}! Have you completed your assignments?`);
  } else if (content === "no") {
    message.reply(`Oh no ${message.author}! Please complete your assignments on time.`);
    listDeadlines(message);
  } else if (content.startsWith("due")) {
    listDeadlines(message);
  } else if (content.startsWith("add ")) {
    try {
      const args = content.split(" ").slice(1);
      if (args.length < 3) {
        return message.reply("Please provide subject, date, and task (e.g., `add Math 2024-12-31 Solve equations`).");
      }

      const [subject, date, ...taskArr] = args;
      const task = taskArr.join(" ");

      const newDeadline = new Deadline({ subject, date, task });
      await newDeadline.save();

      message.channel.send(`📅 Deadline added for **${subject}** on **${date}**: ${task}`);
    } catch (err) {
      console.error(err);
      message.reply("There was an error adding the deadline. Please try again.");
    }
  }
});


setInterval(() => {
  checkDeadlines(client).catch((err) => console.error(err));
}, 24 * 60 * 60 * 1000);

client.login(process.env.DISCORD_TOKEN);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
