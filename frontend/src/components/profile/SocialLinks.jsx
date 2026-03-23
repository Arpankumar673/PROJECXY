import React from 'react';
import { Github, Linkedin, Twitter, Globe, ExternalLink, Plus } from 'lucide-react';
import { cn } from '../ui';

const SocialIcon = ({ type }) => {
  switch (type) {
    case 'github': return <Github className="w-5 h-5" />;
    case 'linkedin': return <Linkedin className="w-5 h-5" />;
    case 'twitter': return <Twitter className="w-5 h-5" />;
    case 'portfolio': return <Globe className="w-5 h-5" />;
    default: return <ExternalLink className="w-5 h-5" />;
  }
};

export const SocialLinks = ({ links = {}, editable = false, onChange }) => {
  const configs = [
    { key: 'github_url', label: 'GitHub Profile', type: 'github', placeholder: 'https://github.com/username' },
    { key: 'linkedin_url', label: 'LinkedIn Network', type: 'linkedin', placeholder: 'https://linkedin.com/in/username' },
    { key: 'twitter_url', label: 'X (Twitter) Feed', type: 'twitter', placeholder: 'https://twitter.com/username' },
    { key: 'portfolio_url', label: 'Innovation Portfolio', type: 'portfolio', placeholder: 'https://personal-site.com' },
  ];

  if (!editable) {
    return (
      <div className="flex flex-wrap gap-4 pt-4">
        {configs.map(config => {
          const url = links[config.key];
          if (!url) return null;
          return (
            <a 
              key={config.key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-projecxy-blue/10 hover:text-projecxy-blue hover:-translate-y-1 transition-all group shadow-sm hover:shadow-lg border border-transparent hover:border-projecxy-blue/20"
              title={config.label}
            >
              <SocialIcon type={config.type} />
            </a>
          );
        })}
        {configs.every(c => !links[c.key]) && (
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 px-2 opacity-50">No digital footprints synchronized</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 pt-4">
      {configs.map(config => (
        <div key={config.key} className="space-y-2 group">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 opacity-60 pl-1 group-focus-within:text-projecxy-blue transition-colors">
            {config.label}
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-projecxy-blue transition-colors">
              <SocialIcon type={config.type} />
            </div>
            <input 
              type="url"
              value={links[config.key] || ''}
              onChange={(e) => onChange({ ...links, [config.key]: e.target.value })}
              placeholder={config.placeholder}
              className="w-full h-14 pl-12 pr-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-projecxy-blue outline-none transition-all shadow-soft placeholder:text-gray-300 text-sm font-medium"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
