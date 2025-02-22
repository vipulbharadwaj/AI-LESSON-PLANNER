# Lesson Plan Generator

A web application that helps educators create structured lesson plans with AI assistance.

## Live Demo
[Deployed Version](https://67b9f2ed07d2258ec8409d87--flourishing-semolina-53d58d.netlify.app/)

## GitHub Repository
[GitHub Repo](https://github.com/vipulbharadwaj/AI-LESSON-PLANNER)

## Features
- AI-generated lesson plans
- Editable fields for customization
- Download as PDF in the correct format
- User-friendly UI with accordions for better organization
- Deployed on Vercel / Netlify

## Project Structure
```
lesson-plan-generator/
│── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Main application pages
│   ├── utils/            # Helper functions
│   ├── App.js            # Root component
│   ├── main.jsx          # React entry point
│── public/               # Static assets
│── .env                  # API keys (Not shared)
│── package.json          # Dependencies & scripts
│── README.md             # Project documentation
```

## Getting Started
### 1. Clone the Repository
```sh
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd lesson-plan-generator
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

### 4. Run the Development Server
```sh
npm run dev
```
Your app will be running at `http://localhost:5173`.

## API Integration
This project integrates with **Google Gemini AI API** to generate lesson plans.

### API Request Example
```js
const response = await axios.post(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
  contents: [{ role: "user", parts: [{ text: "Generate a lesson plan for Photosynthesis." }] }],
});
```

## Deployment
### Deploy on Vercel
```sh
npm install -g vercel
vercel
```

or **Netlify**
```sh
npm install -g netlify-cli
netlify deploy --prod
```

## Contributing
1. **Fork the Repository**
2. **Create a Feature Branch** (`git checkout -b feature-name`)
3. **Commit Changes** (`git commit -m 'Added new feature'`)
4. **Push to GitHub** (`git push origin feature-name`)
5. **Create a Pull Request**

