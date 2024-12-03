import { useState, useEffect } from 'react'
import { PlusCircle, Edit2, Trash2, Save, LogOut, WifiOff, RefreshCw, X, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { 
  BlogPost, 
  PortfolioItem,
  getBlogPosts,
  getPortfolioItems,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem
} from '../../services/DatabaseService'

const DEFAULT_BLOG_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Cloud Computing',
  'Cybersecurity',
  'Machine Learning'
]

const DEFAULT_PORTFOLIO_CATEGORIES = [
  'Web Development',
  'Mobile App',
  'UI/UX Design',
  'Cloud Solutions',
  'Enterprise Software'
]

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'blog' | 'portfolio'>('blog')
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  
  const [newPost, setNewPost] = useState<Omit<BlogPost, '_id'>>({
    title: '',
    excerpt: '',
    content: '',
    category: DEFAULT_BLOG_CATEGORIES[0],
    author: '',
    date: new Date().toISOString(),
    image: ''
  })

  const [newPortfolioItem, setNewPortfolioItem] = useState<Omit<PortfolioItem, '_id'>>({
    title: '',
    description: '',
    category: DEFAULT_PORTFOLIO_CATEGORIES[0],
    image: '',
    link: '',
    github: ''
  })

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated')
    if (!isAuthenticated) {
      navigate('/admin/login')
      return
    }

    fetchData()

    const handleOnline = () => {
      setIsOffline(false)
      fetchData()
    }
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [navigate])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [fetchedPosts, fetchedItems] = await Promise.all([
        getBlogPosts(),
        getPortfolioItems()
      ])
      setPosts(fetchedPosts)
      setPortfolioItems(fetchedItems)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
      console.error('Error fetching data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const created = await createBlogPost(newPost)
      setPosts(prev => [created, ...prev])
      setIsAdding(false)
      setNewPost({
        title: '',
        excerpt: '',
        content: '',
        category: DEFAULT_BLOG_CATEGORIES[0],
        author: '',
        date: new Date().toISOString(),
        image: ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
    }
  }

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPost?._id) return
    try {
      const updated = await updateBlogPost(editingPost._id, editingPost)
      setPosts(prev => prev.map(post => post._id === updated._id ? updated : post))
      setEditingPost(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post')
    }
  }

  const handleDeletePost = async (id: string) => {
    try {
      await deleteBlogPost(id)
      setPosts(prev => prev.filter(post => post._id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post')
    }
  }

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const created = await createPortfolioItem(newPortfolioItem)
      setPortfolioItems(prev => [created, ...prev])
      setIsAdding(false)
      setNewPortfolioItem({
        title: '',
        description: '',
        category: DEFAULT_PORTFOLIO_CATEGORIES[0],
        image: '',
        link: '',
        github: ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create portfolio item')
    }
  }

  const handleUpdatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPortfolio?._id) return
    try {
      const updated = await updatePortfolioItem(editingPortfolio._id, editingPortfolio)
      setPortfolioItems(prev => prev.map(item => item._id === updated._id ? updated : item))
      setEditingPortfolio(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update portfolio item')
    }
  }

  const handleDeletePortfolio = async (id: string) => {
    try {
      await deletePortfolioItem(id)
      setPortfolioItems(prev => prev.filter(item => item._id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete portfolio item')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-yellow-50 dark:bg-yellow-900 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <WifiOff className="h-5 w-5 text-yellow-400 mr-2" />
              <p className="text-yellow-700 dark:text-yellow-200">
                You're currently offline. Some features may be limited.
              </p>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-800 rounded-md text-yellow-700 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-700"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-red-700 dark:text-red-200">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-700 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('blog')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'blog'
                    ? 'border-primary-light text-primary-light'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Blog Posts
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'portfolio'
                    ? 'border-primary-light text-primary-light'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Portfolio Items
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {/* Add Button */}
          {!isAdding && !editingPost && !editingPortfolio && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-dark"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add {activeTab === 'blog' ? 'Blog Post' : 'Portfolio Item'}
            </button>
          )}

          {/* Forms */}
          {activeTab === 'blog' && isAdding && (
            <form onSubmit={handleAddPost} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Add New Blog Post</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={newPost.category}
                    onChange={e => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    {DEFAULT_BLOG_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Excerpt</label>
                  <textarea
                    value={newPost.excerpt}
                    onChange={e => setNewPost({ ...newPost, excerpt: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows={6}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Author</label>
                  <input
                    type="text"
                    value={newPost.author}
                    onChange={e => setNewPost({ ...newPost, author: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newPost.image}
                    onChange={e => setNewPost({ ...newPost, image: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-light text-white rounded hover:bg-primary-dark"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'portfolio' && isAdding && (
            <form onSubmit={handleAddPortfolio} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Add New Portfolio Item</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={newPortfolioItem.title}
                    onChange={e => setNewPortfolioItem({ ...newPortfolioItem, title: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={newPortfolioItem.category}
                    onChange={e => setNewPortfolioItem({ ...newPortfolioItem, category: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    {DEFAULT_PORTFOLIO_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newPortfolioItem.description}
                    onChange={e => setNewPortfolioItem({ ...newPortfolioItem, description: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newPortfolioItem.image}
                    onChange={e => setNewPortfolioItem({ ...newPortfolioItem, image: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Project URL</label>
                  <input
                    type="url"
                    value={newPortfolioItem.link}
                    onChange={e => setNewPortfolioItem({ ...newPortfolioItem, link: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">GitHub URL (Optional)</label>
                  <input
                    type="url"
                    value={newPortfolioItem.github || ''}
                    onChange={e => setNewPortfolioItem({ ...newPortfolioItem, github: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-light text-white rounded hover:bg-primary-dark"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Lists */}
          {activeTab === 'blog' && !isAdding && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                {posts.map(post => (
                  <div key={post._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{post.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{post.excerpt}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>{post.category}</span>
                          <span>•</span>
                          <span>{post.author}</span>
                          <span>•</span>
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-2">
                        <button
                          onClick={() => setEditingPost(post)}
                          className="p-1 text-gray-400 hover:text-primary-light"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(post._id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && !isAdding && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                {portfolioItems.map(item => (
                  <div key={item._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>{item.category}</span>
                          <span>•</span>
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-primary-light hover:text-primary-dark">
                            View Project
                          </a>
                          {item.github && (
                            <>
                              <span>•</span>
                              <a href={item.github} target="_blank" rel="noopener noreferrer" className="text-primary-light hover:text-primary-dark">
                                GitHub
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-2">
                        <button
                          onClick={() => setEditingPortfolio(item)}
                          className="p-1 text-gray-400 hover:text-primary-light"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(item._id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-center mb-4 text-red-600">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-medium text-center mb-4">
              Are you sure you want to delete this item?
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (activeTab === 'blog') {
                    handleDeletePost(deleteConfirm)
                  } else {
                    handleDeletePortfolio(deleteConfirm)
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard