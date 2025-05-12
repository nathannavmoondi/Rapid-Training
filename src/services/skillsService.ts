import { skills } from '../data/skills';

export interface CustomSkill {
  id: string;
  title: string;
  category: 'frontend' | 'backend' | 'general' | 'non-technology';
  description: string;
  topics: string[];
}

export const getSkillTopics = (skillTitle: string): string[] => {
  // First check built-in skills
  const builtInSkill = skills.find(s => s.title.toLowerCase() === skillTitle.toLowerCase());
  if (builtInSkill) {
    return builtInSkill.topics;
  }

  // Then check localStorage for custom skills
  const customSkillsJson = localStorage.getItem('customSkills');
  if (customSkillsJson) {
    const customSkills = JSON.parse(customSkillsJson);
    const customSkill = customSkills.find((s: CustomSkill) => s.title.toLowerCase() === skillTitle.toLowerCase());
    if (customSkill) {
      return customSkill.topics;
    }
  }

  // Return default topics if skill not found
  return ['Basic Concepts', 'Best Practices', 'Common Patterns', 'Tools and Libraries', 'Advanced Topics'];
};

export const getAllSkills = () => {
  const customSkillsJson = localStorage.getItem('customSkills');
  const customSkills = customSkillsJson ? JSON.parse(customSkillsJson) : [];
  return [...skills, ...customSkills];
};

export const addCustomSkill = (title: string, category: 'frontend' | 'backend' | 'general' | 'non-technology'): void => {
  const newSkill: CustomSkill = {
    id: `custom-${Date.now()}`,
    title,
    category,
    description: `Custom ${title} skill`,
    topics: ['Basic Concepts', 'Best Practices', 'Common Patterns', 'Tools and Libraries', 'Advanced Topics']
  };

  const existingSkills = localStorage.getItem('customSkills');
  const customSkills = existingSkills ? JSON.parse(existingSkills) : [];
  const updatedSkills = [...customSkills, newSkill];
  localStorage.setItem('customSkills', JSON.stringify(updatedSkills));
};
