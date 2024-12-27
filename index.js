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
  if(message.content.startsWith('hello' || 'hi')) {
    const user = message.author;
    message.reply(`Hello ${user}! Have you completed your assignments?`);
  }

  if(message.content.startsWith('no')) {
    message.reply(`Oh no ${message.author}! Please complete your assignments on time.`);
    listDeadlines(message);
  }

  if(message.content.startsWith("due ")) {
    try {
      const deadlines = await Deadline.find({});
      console.log(deadlines)
      if(deadlines.length === 0){
        message.channel.send("No deadlines found!");
      }
      else {
       let response = "Deadlines:\n";
        deadlines.forEach((deadline, index)=>{
          response += `${index+1}. **${deadline.subject}** on **${(deadline.date).toDateString()}**: ${deadline.task}\n`;
        })
        message.channel.send(response);
      }
    }
    catch(error){
      console.log("Error in fetching deadlines:", error);
      message.channel.send("Error in fetching deadlines, Please try again later.");
    }
  }

  if (message.content.startsWith("add ")) {
    console.log(message.content);
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
