<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Funded Futures Africa

**A modern scholarship platform connecting African students with educational funding opportunities.**

This platform features a public directory of scholarships and an admin dashboard for managing listings. It's built with Next.js, TypeScript, and Firebase, providing a fast, secure, and user-friendly experience for both students and administrators.

## Features

*   **Public Scholarship Directory:** A comprehensive and searchable list of scholarships available to African students.
*   **Admin Dashboard:** A secure area for administrators to add, edit, and remove scholarship listings.
*   **Detailed Scholarship Information:** Each listing includes key details such as the provider, funding amount, deadline, and a link to the external application.
*   **Responsive Design:** The platform is fully responsive and accessible on all devices.

## Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm

### Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/funded-futures-africa.git
    cd funded-futures-africa
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add your Firebase configuration details:

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
    NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies Used

*   **Next.js:** A React framework for building server-side rendered and static web applications.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
*   **Firebase:** A platform for building web and mobile applications, used here for database and authentication.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.

## Deployment

This app is designed for easy deployment on platforms like Vercel or Netlify. You can also deploy it to Firebase Hosting.

### Deploy with Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
