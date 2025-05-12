interface Skill {
  id: string;
  title: string;
  category: 'frontend' | 'backend' | 'general';
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
  }
];
