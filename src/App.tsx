import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import { BarChart3, GraduationCap, BookOpen, Menu, X, LogOut, Users, CheckCircle, Settings as SettingsIcon, Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthContext } from './context/AuthContext'
import { useDarkMode } from './hooks/useLocalStorage'
import PageTransition from './components/PageTransition'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import StudentManagement from './pages/StudentManagement'
import TeacherManagement from './pages/TeacherManagement'
import ResultEntry from './pages/ResultEntry'
import SubjectResultEntry from './pages/SubjectResultEntry'
import Reports from './pages/Reports'
import Attendance from './pages/Attendance'
import Settings from './pages/Settings'
import TeacherDashboard from './pages/TeacherDashboard'
import ParentDashboard from './pages/ParentDashboard'
import './App.css'

import { fetchConfig } from './services/api'

function AppContent() {
  const { isAuthenticated, logout, user, isHydrated } = useAuthContext()
  const location = useLocation()
  const [isDarkMode, setIsDarkMode] = useDarkMode()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showLogout, setShowLogout] = useState(false)
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchConfig().then(setConfig).catch(console.error)
    }
  }, [isAuthenticated])

  // Show a loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 animate-pulse">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => window.location.reload()} />
  }

  const userRole = user?.role || 'Student'
  const userName = user?.name || 'User'

  const handleLogout = () => {
    logout()
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-72' : 'w-24'
        } ${isDarkMode ? 'bg-gray-950 border-r border-gray-800' : 'bg-[#1e1b4b]'} text-white transition-all duration-500 flex flex-col shadow-2xl relative z-30`}
      >
        {/* Logo */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-indigo-900/50'} flex items-center justify-between`}>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              {config?.schoolLogo ? (
                <img src={config.schoolLogo} alt="Logo" className="w-10 h-10 object-contain shadow-indigo-500/20 shadow-lg rounded-xl bg-white p-1" />
              ) : (
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                  <GraduationCap size={24} />
                </div>
              )}
              <div className="overflow-hidden">
                <h1 className="text-sm font-black truncate tracking-tighter uppercase">{config?.schoolName?.split(' ')[0] || 'FOLUSHO'}</h1>
                <p className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-indigo-300/60'} truncate uppercase font-black tracking-widest`}>{config?.schoolName?.split(' ').slice(1).join(' ') || 'Victory Schools'}</p>
              </div>
            </motion.div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-indigo-800'} rounded-xl transition-all active:scale-90`}
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* User Info */}
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`px-6 py-5 border-b ${isDarkMode ? 'border-gray-800 bg-gray-900/30' : 'border-indigo-900/30 bg-indigo-950/30'}`}
          >
            <p className={`text-[9px] uppercase font-black tracking-[0.2em] ${isDarkMode ? 'text-gray-600' : 'text-indigo-400'}`}>Authenticated Session</p>
            <p className="font-black text-white truncate text-sm mt-1">{userName}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDarkMode ? 'bg-blue-500' : 'bg-indigo-400'}`}></div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-blue-500' : 'text-indigo-300'}`}>{userRole}</p>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {userRole === 'Teacher' ? (
            <>
              <NavLink
                to="/teacher-dashboard"
                icon={<BarChart3 size={18} />}
                label="Academic Dashboard"
                isOpen={isSidebarOpen}
                isDarkMode={isDarkMode}
              />
              <NavLink
                to="/subject-results"
                icon={<BookOpen size={18} />}
                label="Result Entry"
                isOpen={isSidebarOpen}
                isDarkMode={isDarkMode}
              />
              <NavLink
                to="/attendance"
                icon={<CheckCircle size={18} />}
                label="Registry & Attendance"
                isOpen={isSidebarOpen}
                isDarkMode={isDarkMode}
              />
            </>
          ) : userRole === 'Parent' ? (
            <>
              <NavLink
                to="/parent-dashboard"
                icon={<BarChart3 size={18} />}
                label="Scholar Progress"
                isOpen={isSidebarOpen}
                isDarkMode={isDarkMode}
              />
            </>
          ) : (
            <>
              <NavLink
                to="/"
                icon={<BarChart3 size={18} />}
                label="Insights Console"
                isOpen={isSidebarOpen}
                isDarkMode={isDarkMode}
              />
              <NavLink
                to="/students"
                icon={<GraduationCap size={18} />}
                label="Scholar Management"
                isOpen={isSidebarOpen}
                isDarkMode={isDarkMode}
              />
              {userRole === 'Admin' && (
                <NavLink
                  to="/teachers"
                  icon={<Users size={18} />}
                  label="Faculty Management"
                  isOpen={isSidebarOpen}
                  isDarkMode={isDarkMode}
                />
              )}
              <NavLink
                  to="/results"
                  icon={<BookOpen size={18} />}
                  label="Grade Repository"
                  isOpen={isSidebarOpen}
                  isDarkMode={isDarkMode}
                />
                <NavLink
                  to="/subject-results"
                  icon={<BookOpen size={18} />}
                  label="Subject Analytics"
                  isOpen={isSidebarOpen}
                  isDarkMode={isDarkMode}
                />
                <NavLink
                  to="/attendance"
                  icon={<CheckCircle size={18} />}
                  label="Attendance Registry"
                  isOpen={isSidebarOpen}
                  isDarkMode={isDarkMode}
                />
              <NavLink
                to="/reports"
                icon={<BarChart3 size={18} />}
                label="Performance Reports"
                isOpen={isSidebarOpen}
                isDarkMode={isDarkMode}
              />
              {userRole === 'Admin' && (
                <NavLink
                  to="/settings"
                  icon={<SettingsIcon size={18} />}
                  label="System Parameters"
                  isOpen={isSidebarOpen}
                  isDarkMode={isDarkMode}
                />
              )}
            </>
          )}
        </nav>

        {/* Bottom Section */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-indigo-900/50'}`}>
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-300 ${
              isDarkMode 
                ? 'text-amber-400 hover:bg-gray-800 bg-gray-900/50 shadow-inner' 
                : 'text-indigo-200 hover:bg-indigo-800 bg-indigo-900/30'
            }`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            {isSidebarOpen && <span className="font-black text-[10px] uppercase tracking-widest">{isDarkMode ? 'Solar Protocol' : 'Lunar Protocol'}</span>}
          </button>

          {/* Logout Button */}
          <div className="relative">
            <button
              onClick={() => setShowLogout(!showLogout)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isDarkMode ? 'text-gray-500 hover:bg-rose-500/10 hover:text-rose-500' : 'text-indigo-300/60 hover:bg-rose-500/10 hover:text-rose-400'
              }`}
            >
              <LogOut size={18} />
              {isSidebarOpen && <span className="font-black text-[10px] uppercase tracking-widest">Terminate Session</span>}
            </button>
            <AnimatePresence>
              {showLogout && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute bottom-full mb-3 left-0 right-0 bg-rose-600 rounded-2xl p-2 shadow-2xl z-50 border border-rose-500"
                >
                  <button
                    onClick={handleLogout}
                    className="w-full text-white text-[10px] font-black hover:bg-rose-700 px-3 py-3 rounded-xl transition-all uppercase tracking-[0.2em]"
                  >
                    Confirm Termination
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {isSidebarOpen && <p className={`text-[8px] font-black ${isDarkMode ? 'text-gray-800' : 'text-indigo-900'} mt-6 text-center uppercase tracking-[0.3em] opacity-50`}>Folusho Intelligence © 2024</p>}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 overflow-auto ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto py-6">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {userRole === 'Teacher' ? (
                <>
                  <Route path="/teacher-dashboard" element={<PageTransition><TeacherDashboard /></PageTransition>} />
                  <Route path="/subject-results" element={<PageTransition><SubjectResultEntry /></PageTransition>} />
                  <Route path="*" element={<Navigate to="/teacher-dashboard" replace />} />
                </>
              ) : userRole === 'Parent' ? (
                <>
                  <Route path="/parent-dashboard" element={<PageTransition><ParentDashboard /></PageTransition>} />
                  <Route path="*" element={<Navigate to="/parent-dashboard" replace />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
                  <Route path="/students" element={<PageTransition><StudentManagement /></PageTransition>} />
                  <Route path="/teachers" element={<PageTransition><TeacherManagement /></PageTransition>} />
                  <Route path="/results" element={<PageTransition><ResultEntry /></PageTransition>} />
                  <Route path="/subject-results" element={<PageTransition><SubjectResultEntry /></PageTransition>} />
                  <Route path="/attendance" element={<PageTransition><Attendance /></PageTransition>} />
                  <Route path="/reports" element={<PageTransition><Reports /></PageTransition>} />
                  <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              )}
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

interface NavLinkProps {
  to: string
  icon: React.ReactNode
  label: string
  isOpen: boolean
  isDarkMode?: boolean
}

function NavLink({ to, icon, label, isOpen, isDarkMode }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
        isDarkMode 
          ? 'text-gray-400 hover:bg-gray-800 hover:text-white' 
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      <span className={`${isDarkMode ? 'text-blue-500' : 'text-blue-400'} group-hover:text-blue-300`}>{icon}</span>
      {isOpen && <span className="font-medium text-sm">{label}</span>}
    </Link>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
