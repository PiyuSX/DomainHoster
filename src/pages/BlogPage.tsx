import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Loader } from 'lucide-react'
import { BlogPost, getBlogPosts } from '../services/DatabaseService'
import PageTransition from '../components/PageTransition'

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const loadedPosts = await getBlogPosts()
      setPosts(loadedPosts)
      
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(loadedPosts.map(post => post.category))]
      setCategories(uniqueCategories)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog posts')
      console.error('Error fetching posts:', err)
    } finally {
      setIsLoading(false)
      setIsRetrying(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchPosts()
  }, [])

  // Listen for data updates
  useEffect(() => {
    const handleDataUpdate = () => {
      fetchPosts()
    }

    window.addEventListener('dataUpdate', handleDataUpdate)
    return () => window.removeEventListener('dataUpdate', handleDataUpdate)
  }, [])

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-primary text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Our Blog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-100"
            >
              Insights, Updates, and Tech News
            </motion.p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-secondary-DEFAULT dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-light text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Loader className="w-8 h-8 animate-spin text-primary-light" />
              </div>
            ) : error ? (
              <div className="text-center min-h-[400px] flex flex-col items-center justify-center">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => {
                    setIsRetrying(true)
                    fetchPosts()
                  }}
                  disabled={isRetrying}
                  className="px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                >
                  {isRetrying ? 'Retrying...' : 'Retry'}
                </button>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center min-h-[400px] flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No posts found. Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <motion.article
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {post.image && (
                      <div className="relative h-48">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-primary-light text-white px-3 py-1 rounded-full text-sm">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                        <Link
                          to={`/blog/${post._id}`}
                          className="text-primary-light hover:text-primary-dark font-medium"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default BlogPage