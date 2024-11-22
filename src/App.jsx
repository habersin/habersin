import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Auth from './components/Auth';
import Profile from './components/Profile';
import BlogList from './components/BlogList';
import CreateBlog from './components/CreateBlog';
import UserProfile from './components/UserProfile';
import BlogDetail from './components/BlogDetail';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateBlog, setShowCreateBlog] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Yükleniyor...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link 
                to="/"
                className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                <img 
                  src="https://i.ibb.co/QYGymd9/habersinlogo.png" 
                  alt="Habersin Logo" 
                  className="h-8 w-auto"
                />
                <div className="flex flex-col">
                  <span>Habersin</span>
                  <span className="text-xs text-gray-500">Sinop'un haberi sensin.</span>
                </div>
              </Link>

              <div className="flex-1 max-w-xs mx-200">
                <input
                  type="text"
                  placeholder="🔍︎"
                  className="w-full px-5 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Profilim
                    </Link>
                    <button
                      onClick={() => auth.signOut()}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Giriş Yap / Kayıt Ol
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={
              <>
                {user && (
                  <div className="text-center mb-8">
                    <button
                      onClick={() => setShowCreateBlog(true)}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors text-lg font-semibold"
                    >
                      Bir Haberim Var!
                    </button>
                    <p className="mt-4 text-gray-600">
                     
                    </p>
                  </div>
                )}





                <h2 className="text-2xl font-bold text-center mb-8">Gündem</h2>
                <BlogList searchQuery={searchQuery} />
              </>
            } />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/blog/:id" element={<BlogDetail setShowAuth={setShowAuth} />} />
          </Routes>

          {showCreateBlog && user && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Haberi Paylaş</h2>
                  <button
                    onClick={() => setShowCreateBlog(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <CreateBlog onClose={() => setShowCreateBlog(false)} />
              </div>
            </div>
          )}

          {showAuth && !user && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Giriş Yap / Kayıt Ol</h2>
                  <button
                    onClick={() => setShowAuth(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <Auth onSuccess={() => setShowAuth(false)} />
              </div>
            </div>
          )}
        </main>
      </div>
    </Router>
  );
}