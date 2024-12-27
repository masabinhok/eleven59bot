# Eleven59 Bot

Eleven59 is a Discord bot designed to help you manage your deadlines. The bot allows users to add deadlines, receive reminders about upcoming deadlines, and track tasks efficiently within a Discord server.

## Features# Eleven59 Bot

Eleven59 is a Discord bot designed to help you manage your deadlines. The bot allows users to add deadlines, receive reminders about upcoming deadlines, and track tasks efficiently within a Discord server.

## Features

- **Add Deadlines:** Users can add deadlines with specific subjects, dates, and tasks.
- **Reminders:** The bot will send reminders when a task is due within the next 24 hours and automatically delete the task after sending the reminder.
- **Task Management:** Users can view, add, or remove tasks with simple commands.
- **Suggestions:** Users can provide feature suggestions directly to the bot.
- **Interactive Responses:** The bot interacts with users through greetings and dynamic replies.

## Commands

### Add a Deadline
```bash
add [subject] [date] [task]
```
- **subject**: The subject or category of the deadline (e.g., "Math" or "Project").
- **date**: The due date in `YYYY-MM-DD` format.
- **task**: The description of the task to be completed.

Example:
```
add Math 2024-12-31 Solve equations
```
The bot will respond with:
```
📅 Deadline added for Math on 2024-12-31: Solve equations
```

### View Deadlines
```bash
due
```
Lists all upcoming deadlines in the server.

### Remove a Deadline
```bash
remove [index]
```
Removes a deadline by its index in the list.

Example:
```
remove 1
```
The bot will respond with:
```
🗑️ Deadline removed for Math on 2024-12-31: Solve equations
```

### Suggest a Feature
```bash
suggest [suggestion]
```
Submits a feature suggestion to the bot's creator.

Example:
```
suggest add reminders for group projects
```
The bot will respond with:
```
Thank you for the suggestion! I will tell Sabin to add reminders for group projects in the next update.
```

### Interact with the Bot
- **hello / hi**: The bot will greet you cheerfully and nudge you about your tasks.
- **no**: If you admit you haven’t completed your assignments, the bot will encourage you and show your deadlines.
- **who created you**: The bot will reveal its creator with a humorous reply.
- **help**: Displays all available commands and their descriptions.

## Technologies Used

- **Node.js**: The runtime environment for running JavaScript code on the server.
- **Discord.js**: Library for interacting with the Discord API.
- **MongoDB**: Database for storing and managing deadlines.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js.

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.



- **Add Deadlines:** Users can add deadlines with specific subjects, dates, and tasks.
- **Reminders:** The bot will send reminders when a task is due within the next 24 hours.
- **Overdue Notifications:** Once a task is overdue, the bot will notify the server and automatically remove the deadline.
- **Task Management:** Automatically deletes deadlines after notifying users of overdue tasks.

## Commands

### Add a Deadline
```bash
/deadline [subject] [date] [task]
```
- **subject**: The subject or category of the deadline (e.g., "Math" or "Project").
- **date**: The due date in `YYYY-MM-DD` format.
- **task**: The description of the task to be completed.
  
Example:
```
/deadline Math 2024-09-30 Finish the algebra assignment
```
The bot will respond with:
```
📅 Deadline added for Math on 2024-09-30: Finish the algebra assignment
```

### Automatic Reminders
- The bot will check for deadlines every 24 hours.
- Reminds users of tasks that are due within the next 24 hours with the `@everyone` tag.

### Overdue Task Notifications
- If a task is overdue, the bot will notify the server with the following message:
  ```
  ⚠️ [subject] task was due on [date]: [task] hope you submitted it!😉
  ```
- The bot will automatically remove the overdue task from the database.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/eleven59.git
   cd eleven59
   ```

2. **Install dependencies:**
   Ensure you have Node.js and npm installed. Then, install the required packages:
   ```bash
   npm install
   ```

3. **Environment setup:**
   Create a `.env` file and include the following:
   ```bash
   DISCORD_TOKEN=your_discord_bot_token
   ELEVEN_CHANNEL_ID=your_channel_id
   MONGO_URI=your_mongo_database_uri
   ```

4. **Run the bot:**
   Start the bot using Node.js:
   ```bash
   node index.js
   ```

## Technologies Used

- **Node.js**: The runtime environment for running JavaScript code on the server.
- **Discord.js**: Library for interacting with the Discord API.
- **MongoDB**: Database for storing and managing deadlines.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License.
