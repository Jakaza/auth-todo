# ToDo App 

## Overview

Welcome to the ToDo app! This application is a simple To-Do list manager that allows users to organize and keep track of their tasks. It comes with authentication features, allowing users to register and log in using Passport LocalStrategy and GoogleStrategy.

## Table of Contents

- [Features](#features)
- [Authentication](#authentication)
- [Database](#database)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Features

### ToDo Functions

1. **Active**: View and manage the tasks that are currently in progress.
2. **Completed**: Track and review the tasks that have been successfully completed.
3. **Toggle-All**: Quickly mark all tasks as completed or active.
4. **Clear-Completed**: Remove completed tasks from the list to keep it clean and focused.

## Authentication

The ToDo app utilizes Passport.js for authentication, employing both LocalStrategy and GoogleStrategy.

1. **LocalStrategy**: Users can register and log in using their email and password.
2. **GoogleStrategy**: Users also have the option to log in using their Google account.

## Database

The application uses SQLite3 as the local database to store user information and task data.

## Installation

Follow these steps to set up and run the ToDo app:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/jakaza/auth-todo.git
   ```

2. **Navigate to the Project Directory:**
   ```bash
   cd todo-app
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Database Setup:**

5. **Environment Variables:**
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     SESSION_SECRET=your_session_secret
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     ```

6. **Start the Application:**
   ```bash
   npm start
   ```

7. **Access the App:**
   Open your web browser and navigate to `http://localhost:3000`.

## Usage

1. **Register:**
   - Visit the registration page and create a new account by providing a valid email and password.

2. **Login:**
   - Log in using your registered email and password or use the Google login option.

3. **Add Tasks:**
   - Once logged in, start adding tasks to your To-Do list using the available functions.

4. **Manage Tasks:**
   - Use the "Active," "Completed," "Toggle-All," and "Clear-Completed" functions to organize your tasks.

5. **Logout:**
   - Logout when you're done by clicking the logout button.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to modify and distribute it as needed. Contributions are welcome!

Happy task managing! 🚀
