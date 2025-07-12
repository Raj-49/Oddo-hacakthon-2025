# StackIt Frontend

A modern React frontend for the StackIt Q&A platform built for the Odoo Hackathon 2025.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Question & Answer System**: Browse, ask, and answer questions
- **User Authentication**: Login/register functionality
- **Voting System**: Upvote/downvote questions and answers
- **Tagging System**: Organize questions with tags
- **Search**: Find questions quickly
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

- **React 19** - Frontend framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client
- **Context API** - State management

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Navbar, Layout)
│   └── ui/             # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/             # Custom hooks
├── pages/             # Page components
├── services/          # API services
├── utils/             # Utility functions
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## 🚦 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Backend API
Update the API base URL in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api'; // Your backend URL
```

### Environment Variables
Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:3000/api
```

## 🎨 Design System

The app uses a consistent design system with:
- **Colors**: Blue primary, gray neutrals
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent padding and margins
- **Components**: Reusable UI components

## 🤝 Working with Backend

The frontend is designed to work seamlessly with the backend API. Key integration points:

- **Authentication**: JWT token-based auth
- **Questions**: CRUD operations for questions
- **Answers**: CRUD operations for answers
- **Users**: User management and profiles
- **Tags**: Tag system for categorization

## 🔄 Current State

This is a hackathon project with dummy data for demonstration. The following features are implemented:

✅ **Complete**:
- UI/UX design and layout
- Navigation and routing
- Question listing and display
- Ask question form
- Authentication UI
- Responsive design

🚧 **In Progress** (Backend Integration):
- Real API integration
- User authentication
- Question CRUD operations
- Answer system
- Voting functionality

## 🎯 Next Steps

1. Connect to backend API endpoints
2. Implement real authentication
3. Add question detail page
4. Implement answer system
5. Add user profiles
6. Implement search functionality

## 📝 Notes

- All components are built with accessibility in mind
- The app is mobile-first responsive
- Error handling is implemented for API calls
- The design follows modern web standards+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
