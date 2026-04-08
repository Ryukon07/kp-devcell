import { useState } from 'react'

const resources = [
  {
    id: 1,
    category: 'Web Development',
    description: 'Frontend and backend development resources',
    items: [
      { title: 'HTML & CSS Basics', type: 'PDF', link: '#' },
      { title: 'JavaScript Fundamentals', type: 'PDF', link: '#' },
      { title: 'React Introduction', type: 'PPT', link: '#' },
      { title: 'Node.js & Express', type: 'PDF', link: '#' },
    ]
  },
  {
    id: 2,
    category: 'Data Structures & Algorithms',
    description: 'DSA concepts and practice material',
    items: [
      { title: 'Arrays and Strings', type: 'PDF', link: '#' },
      { title: 'Trees and Graphs', type: 'PDF', link: '#' },
      { title: 'Dynamic Programming', type: 'PPT', link: '#' },
    ]
  },
  {
    id: 3,
    category: 'AI & Machine Learning',
    description: 'Introduction to AI/ML concepts',
    items: [
      { title: 'Python for ML', type: 'PDF', link: '#' },
      { title: 'Neural Networks Basics', type: 'PPT', link: '#' },
      { title: 'Prompt Engineering', type: 'PDF', link: '#' },
    ]
  },
  {
    id: 4,
    category: 'Dev Tools',
    description: 'Git, Docker, Linux and other tools',
    items: [
      { title: 'Git & GitHub Guide', type: 'PDF', link: '#' },
      { title: 'Docker Introduction', type: 'PPT', link: '#' },
      { title: 'Linux Command Line', type: 'PDF', link: '#' },
    ]
  }
]

const typeColors = {
  PDF: 'bg-red-900 text-red-400',
  PPT: 'bg-orange-900 text-orange-400',
  VIDEO: 'bg-blue-900 text-blue-400',
  LINK: 'bg-green-900 text-green-400',
}

function ResourcesPage() {
  const [openCategory, setOpenCategory] = useState(null)

  const toggleCategory = (id) => {
    setOpenCategory(prev => prev === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Resources</h1>
          <p className="text-gray-400">Study material and references shared by KP Dev Cell</p>
        </div>

        <div className="flex flex-col gap-4">
          {resources.map(resource => (
            <div
              key={resource.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(resource.id)}
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-800 transition-colors"
              >
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-white">
                    {resource.category}
                  </h2>
                  <p className="text-gray-400 text-sm mt-0.5">
                    {resource.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-gray-500 text-sm">
                    {resource.items.length} items
                  </span>
                  <span className={`text-gray-400 transition-transform duration-200 ${
                    openCategory === resource.id ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </span>
                </div>
              </button>

              {openCategory === resource.id && (
                <div className="border-t border-gray-800">
                  {resource.items.map((item, index) => (
                    <a
                      key={index}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                          typeColors[item.type] || 'bg-gray-700 text-gray-400'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-gray-300 text-sm">{item.title}</span>
                      </div>
                      <span className="text-gray-500 text-sm">→</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 text-sm mt-12">
          More resources added regularly. Contact us to contribute.
        </p>

      </div>
    </div>
  )
}

export default ResourcesPage