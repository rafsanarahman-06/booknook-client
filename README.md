# 📚 BookNook — A Small Online Library

**Discover, borrow, and enjoy wonderful books!**

BookNook is a small online library platform where readers can explore books, share their own book collections, borrow books, and manage their reading activities through a simple and welcoming interface.

## 🌐 Live Website

**Live Client:** [https://booknook-client-nine-xi.vercel.app/](https://booknook-client-nine-xi.vercel.app/)

**Backend API:** [https://booknook-server-uroj.onrender.com/](https://booknook-server-uroj.onrender.com/)

## ✨ Key Features

- **User Authentication:** Register and log in using email and password or Google authentication.
- **Browse Books:** Explore the available library collection with book details.
- **Search and Filter:** Find books easily using search and category filters.
- **Add Books:** Logged-in users can contribute new books to the library.
- **Manage Your Books:** Edit or delete books added by your account.
- **Book Details:** View detailed information about individual books.
- **Borrow Books:** Borrow books with a borrowing date and return date.
- **My Borrows:** View your borrowed books in one organized place.
- **Return Books:** Return borrowed books when finished.
- **Responsive Design:** Enjoy a user-friendly experience on desktop, tablet, and mobile devices.
- **New Arrivals:** Discover the latest books added to the library.

## 🛠️ Technologies Used

### Frontend

- Next.js
- React
- JavaScript
- Tailwind CSS
- Axios
- Lucide React
- Swiper
- Better Auth

### Backend

- Node.js
- Express.js
- MongoDB

### Deployment

- Vercel
- Render
- MongoDB Atlas

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/rafsanarahman-06/booknook-client.git

```

### 2. Navigate to the project directory

```bash
cd booknook-client

```

### 3. Install dependencies

```bash
npm install

```

### 4. Configure environment variables

Create a `.env.local` file and configure the required environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

```

Use your own credentials. Never commit secret values to GitHub.

### 5. Start the development server

```bash
npm run dev -- --webpack

```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```text
client/
├── app/
│   ├── add-book/
│   ├── books/
│   ├── login/
│   ├── register/
│   ├── my-books/
│   ├── my-borrows/
│   └── my-profile/
├── components/
├── lib/
├── public/
├── package.json
└── README.md

```

## 🎨 Design Philosophy

BookNook follows a calm reading-room design concept with warm paper backgrounds, soft sage tones, muted forest-green accents, and comfortable typography.

The goal is to create a welcoming digital library experience for readers of all ages.

## 👩‍💻 Author

**Rafsana Rahman**

Programming Hero Assignment 8 — BookNook