import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, Loader } from 'lucide-react'
import { PortfolioItem, getPortfolioItems } from '../services/DatabaseService'
import PageTransition from '../components/PageTransition'

const PortfolioPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [projects, setProjects] = useState<PortfolioItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>(['All'])

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const items = await getPortfolioItems()
      setProjects(items)
      
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(items.map(item => item.category))]
      setCategories(uniqueCategories)
      
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio items')
      console.error('Error fetching portfolio items:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchProjects()
  }, [])

  // Listen for data updates
  useEffect(() => {
    const handleDataUpdate = () => {
      fetchProjects()
    }

    window.addEventListener('dataUpdate', handleDataUpdate)
    return () => window.removeEventListener('dataUpdate', handleDataUpdate)
  }, [])

  const filteredProjects = projects.filter(project => 
    selectedCategory === 'All' || project.category === selectedCategory
  )

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
              Our Portfolio
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-100"
            >
              Showcasing Our Best Work
            </motion.p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-secondary-DEFAULT dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2 justify-center">
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
        </section>

        {/* Portfolio Grid */}
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
                  onClick={fetchProjects}
                  className="px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-dark"
                >
                  Retry
                </button>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center min-h-[400px] flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No projects found in this category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group"
                    onMouseEnter={() => setHoveredId(project._id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 transition-opacity duration-300 ${
                        hoveredId === project._id ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {project.title}
                          </h3>
                          <p className="text-gray-200 text-sm mb-4">
                            {project.description}
                          </p>
                          <div className="flex space-x-4">
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-white hover:text-primary-light transition-colors"
                            >
                              <ExternalLink className="w-5 h-5 mr-1" />
                              Visit
                            </a>
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-white hover:text-primary-light transition-colors"
                              >
                                <Github className="w-5 h-5 mr-1" />
                                Code
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-light text-white px-3 py-1 rounded-full text-sm">
                        {project.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default PortfolioPage