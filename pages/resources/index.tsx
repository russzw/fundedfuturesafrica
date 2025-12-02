import React from 'react';
import { Check, Download, ExternalLink, PenTool, Search, MessageCircle, Award } from 'lucide-react';

const ResourceCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-brand-100 text-brand-700 p-3 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
    </div>
    <div className="text-slate-600 space-y-3 leading-relaxed">
        {children}
    </div>
  </div>
);

const ResourcesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-sky-800 to-brand-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Application Success Center</h1>
          <p className="mt-4 text-xl text-sky-100 max-w-3xl mx-auto">
            Expert guidance and practical tools to help you craft a standout scholarship application.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-12">

                <ResourceCard icon={<Search size={24}/>} title="Finding the Right Scholarship">
                    <p>The perfect scholarship is out there for you. The key is to be strategic in your search. Don&apos;t just look for funding; look for a program that aligns with your academic and career goals.</p>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li><b>Define Your Profile:</b> What are your academic strengths, research interests, and career aspirations? This will help you target relevant scholarships.</li>
                        <li><b>Use Smart Keywords:</b> Go beyond generic terms. Search for your specific field of study, target country, and unique personal attributes (e.g., &apos;women in STEM scholarship UK&apos;).</li>
                        <li><b>Check Eligibility Carefully:</b> Read the requirements thoroughly before you start an application. Pay close attention to deadlines, nationality, and academic prerequisites.</li>
                        <li><b>Look Beyond the Obvious:</b> Explore university-specific scholarships, government-funded programs, and corporate-sponsored awards.</li>
                    </ul>
                </ResourceCard>

                 <ResourceCard icon={<PenTool size={24}/>} title="Crafting a Winning Application">
                    <p>Your application is your first impression. It needs to be compelling, polished, and authentic. Tell your story in a way that makes the selection committee believe in your potential.</p>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li><b>The Personal Statement is Key:</b> This is your chance to shine. Structure it with a clear beginning (your motivation), middle (your experience and skills), and end (your future goals and how this scholarship helps).</li>
                        <li><b>Tailor Every Application:</b> Avoid a &quot;one-size-fits-all&quot; approach. Customize your essays and CV to match the specific scholarship&apos;s mission and values.</li>
                        <li><b>Quantify Your Achievements:</b> Instead of saying &quot;improved a process,&quot; say &quot;improved process efficiency by 30% by implementing a new system.&quot;</li>
                        <li><b>Proofread, Proofread, Proofread:</b> Typos and grammatical errors show a lack of attention to detail. Use tools like Grammarly and ask friends or mentors to review your documents.</li>
                    </ul>
                </ResourceCard>

                <ResourceCard icon={<MessageCircle size={24}/>} title="Preparing for the Interview">
                    <p>An interview invitation means you&apos;re a top candidate. This is your opportunity to bring your application to life and connect with the committee on a personal level.</p>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li><b>Research and Rehearse:</b> Understand the scholarship provider&apos;s mission. Prepare answers for common questions like &quot;Tell me about yourself,&quot; &quot;Why do you deserve this scholarship?&quot; and &quot;What are your long-term goals?&quot;</li>
                        <li><b>Practice the STAR Method:</b> When answering behavioral questions, describe the <b>S</b>ituation, <b>T</b>ask, <b>A</b>ction, and <b>R</b>esult. This provides a clear and impactful story.</li>
                        <li><b>Prepare Your Own Questions:</b> Asking thoughtful questions shows genuine interest. Ask about the program, alumni network, or specific research opportunities.</li>
                        <li><b>Send a Thank-You Note:</b> A brief, polite thank-you email within 24 hours of your interview can leave a lasting positive impression.</li>
                    </ul>
                </ResourceCard>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Check size={20} className="text-brand-600"/> Application Checklist</h3>
                    <p className="text-sm text-slate-600 mb-6">Stay organized and ensure you have everything you need for a successful application.</p>
                    <a href="/FundedFutures_Application_Checklist.pdf" download className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-colors duration-300 bg-brand-600 text-white hover:bg-brand-700 shadow-md hover:shadow-lg">
                        <Download size={18} />
                        Download PDF Checklist
                    </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                     <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Award size={20} className="text-brand-600"/> Featured Scholarship</h3>
                     <div className="space-y-3">
                        <h4 className="font-semibold text-slate-800">Commonwealth Scholarship</h4>
                        <p className="text-sm text-slate-500">A prestigious award for Masters and PhD study in the UK. Covers fees, living expenses, and travel.</p>
                        <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline">
                            Learn More <ExternalLink size={14}/>
                        </a>
                     </div>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
};

export default ResourcesPage;
