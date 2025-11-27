'use client';

import React from 'react';
import { Globe, Users, Target, Handshake, Mail, Send } from 'lucide-react';

const TeamMemberCard = ({ name, role, imageUrl }: { name: string, role: string, imageUrl: string }) => (
    <div className="text-center">
        <img src={imageUrl} alt={name} className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg object-cover" />
        <h4 className="text-lg font-semibold text-slate-800">{name}</h4>
        <p className="text-brand-600 font-medium">{role}</p>
    </div>
);

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">About Funded Futures<span className="text-brand-600"> Africa</span></h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                We are dedicated to breaking down the financial barriers that prevent talented African students from accessing world-class education.
            </p>
        </div>
      </header>

      {/* Mission and Vision Section */}
      <section className="bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 items-center">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Target size={28} className="text-brand-600" />
                        <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
                    </div>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        To expand access to world-class education for African students by making scholarship information clear, reliable, and easy to navigate. We believe that financial constraints should never limit potential.
                    </p>
                </div>
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Globe size={28} className="text-brand-600" />
                         <h2 className="text-3xl font-bold text-slate-900">Our Vision</h2>
                    </div>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        A future where every talented student from Africa has the opportunity to achieve their educational and career aspirations, creating a new generation of leaders who will drive positive change across the continent.
                    </p>
                </div>
            </div>
          </div>
      </section>
      
      {/* Our Story Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Our Story</h2>
                    <div className="space-y-4 text-slate-600 leading-relaxed">
                        <p>Funded Futures Africa was born from a simple observation: while countless scholarships exist, the information is often scattered, outdated, or difficult to verify. Our founder, a former international student, experienced this frustration firsthand.</p>
                        <p>Determined to solve this problem, a team of educators, technologists, and former scholarship recipients came together. We spent months building a platform that not only aggregates opportunities but also vets them for legitimacy and clarity.</p>
                        <p>Today, Funded Futures Africa is more than just a database; it's a community and a support system for the next generation of African leaders. We are proud to have helped thousands of students move one step closer to their dreams.</p>
                    </div>
                </div>
                <div className="rounded-xl overflow-hidden shadow-2xl transform md:rotate-3 hover:rotate-0 transition-transform duration-500">
                     <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1740&auto=format&fit=crop" alt="Team working" className="w-full h-full object-cover"/>
                </div>
            </div>
        </div>
      </section>

       {/* Team Section */}
        <section className="bg-slate-50 py-20 md:py-28 border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Meet Our Team</h2>
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">We are a passionate team of professionals dedicated to your success.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
                   <TeamMemberCard name="Dr. Evelyn Adebayo" role="Founder & CEO" imageUrl="https://randomuser.me/api/portraits/women/60.jpg" />
                   <TeamMemberCard name="Samuel K. Mensah" role="Head of Technology" imageUrl="https://randomuser.me/api/portraits/men/75.jpg" />
                   <TeamMemberCard name="Amina El-Sayed" role="Director of Partnerships" imageUrl="https://randomuser.me/api/portraits/women/78.jpg" />
                   <TeamMemberCard name="David Chen" role="Lead Developer" imageUrl="https://randomuser.me/api/portraits/men/80.jpg" />
                </div>
            </div>
        </section>

      {/* Contact Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Get in Touch</h2>
              <p className="mt-4 text-lg text-slate-600">Have questions or want to partner with us? We'd love to hear from you.</p>
            </div>
            <div className="text-center">
                <a href="mailto:info@fundedfuturesafrica.com" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-600 text-white rounded-full text-base font-semibold hover:bg-brand-700 hover:shadow-lg active:scale-95 transition-all duration-200 ease-out">
                  <Mail size={18}/> Contact Us
                </a>
            </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
