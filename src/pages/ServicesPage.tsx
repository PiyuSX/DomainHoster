import { motion } from 'framer-motion'
import { Code, Smartphone, Palette, Search, Server, Cloud, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const ServicesPage = () => {
  const services = [
    {
      icon: <Code className="w-12 h-12 text-primary-light" />,
      title: 'Website Development',
      description: 'Custom-built websites that perfectly align with your business goals. We specialize in responsive design, e-commerce solutions, and content management systems.',
      features: [
        'Custom Web Applications',
        'E-commerce Solutions',
        'CMS Development',
        'Progressive Web Apps'
      ]
    },
    {
      icon: <Smartphone className="w-12 h-12 text-primary-light" />,
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications that provide seamless user experiences across all devices.',
      features: [
        'iOS Development',
        'Android Development',
        'Cross-platform Solutions',
        'App Maintenance'
      ]
    },
    {
      icon: <Palette className="w-12 h-12 text-primary-light" />,
      title: 'UI/UX Design',
      description: 'User-centered design solutions that create engaging and intuitive digital experiences.',
      features: [
        'User Interface Design',
        'User Experience Design',
        'Wireframing',
        'Prototyping'
      ]
    },
    {
      icon: <Search className="w-12 h-12 text-primary-light" />,
      title: 'SEO & Digital Marketing',
      description: 'Comprehensive digital marketing strategies to improve your online presence and drive growth.',
      features: [
        'Search Engine Optimization',
        'Content Marketing',
        'Social Media Marketing',
        'Analytics & Reporting'
      ]
    },
    {
      icon: <Server className="w-12 h-12 text-primary-light" />,
      title: 'Custom Software',
      description: 'Tailored software solutions designed to streamline your business processes and boost efficiency.',
      features: [
        'Enterprise Software',
        'API Development',
        'Integration Services',
        'Legacy System Updates'
      ]
    },
    {
      icon: <Cloud className="w-12 h-12 text-primary-light" />,
      title: 'Cloud Solutions',
      description: 'Secure and scalable cloud hosting solutions to power your digital infrastructure.',
      features: [
        'Cloud Hosting',
        'AWS Solutions',
        'Azure Services',
        'Cloud Migration'
      ]
    }
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-100"
          >
            Comprehensive digital solutions for modern businesses
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-secondary-DEFAULT dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-secondary-light dark:bg-gray-800 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-6">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{service.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-800 dark:text-gray-200">
                      <ArrowRight className="w-4 h-4 text-primary-light mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Start Your Project?</h2>
          <p className="text-xl text-gray-100 mb-8">
            Let's discuss how we can help you achieve your digital goals
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 text-primary-DEFAULT bg-white rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
          >
            Get in Touch
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default ServicesPage