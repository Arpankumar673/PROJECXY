import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, ShieldCheck, Users, TrendingUp, ChevronRight, CheckCircle, Heart } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button, Card } from '../components/ui';

export const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { title: 'Duplicate Project Detection', icon: ShieldCheck, desc: 'Our AI-powered engine ensures your project topic is unique within your department.' },
    { title: 'Team Formation', icon: Users, desc: 'Find students with matching skills for your next project, or browse recruiting teams.' },
    { title: 'Mentorship Access', icon: TrendingUp, desc: 'Get guidance from experienced seniors or faculty to boost your learning and quality.' },
    { title: 'Academic Progress', icon: Rocket, desc: 'Streamlined lifecycle tracking from idea to final approval and grading.' },
  ];

  const benefits = {
     student: ['Build cross-functional teams', 'Earn through senior mentorship', 'Direct showcase to recruiters', 'One-click portfolio generation'],
     dept: ['Zero document redundancy', 'Automated progress reports', 'Centralized project archives', 'Real-time innovation metrics']
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-4 lg:px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-linkedin-blue text-sm font-semibold mb-8 animate-bounce">
          <Rocket className="w-4 h-4" />
          <span>The Academic OS for Innovations</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-extrabold text-[#1D2226] leading-tight max-w-4xl mx-auto mb-6">
          Every Great Project <span className="text-linkedin-blue italic">Starts with a Clean Idea.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Projecxy is the modern bridge between students, teams, and departments. Organize your college projects, recruit teammates, and ensure originality.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" onClick={() => navigate('/signup')} className="w-full sm:w-auto px-8 py-4">Get Started for Free</Button>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto group">
             Watch Demo
             <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        {/* Social Proof (Dummy) */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-12 text-gray-400 font-bold text-xl opacity-60">
           <span>UNIVERSITY OF OXFORD</span>
           <span>MIT HUB</span>
           <span>IIT DELHI</span>
           <span>STANFORD LABS</span>
        </div>
      </header>

      {/* Features Grid */}
      <section className="bg-linkedin-bg py-24 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How Projecxy Supercharges Your Campus</h2>
              <p className="text-gray-500">The first-ever centralized hub for academic product development.</p>
           </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <Card key={i} className="p-8 border border-gray-100 hover:shadow-xl transition-shadow group flex flex-col h-full bg-white">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-linkedin-blue mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Comparison */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
           <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                 <h2 className="text-3xl font-bold">For Students</h2>
                 <ul className="space-y-4">
                    {benefits.student.map((b, i) => (
                       <li key={i} className="flex items-center gap-3 text-gray-600">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>{b}</span>
                       </li>
                    ))}
                 </ul>
              </div>
              <div className="space-y-6">
                 <h2 className="text-3xl font-bold">For Departments</h2>
                 <ul className="space-y-4">
                    {benefits.dept.map((b, i) => (
                       <li key={i} className="flex items-center gap-3 text-gray-600">
                          <CheckCircle className="w-5 h-5 text-linkedin-blue flex-shrink-0" />
                          <span>{b}</span>
                       </li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-linkedin-bg border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-linkedin-blue font-bold text-2xl">
            <Rocket className="w-8 h-8" />
            <span>Projecxy</span>
          </div>
          <p className="text-gray-500 text-sm flex items-center gap-1">
             Build with <Heart className="w-4 h-4 text-red-500 fill-current" /> by the Projecxy Foundation &copy; 2026.
          </p>
          <div className="flex gap-8 text-gray-500 font-semibold text-sm">
             <a href="#" className="hover:text-linkedin-blue">Privacy Policy</a>
             <a href="#" className="hover:text-linkedin-blue">Terms</a>
             <a href="#" className="hover:text-linkedin-blue">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
