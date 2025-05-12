export interface Skill {
  id: string;
  title: string;
  category: 'frontend' | 'backend' | 'general'  | 'non-technology';
  description: string;
  topics: string[];
}

export const skills: Skill[] = [
  {
    id: 'react',
    title: 'React',
    category: 'frontend',
    description: 'Modern UI development with React, including hooks, context, and state management',
    topics: ['Hooks', 'Context API', 'Redux', 'Performance Optimization', 'Component Patterns']
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    category: 'frontend',
    description: 'Type-safe JavaScript development with TypeScript features and best practices',
    topics: ['Types & Interfaces', 'Generics', 'Decorators', 'Type Guards', 'Advanced Types']
  },
  {
    id: 'javascript',
    title: 'JavaScript',
    category: 'frontend',
    description: 'Core JavaScript concepts, ES6+ features, and modern development practices',
    topics: ['ES6+', 'Async/Await', 'Closures', 'Promises', 'DOM Manipulation']
  },
  {
    id: 'csharp',
    title: 'C#',
    category: 'backend',
    description: 'Object-oriented programming with C# and .NET ecosystem',
    topics: ['LINQ', 'Async/Await', 'Generics', 'Collections', 'Memory Management']
  },
  {
    id: 'dotnet',
    title: '.NET',
    category: 'backend',
    description: 'Building scalable applications with .NET Core and related technologies',
    topics: ['ASP.NET Core', 'Entity Framework', 'Dependency Injection', 'Middleware', 'Web APIs']
  },
  {
    id: 'sql',
    title: 'SQL',
    category: 'backend',
    description: 'Database design, optimization, and advanced SQL concepts',
    topics: ['Query Optimization', 'Stored Procedures', 'Indexing', 'Transactions', 'Database Design']
  },
  {
    id: 'patterns',
    title: 'Design Patterns',
    category: 'general',
    description: 'Software design patterns and architectural principles',
    topics: ['SOLID Principles', 'Gang of Four', 'Architectural Patterns', 'DDD', 'Clean Architecture']
  },
  {
    id: 'algorithms',
    title: 'Algorithms & Data Structures',
    category: 'general',
    description: 'Fundamental algorithms and data structures for efficient problem-solving',
    topics: ['Time Complexity', 'Space Complexity', 'Search/Sort', 'Dynamic Programming', 'Graph Algorithms']
  },
  {
    id: 'nodejs',
    title: 'Node.js',
    category: 'backend',
    description: 'Server-side JavaScript development with Node.js ecosystem',
    topics: ['Express.js', 'Event Loop', 'Streams', 'Async Programming', 'RESTful APIs']
  },
  {
    id: 'python',
    title: 'Python',
    category: 'backend',
    description: 'Python programming with focus on backend development and automation',
    topics: ['Django/Flask', 'Data Structures', 'OOP in Python', 'Decorators', 'Package Management']
  },
  {
    id: 'cpp',
    title: 'C++',
    category: 'backend',
    description: 'Modern C++ programming and systems development',
    topics: ['Memory Management', 'STL', 'Templates', 'Multi-threading', 'Smart Pointers']
  },
  {
    id: 'git',
    title: 'Git',
    category: 'general',
    description: 'Version control and collaborative development with Git',
    topics: ['Branching Strategies', 'Merge Conflicts', 'Git Flow', 'Advanced Commands', 'Best Practices']
  },
   {
    id: 'real estate',
    title: 'Real Estate',
    category: 'non-technology',
    description: 'Real estate principles and practices',
    topics: ['Property Valuation', 'Market Analysis', 'Investment Strategies', 'Real Estate Law', 'Financing Options']
  },
   {
    id: 'plumbing',
    title: 'Plumbing',
    category: 'non-technology',
    description: 'Plumbing principles and practices',
    topics: ['Pipe Fitting', 'Drainage Systems', 'Water Supply', 'Plumbing Codes', 'Fixture Installation']
  },
  {
    id: 'electrician',
    title: 'Electrician',
    category: 'non-technology',
    description: 'Electrical principles and practices',
    topics: ['Circuit Design', 'Wiring', 'Electrical Codes', 'Troubleshooting', 'Safety Practices']
  },
  {
    id: 'Filmmaking',
    title: 'Filmmaking',  
    category: 'non-technology',
    description: 'Filmmaking principles and practices',
    topics: ['Cinematography', 'Editing', 'Screenwriting', 'Directing', 'Production Design']
  },
  {
    id: 'Acting',
    title: 'Acting',
    category: 'non-technology',
    description: 'Acting principles and practices',
    topics: ['Character Development', 'Improvisation', 'Voice Training', 'Stage Presence', 'Script Analysis']
  },
  {
    id: 'Day-Trading',
    title: 'Day Trading',
    category: 'non-technology',
    description: 'Day trading principles and practices',
    topics: ['Technical Analysis', 'Risk Management', 'Trading Strategies', 'Market Trends', 'Psychology of Trading']
  },
  {
    id: 'Car Maintenance',
    title: 'Car Maintenance', 
    category: 'non-technology',
    description: 'Car maintenance principles and practices',
    topics: ['Oil Change', 'Tire Rotation', 'Brake Inspection', 'Fluid Checks', 'Battery Maintenance']
  }

];
