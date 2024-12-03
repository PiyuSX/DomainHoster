import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Sun, Moon, UserCog } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-light">Domain Hoster</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-light transition-colors">
              Home
            </Link>
            <Link to="/services" className="text-gray-600 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-light transition-colors">
              Services
            </Link>
            <Link to="/portfolio" className="text-gray-600 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-light transition-colors">
              Portfolio
            </Link>
            <Link to="/blog" className="text-gray-600 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-light transition-colors">
              Blog
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-primary-light border-2 border-primary-light rounded-lg hover:bg-transparent hover:text-primary-light transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-opacity-50"
            >
              Contact Us
            </Link>
            <Link
              to="/admin/login"
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-light transition-colors"
              title="Admin Panel"
            >
              <UserCog size={20} />
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-light transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link
              to="/admin/login"
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-light transition-colors"
              title="Admin Panel"
            >
              <UserCog size={20} />
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-light transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-primary-light focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-light transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/services"
                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-light transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/portfolio"
                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-light transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Portfolio
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-light transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-white bg-primary-light border-2 border-primary-light rounded-lg hover:bg-transparent hover:text-primary-light transition-all duration-200 text-center"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar