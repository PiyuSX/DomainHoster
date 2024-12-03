import { motion } from 'framer-motion'
import { ArrowRight, Code, Smartphone, Palette, Search, Server, Cloud, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import { useEffect, useRef } from 'react'
import Typed from 'typed.js'

const HomePage = () => {
  const typedRef = useRef(null)

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        'Website',
        'Mobile App',
        'UI/UX Design',
        'Cloud Solutions',
        'Custom Software'
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1500,
      loop: true,
    })

    return () => {
      typed.destroy()
    }
  }, [])

  const services = [
    {
      icon: <Code className="w-8 h-8 text-primary-light" />,
      title: 'Website Development',
      description: 'Custom websites, e-commerce solutions, and CMS development'
    },
    {
      icon: <Smartphone className="w-8 h-8 text-primary-light" />,
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications'
    },
    {
      icon: <Palette className="w-8 h-8 text-primary-light" />,
      title: 'UI/UX Design',
      description: 'User-centered design solutions for web and mobile'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <PageTransition>
      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-light dark:bg-gradient-dark min-h-[80vh] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.h1 
                  className="text-5xl lg:text-6xl font-bold mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-primary-dark">
                    We make{' '}
                  </span>
                  <br />
                  <span 
                    ref={typedRef}
                    className="bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-primary-dark"
                  ></span>
                  <span className="typing-cursor">|</span>
                </motion.h1>
                <motion.p 
                  className="text-xl mb-8 text-gray-600 dark:text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  We create powerful digital solutions that help businesses thrive in the modern world. Our expertise brings your vision to life.
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <Link
                    to="/services"
                    className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-white bg-primary-light border-2 border-primary-light rounded-lg hover:bg-transparent hover:text-primary-light transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-opacity-50"
                  >
                    Get Started
                    <ArrowRight className="ml-2" />
                  </Link>
                  <Link
                    to="/portfolio"
                    className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-primary-light border-2 border-primary-light rounded-lg hover:bg-primary-light hover:text-white transition-colors duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-opacity-50"
                  >
                    View Our Work
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Hero"
                  className="w-full h-[400px] rounded-2xl object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Preview Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Services
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Comprehensive digital solutions for your business
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ y: -5 }}
                >
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-primary">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-gray-100 mb-8">
              Let's discuss how we can help you achieve your digital goals
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 text-lg font-medium bg-white text-primary-light rounded-lg hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              >
                Contact Us
                <ArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </PageTransition>
  )
}

export default HomePage