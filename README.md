# Eleven59 Bot

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

