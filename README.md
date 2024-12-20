# CloseToYou

CloseToYou is a React Native application designed to manage contacts efficiently. The app allows users to view, add, edit, and delete contacts, as well as sync contacts from their phone. It also provides location features and weather information for each contact. 

**Note:** Currently, the application is developed only for Android.

## Features

- User authentication (login and registration)
- View and manage contacts
- Sync contacts from phone
- Add and edit contact details
- Display contact location on a map
- Show weather information based on contact location

## Getting Started

To get started with the CloseToYou project, follow these steps:

### Prerequisites

Make sure you have the following installed:

- Node.js (>= 18)
- React Native CLI
- Android Studio or Xcode (for Android/iOS development)

### Step 1: Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/CloseToYou.git
cd CloseToYou
```

### Step 2: Install Dependencies
Install the required dependencies using npm or yarn:

```bash
# Using npm
npm install

# OR using Yarn
yarn install
```

### Step 3: Start the Metro Server
Start the Metro bundler:

```bash
# Using npm
npm start

# OR using Yarn
yarn start
```

### Step 4: Run the Application
Open a new terminal and run the application on your desired platform:

```bash
# Using npm
npm run android

# OR using Yarn
yarn android
```

### Step 5: Environment Variables
Make sure to set up your environment variables. Create a .env file in the root directory and add your API keys:

WEATHER_API_KEY=your_weather_api_key
GOOGLE_MAPS_KEY=your_google_maps_api_key
