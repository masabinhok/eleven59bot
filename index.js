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
  } else if (content.startsWith("remove ")) {
      try {
        const args = content.split(" ").slice(1);
        if (args.length !== 1) {
          return message.reply("Please provide the index of the deadline you want to remove (e.g., `remove 1`).");
        }

        const index = parseInt(args[0], 10);
        if (isNaN(index) || index < 1) {
          return message.reply("Please provide a valid index.");
        }

        const deadlines = await Deadline.find({});
        if (index > deadlines.length) {
          return message.reply("No deadline found at the given index.");
        }

        const deadline = deadlines[index - 1];
        await Deadline.findByIdAndDelete(deadline._id);

        message.channel.send(`🗑️ Deadline removed for **${deadline.subject}** on **${(deadline.date.toDateString())}**: ${deadline.task}`);
      }
      catch(error){
        console.log("Error in removing deadline:", error);
      }
  } else if (content.includes("who created you") || content.includes("who is your creator")) {
    const replies = [
      "Sabin le banako ho malai, aafule assignments garna nasamjhiyera.",
      "Jaile assignment xa vanera birsine manxele banako ho malai, Sabin.",
      "Khai yr birse feri sodhata.",
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    message.reply(reply);
  }
  else if (content.includes("help")) {
  const helpMessage = `** Hello! I’m Eleven59, your friendly deadline buddy! ⏰**
  I’m here to keep you on track and remind you of those deadlines before they sneak up on you. Let’s face it, most of us love the thrill of the last-minute rush—but hey, I’m here to save you from disaster! 😅

  Think of me as your **deadline whisperer**, always watching the clock so you don’t have to. 🕒  

  Here are some cool commands to get started:

  **\`add [subject] [date] [task]\`**  
  Add a new deadline to my memory vault.  
  Example: \`add Math 2024-12-31 Complete homework\`  

  **\`due\`**  
  Want to see what’s coming up? Just ask, and I’ll give you a quick rundown of your upcoming deadlines.  

  **\`hello\` / \`hi\`**  
  Feeling chatty? Say hi, and I’ll be your cheerful companion (and maybe nudge you about those tasks 👀).  

  **\`no\`**  
  Not ready to tackle your work yet? I’ll try not to panic, but I might remind you what’s due. 😜  

  _I’ll also check your deadlines automatically and remind you one day before submission—because I care. 💕_  

  So go ahead, add your deadlines and leave the stress to me.  
  Let’s turn last-minute panic into perfectly-timed productivity, because someone said:
  If you have only 1 hour to complete a task, it will take only 1 hour to complete the task. Lastminute supremacy!!
  `;

    message.reply(helpMessage);
}

  else {
    message.reply("I didn't understand that. Type `help` to see the commands you can use.");
  }
});


setInterval(() => {
  checkDeadlines(client).catch((err) => console.error(err));
}, 24 * 60 * 60 * 1000);

client.login(process.env.DISCORD_TOKEN);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
