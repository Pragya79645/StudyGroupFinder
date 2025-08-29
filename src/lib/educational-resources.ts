// Educational resource database for AI suggestions
export const educationalResources = {
  // Mathematics
  mathematics: {
    'calculus': [
      {
        title: 'Khan Academy - Calculus',
        url: 'https://www.khanacademy.org/math/calculus-1',
        description: 'Comprehensive calculus course with practice problems'
      },
      {
        title: 'Paul\'s Online Math Notes - Calculus I',
        url: 'https://tutorial.math.lamar.edu/Classes/CalcI/CalcI.aspx',
        description: 'Detailed calculus notes with examples and practice problems'
      },
      {
        title: 'MIT OCW - Single Variable Calculus',
        url: 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/',
        description: 'MIT\'s complete single variable calculus course'
      }
    ],
    'algebra': [
      {
        title: 'Khan Academy - Algebra',
        url: 'https://www.khanacademy.org/math/algebra',
        description: 'Complete algebra course from basics to advanced topics'
      },
      {
        title: 'Purplemath - Algebra Lessons',
        url: 'https://www.purplemath.com/modules/',
        description: 'Step-by-step algebra tutorials and examples'
      }
    ],
    'statistics': [
      {
        title: 'Khan Academy - Statistics',
        url: 'https://www.khanacademy.org/math/statistics-probability',
        description: 'Statistics and probability with interactive exercises'
      },
      {
        title: 'StatTrek - Statistics Tutorial',
        url: 'https://stattrek.com/',
        description: 'Comprehensive statistics tutorials and tools'
      }
    ]
  },

  // Computer Science
  computerScience: {
    'programming': [
      {
        title: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/',
        description: 'Free coding bootcamp with hands-on projects'
      },
      {
        title: 'Codecademy',
        url: 'https://www.codecademy.com/',
        description: 'Interactive coding lessons and projects'
      }
    ],
    'dataStructures': [
      {
        title: 'VisuAlgo - Data Structures Visualizations',
        url: 'https://visualgo.net/',
        description: 'Interactive visualizations of data structures and algorithms'
      },
      {
        title: 'GeeksforGeeks - Data Structures',
        url: 'https://www.geeksforgeeks.org/data-structures/',
        description: 'Comprehensive data structures tutorials with examples'
      }
    ],
    'algorithms': [
      {
        title: 'Algorithm Visualizer',
        url: 'https://algorithm-visualizer.org/',
        description: 'Interactive algorithm visualizations'
      },
      {
        title: 'LeetCode',
        url: 'https://leetcode.com/',
        description: 'Programming practice problems and solutions'
      }
    ]
  },

  // Physics
  physics: [
    {
      title: 'Khan Academy - Physics',
      url: 'https://www.khanacademy.org/science/physics',
      description: 'Complete physics course with simulations'
    },
    {
      title: 'PhET Interactive Simulations',
      url: 'https://phet.colorado.edu/',
      description: 'Interactive physics simulations from University of Colorado'
    },
    {
      title: 'MIT OCW - Physics',
      url: 'https://ocw.mit.edu/courses/physics/',
      description: 'MIT physics courses and materials'
    }
  ],

  // Chemistry
  chemistry: [
    {
      title: 'Khan Academy - Chemistry',
      url: 'https://www.khanacademy.org/science/chemistry',
      description: 'Complete chemistry course with practice problems'
    },
    {
      title: 'ChemCollective',
      url: 'http://chemcollective.org/',
      description: 'Virtual chemistry labs and simulations'
    },
    {
      title: 'Organic Chemistry Portal',
      url: 'https://www.organic-chemistry.org/',
      description: 'Comprehensive organic chemistry resources'
    }
  ],

  // Biology
  biology: [
    {
      title: 'Khan Academy - Biology',
      url: 'https://www.khanacademy.org/science/biology',
      description: 'Complete biology course with interactive content'
    },
    {
      title: 'Crash Course Biology',
      url: 'https://www.youtube.com/playlist?list=PL3EED4C1D684D3ADF',
      description: 'Engaging biology video series by Hank Green'
    },
    {
      title: 'MIT OCW - Biology',
      url: 'https://ocw.mit.edu/courses/biology/',
      description: 'MIT biology courses and resources'
    }
  ],

  // General Study Resources
  general: [
    {
      title: 'Coursera',
      url: 'https://www.coursera.org/',
      description: 'University-level courses from top institutions'
    },
    {
      title: 'edX',
      url: 'https://www.edx.org/',
      description: 'High-quality courses from universities worldwide'
    },
    {
      title: 'YouTube Education',
      url: 'https://www.youtube.com/education',
      description: 'Educational content from trusted creators'
    },
    {
      title: 'Wikipedia',
      url: 'https://en.wikipedia.org/',
      description: 'Comprehensive encyclopedia with reliable information'
    }
  ]
};

export function getResourcesForTopic(topic: string): Array<{title: string, url: string, description: string}> {
  const lowerTopic = topic.toLowerCase();
  
  // Check specific subjects first
  for (const [subject, resources] of Object.entries(educationalResources)) {
    if (subject === 'general') continue;
    
    if (typeof resources === 'object' && !Array.isArray(resources)) {
      // This is a subject with subtopics (like mathematics)
      for (const [subtopic, links] of Object.entries(resources)) {
        if (lowerTopic.includes(subtopic) || subtopic.includes(lowerTopic)) {
          return links as Array<{title: string, url: string, description: string}>;
        }
      }
      
      // If no specific subtopic matches, check if the main subject matches
      if (lowerTopic.includes(subject) || subject.includes(lowerTopic.replace('computer science', 'computerscience'))) {
        // Return the first subtopic's resources as a fallback
        const firstSubtopic = Object.values(resources)[0];
        return firstSubtopic as Array<{title: string, url: string, description: string}>;
      }
    } else if (Array.isArray(resources)) {
      // This is a direct subject array (like physics, chemistry)
      if (lowerTopic.includes(subject) || subject.includes(lowerTopic)) {
        return resources;
      }
    }
  }
  
  // Return general resources if no specific match found
  return educationalResources.general.slice(0, 2); // Return first 2 general resources
}
