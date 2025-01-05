import Deadline from "../models/deadline.js";
import dotenv from "dotenv";
dotenv.config();

const checkDeadlines = async (client) => {
  const now = new Date();
  console.log("Checking deadlines at", now);
  let count = 0;

  try {
    const deadlines = await Deadline.find({});
    for (const deadline of deadlines) {
      const timeRemaining = deadline.date - now;
      const oneDay = 1000 * 60 * 60 * 24;

      // Send reminder if the task is due within 24 hours
      if (timeRemaining <= oneDay && timeRemaining > 0) {
        count++;
        await client.channels.cache
          .get(process.env.ELEVEN_CHANNEL_ID)
          .send(
            `@everyone ⏰ Reminder: **${
              deadline.subject
            }** task is due soon on **${deadline.date.toDateString()}**: ${
              deadline.task
            }`
          );
          await Deadline.findByIdAndDelete(deadline._id);
      }
    }
  } catch (err) {
    console.log("Error in checking deadlines:", err);
  }
  // // Notify if no deadlines are due soon
  // if (count === 0) {
  //   await client.channels.cache
  //     .get(process.env.ELEVEN_CHANNEL_ID)
  //     .send("@everyone No deadlines due soon! Enjoy your day! 😊");
  // }
};

const listDeadlines = async (message) => {
  try {
    const deadlines = await Deadline.find({});
    console.log(deadlines);
    if (deadlines.length === 0) {
      message.channel.send("No deadlines found!");
    } else {
      let response = "Deadlines:\n";
      deadlines.forEach((deadline, index) => {
        response += `${index + 1}. **${deadline.subject}** on **${deadline.date.toDateString()}**: ${deadline.task}\n`;
      });
      message.channel.send(response);
    }
  } catch (error) {
    console.log("Error in fetching deadlines:", error);
    message.channel.send("Error in fetching deadlines, Please try again later.");
  }
};

export { checkDeadlines, listDeadlines };
