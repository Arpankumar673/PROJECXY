import React, { useState } from 'react';
import { X, Plus, Hash } from 'lucide-react';
import { cn } from '../ui';

export const SkillsInput = ({ skills = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const addSkill = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setInputValue('');
    }
  };

  const removeSkill = (skillToRemove) => {
    onChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-projecxy-secondary opacity-50 pl-1">
        Institutional Skills Matrix
      </label>
      
      <div className="flex flex-wrap gap-2 min-h-[56px] p-2 bg-gray-50/50 border border-gray-100 rounded-[24px] shadow-inner">
        {skills.map((skill, index) => (
          <span 
            key={index} 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-100 text-projecxy-blue text-[11px] font-black uppercase tracking-widest rounded-xl shadow-soft group animate-in zoom-in duration-300"
          >
            <Hash className="w-3.5 h-3.5 opacity-40" />
            {skill}
            <button 
              onClick={() => removeSkill(skill)}
              className="p-1 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={skills.length === 0 ? "Add your core expertise (e.g. React)..." : "Add more..."}
          className="flex-1 min-w-[150px] bg-transparent border-none outline-none px-4 text-sm font-bold text-projecxy-text placeholder:text-gray-300 placeholder:font-medium"
        />
        
        <button 
          onClick={addSkill}
          disabled={!inputValue.trim()}
          className="w-10 h-10 bg-projecxy-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 disabled:opacity-30 disabled:shadow-none transition-all active:scale-90"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-2">
        Press Enter or click + to synchronize your expertise
      </p>
    </div>
  );
};
