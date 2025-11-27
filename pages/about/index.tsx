'use client';

import { Shield, Target, Users } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
            About Funded Futures Africa
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
            Empowering the next generation of African leaders through accessible education and opportunities.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Mission */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-100 text-brand-600 mx-auto mb-6">
                <Target size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
              <p className="mt-4 text-slate-500">
                To bridge the information gap and connect African students with transformative scholarship opportunities that enable them to achieve their full potential.
              </p>
            </div>

            {/* Vision */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-100 text-brand-600 mx-auto mb-6">
                <Shield size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
              <p className="mt-4 text-slate-500">
                A future where every talented and driven African student has the resources to pursue higher education, regardless of their financial background.
              </p>
            </div>

            {/* Who We Are */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-100 text-brand-600 mx-auto mb-6">
                <Users size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Who We Are</h2>
              <p className="mt-4 text-slate-500">
                We are a passionate team of educators, technologists, and community builders dedicated to creating a centralized hub for scholarships available to Africans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
