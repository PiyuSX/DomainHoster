import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, User, Loader } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { BlogPost, getBlogPost } from '../services/DatabaseService'

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return
      
      try {
        setIsLoading(true)
        const fetchedPost = await getBlogPost(id)
        setPost(fetchedPost)
      } catch (err) {
        console.error('Error fetching post:', err)
        setError('Failed to load blog post. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto text-primary-light" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || 'Blog post not found'}
          </p>
          <Link 
            to="/blog"
            className="inline-flex items-center text-primary-light hover:text-primary-dark"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        {/* Back button */}
        <div className="max-w-3xl mx-auto px-4 mb-8">
          <Link 
            to="/blog"
            className="inline-flex items-center text-primary-light hover:text-primary-dark"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>

        <article className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <header className="mb-8">
            {post.image && (
              <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
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
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {post.title}
            </h1>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(post.date).toLocaleDateString()}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none">
            {/* Excerpt */}
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {post.excerpt}
            </p>

            {/* Main content */}
            <div className="text-gray-800 dark:text-gray-200 space-y-6 whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </article>
      </div>
    </PageTransition>
  )
}

export default BlogPostPage