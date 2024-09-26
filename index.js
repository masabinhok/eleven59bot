const express = require("express");
const app = express();
require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const Deadline = require("./models/deadline");
const checkDeadlines = require("./utils/checkDeadlines");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
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
  if (message.content.startsWith("/deadline")) {
    const args = message.content.split(" ").slice(1);
    const subject = args[0];
    const date = args[1];
    const task = args.slice(2).join(" ");

    const newDeadline = new Deadline({
      subject,
      date,
      task,
    });

    await newDeadline.save();

    message.channel.send(
      `📅 Deadline added for **${subject}** on **${date}**: ${task}`
    );
  }
});

setInterval(() => {
  checkDeadlines(client).catch((err) => console.error(err));
}, 24 * 60 * 60 * 1000);

client.login(process.env.DISCORD_TOKEN);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
