# Travel App - Waitlist

A Next.js application that includes a waitlist page for collecting early user signups.

## Features

- Animated waiting list page
- Username reservation system
- Email confirmation when users join the waitlist
- Admin view for waitlist entries
- Real-time waitlist counter

## Setup

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```

### Email Configuration

The waitlist uses Nodemailer to send confirmation emails. You can configure it in two ways:

#### Option 1: Use Ethereal Email for testing (default)

By default, the application is set to use Ethereal Email, which provides a free testing service that doesn't actually send emails to real addresses but allows you to see what would be sent.

With this configuration, when a user signs up, you'll see a URL in the console that you can click to view the test email.

#### Option 2: Configure a real SMTP server

To send real emails:

1. Create or edit `.env.local` at the root of your project
2. Configure the following variables:

```
# Email Configuration
EMAIL_HOST=smtp.youremailprovider.com
EMAIL_PORT=587  # Common ports: 587 (TLS) or 465 (SSL)
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password  # For Gmail, use an App Password
EMAIL_FROM="Travel App Team" <noreply@yourdomain.com>

# Set to false to use the above SMTP settings
USE_TEST_EMAIL=false
```

Common SMTP configurations:

- **Gmail**:
  - Host: smtp.gmail.com
  - Port: 587
  - Require "Less secure app access" or an App Password

- **Outlook/Hotmail**:
  - Host: smtp.office365.com
  - Port: 587

- **Yahoo**:
  - Host: smtp.mail.yahoo.com
  - Port: 587

## Waitlist Data

The waitlist entries are stored in a `waiting-list.json` file at the root of the project. In a production environment, you would want to replace this with a real database.

## License

MIT 