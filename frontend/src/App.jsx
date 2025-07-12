import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AskQuestionPage from './pages/AskQuestionPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Modal from './components/ui/Modal';
import './App.css';
import { ToastContainer } from 'react-toastify';
import QuestionDetailPage from './pages/QuestionDetailPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [modal, setModal] = React.useState(null); // 'login' | 'signup' | null
  const openLogin = () => setModal('login');
  const openSignup = () => setModal('signup');
  const closeModal = () => setModal(null);

  // Blur background when modal is open
  return (
    <AuthProvider>
      <Router>
        <div className={modal ? 'overflow-hidden pointer-events-none select-none filter blur-sm' : ''}>
          <Routes>
            {/* Main app routes with layout */}
            <Route path="/" element={<Layout openLogin={openLogin} openSignup={openSignup}><HomePage /></Layout>} />
            <Route path="/ask" element={<Layout openLogin={openLogin} openSignup={openSignup}><AskQuestionPage /></Layout>} />
            <Route path="/questions/:id" element={<Layout openLogin={openLogin} openSignup={openSignup}><QuestionDetailPage /></Layout>} />
            <Route path="/tags" element={<Layout openLogin={openLogin} openSignup={openSignup}><div>Tags Page (Coming Soon)</div></Layout>} />
            <Route path="/users" element={<Layout openLogin={openLogin} openSignup={openSignup}><div>Users Page (Coming Soon)</div></Layout>} />
            <Route path="/profile" element={<Layout openLogin={openLogin} openSignup={openSignup}><ProfilePage /></Layout>} />
            {/* 404 route */}
            <Route path="*" element={<Layout openLogin={openLogin} openSignup={openSignup}><div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2></div></Layout>} />
          </Routes>
        </div>
        <Modal isOpen={modal === 'login'} onClose={closeModal}>
          <LoginPage onSignup={openSignup} onClose={closeModal} />
        </Modal>
        <Modal isOpen={modal === 'signup'} onClose={closeModal}>
          <SignupPage onLogin={openLogin} />
        </Modal>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
