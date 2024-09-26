const Deadline = require("../models/deadline");
require("dotenv").config();

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
      }

      // Notify and delete if the task is overdue
      if (timeRemaining <= 0) {
        await client.channels.cache
          .get(process.env.ELEVEN_CHANNEL_ID)
          .send(
            `@everyone ⚠️ **${
              deadline.subject
            }** task was due on **${deadline.date.toDateString()}**: ${
              deadline.task
            } hope you submitted it!😉`
          );

        // Delete the deadline without a callback
        await Deadline.findByIdAndDelete(deadline._id);
        console.log(`Deleted deadline for ${deadline.subject}`);
      }
    }
  } catch (err) {
    console.log("Error in checking deadlines:", err);
  }
  // Notify if no deadlines are due soon
  if (count === 0) {
    await client.channels.cache
      .get(process.env.ELEVEN_CHANNEL_ID)
      .send("@everyone No deadlines due soon! Enjoy your day! 😊");
  }
};

module.exports = checkDeadlines;
