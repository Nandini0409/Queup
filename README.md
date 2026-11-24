# Queup

**A centralized workspace for managing LinkedIn outreach.**

Queup helps individuals organize their LinkedIn outreach workflow by bringing lead management, connection tracking, follow-ups, and daily prospecting activities into one place.

Instead of managing prospects through scattered spreadsheets and manual reminders, Queup provides a structured workspace to track outreach activities and stay organized.

## Demo

[Watch the Queup Demo](./src/assets/QueupDemo.mp4)

## Overview

Managing LinkedIn outreach involves more than sending connection requests and messages. It also requires keeping track of prospects, monitoring accepted connections, remembering follow-ups, and managing ongoing conversations.

Queup was built to simplify this process by providing a centralized workspace where users can organize their prospects and manage their daily outreach workflow.

**Note:** Queup does not automate LinkedIn interactions. Users manually perform actions on LinkedIn and update their progress in Queup.

## Features

### 1. Lead Management
- Add and manage outreach leads.
- Store lead information, LinkedIn profile URLs, and notes.
- Search and filter leads.
- View individual lead details and activity history.
- Import leads using Excel files.

### 2. Outreach Review Window
- Review accepted LinkedIn connection requests.
- Track leads who have replied.
- View follow-ups due on the current day.
- Manage different stages of the outreach workflow.

### 3. Message Templates
- Create and manage reusable outreach templates.
- Edit templates for different outreach stages.
- Personalize messages using lead information.
- Copy messages for manual use on LinkedIn.

### 4. Follow-up Management
- Track initial messages and subsequent follow-ups.
- Automatically schedule follow-up actions based on lead status.
- View leads requiring action today.
- Organize follow-ups by stage.

### 5. Daily Prospecting
- Add new prospects to the daily outreach workflow.
- Track daily prospecting progress.
- Monitor progress against a daily prospect target.

### 6. Lead Tracking
- Track the current outreach status of each lead.
- Mark interested leads.
- View lead activity history.
- Keep outreach activities organized in one workspace.

## Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Build Tool:** Vite
- **Database:** PostgreSQL
- **Backend Services:** Supabase (Backend-as-a-Service)
- **Authentication:** OAuth 2.0
- **Deployment:** Vercel

## Live Application

[**Visit Queup**](https://Queup-six.vercel.app/)

## Getting Started

Follow these instructions to run Queup locally.

### Prerequisites

- Node.js
- npm
- A Supabase project

### Installation

Clone the repository:

```bash
git clone https://github.com/Nandini0409/Queup.git
```

Navigate to the project directory:

```bash
cd Queup
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root and configure the following environment variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

OAUTH_CLIENT_ID=your_oauth_client_id
OAUTH_CLIENT_SECRET=your_oauth_client_secret
```

Configure any additional OAuth credentials through the appropriate secure server-side or Supabase provider settings.

### Run Locally

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal to access the application.

## Limitations

- LinkedIn connection requests and messages are handled manually.
- Queup does not directly access LinkedIn accounts.
- Queup does not automate connection requests or message sending.
- Users are responsible for reviewing LinkedIn activity and updating corresponding lead statuses.

## Future Enhancements

- Lead data export.
- Campaign management.
- Team collaboration.
- Outreach analytics and reporting.

## License

This project is currently not distributed under an open-source license.