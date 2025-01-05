import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import { Client, GatewayIntentBits } from "discord.js";
import mongoose from "mongoose";
import cron from "node-cron-tz";
import winston from "winston";
import Deadline from "./models/deadline.js";
import Suggestion from "./models/suggestion.js";
import { checkDeadlines, listDeadlines } from "./utils/deadline.js";
import fetch from "node-fetch";





const PORT = process.env.PORT || 3000;
const backendUrl = process.env.SERVER_URL || "http://localhost:5000";

setInterval(()=>{
  fetch(`${backendUrl}/ping`)
  .then(res => console.log("Pinged"))
  .catch(err => console.error("Error in pinging:", err));
}, 5 * 60 * 1000);



app.get('/ping', (req, res)=>{
  res.send('Pong!');
})



// Set up Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'bot.log', level: 'info' }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

// Validate environment variables
if (!process.env.MONGODB_URI || !process.env.DISCORD_TOKEN) {
  logger.error("Missing required environment variables: MONGODB_URI or DISCORD_TOKEN");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => logger.info("Connected to the database"))
  .catch((err) => logger.error("Database connection error:", err));

// Express server for keep-alive
app.get("/", (req, res) => {
  res.send("Hello World! Bot is running.");
});

// Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  logger.info(`Logged in as ${client.user.tag}!`);
});

// Message handling
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== process.env.ELEVEN_CHANNEL_ID) return;

  const content = message.content.toLowerCase();
  const user = message.author;

  try {
    if (/^(hello|hi)$/i.test(content)) {
      message.reply(`Hello ${user}! Have you completed your assignments?`);
    } else if (content === "no") {
      message.reply(`Oh no ${user}! Please complete your assignments on time.`);
      listDeadlines(message);
    } else if (content.startsWith("due")) {
      listDeadlines(message);
    } else if (content.startsWith("add ")) {
      const args = content.split(" ").slice(1);
      if (args.length < 3) {
        return message.reply("Please provide subject, date, and task (e.g., `add Math 2024-12-31 Solve equations`).");
      }
      const [subject, date, ...taskArr] = args;
      const task = taskArr.join(" ");

      const newDeadline = new Deadline({ subject, date, task });
      await newDeadline.save();

      message.reply(`📅 Deadline added for **${subject}** on **${date}**: ${task}`);
    } else if (content.startsWith("remove ")) {
      const args = content.split(" ").slice(1);
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
      message.reply(`🗑️ Deadline removed for **${deadline.subject}**: ${deadline.task}`);
    } else if (content.includes("who created you") || content.includes("who is your creator")) {
      const replies = [
        "Sabin le banako ho malai, aafule assignments garna nasamjhiyera.",
        "Jaile assignment xa vanera birsine manxele banako ho malai, Sabin.",
        "Khai yr birse feri sodhata.",
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      message.reply(reply);
    } else if (content.includes("help")) {
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

  **\`suggest [suggestion]\`**
  Have a cool idea for a new feature? Let me know! I’ll pass it on to my creator, Sabin.
   Example: \`suggest add games\`  

  _I’ll also check your deadlines automatically and remind you one day before submission—because I care. 💕_  

  So go ahead, add your deadlines and leave the stress to me.  
  Let’s turn last-minute panic into perfectly-timed productivity, because someone said:
  If you have only 1 hour to complete a task, it will take only 1 hour to complete the task. Lastminute supremacy!!
  `;

    message.reply(helpMessage);
  } else if (content.startsWith("suggest ")) {
      const suggestion = content.split(" ").slice(1).join(" ");
      await Suggestion.create({ name: user.username, suggestion });
      message.reply(`Thanks for the suggestion, ${user}!`);
    } else {
      message.reply("I didn't understand that. Type `help` to see the commands you can use.");
    }
  } catch (error) {
    logger.error(`Error handling message: ${error}`);
    message.reply("An error occurred. Please try again.");
  }
});

// Schedule task for checking deadlines
cron.schedule(
  "30 7 * * *",
  () => {
    logger.info("Scheduled task running at 7:30 AM Kathmandu time!");
    checkDeadlines(client).catch(logger.error);
  },
  { timezone: "Asia/Kathmandu" }
);

// Graceful shutdown
process.on("SIGINT", async () => {
  logger.info("Shutting down gracefully...");
  await mongoose.disconnect();
  client.destroy();
  process.exit(0);
});

// Start Express server and Discord bot
client.login(process.env.DISCORD_TOKEN);
app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));
