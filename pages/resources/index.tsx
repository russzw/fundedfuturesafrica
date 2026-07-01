import React, { useState } from 'react';
import { Download, ExternalLink, PenTool, Search, MessageCircle, Award, BookOpen, FileText, ChevronDown, CheckCircle, Clock, Globe, Target, Users, Lightbulb, AlertTriangle } from 'lucide-react';

const ExpandableCard = ({
  icon,
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`bg-white dark:bg-slate-800 darker:bg-zinc-950 rounded-2xl border transition-all duration-300 ${
      isOpen
        ? 'border-emerald-400 dark:border-emerald-600 shadow-card-hover'
        : 'border-slate-200 dark:border-slate-700 darker:border-zinc-800 shadow-card hover:shadow-card-hover'
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center gap-4 text-left"
      >
        <div className="bg-emerald-50 dark:bg-emerald-900/30 darker:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-xl font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 darker:text-zinc-400 mt-0.5">{subtitle}</p>
        </div>
        <ChevronDown
          size={20}
          className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6 pt-0 border-t border-slate-100 dark:border-slate-700 darker:border-zinc-800">
          <div className="pt-5 text-slate-600 dark:text-slate-300 darker:text-zinc-300 space-y-5 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const TipItem = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-slate-50 dark:bg-slate-700/50 darker:bg-zinc-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-600 darker:border-zinc-800">
    <h4 className="font-heading font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100 mb-2">{title}</h4>
    <div className="text-sm space-y-2">{children}</div>
  </div>
);

const CheckItem = ({ text, detail }: { text: string; detail?: string }) => (
  <div className="flex items-start gap-3">
    <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
    <div>
      <span className="text-sm font-medium text-slate-800 dark:text-slate-100 darker:text-zinc-100">{text}</span>
      {detail && <p className="text-xs text-slate-500 dark:text-slate-400 darker:text-zinc-400 mt-0.5">{detail}</p>}
    </div>
  </div>
);

const ResourcesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 darker:bg-black transition-colors duration-300">
      <header className="bg-gradient-to-br from-emerald-700 to-emerald-800 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute top-0 -left-40 w-96 h-96 bg-amber-400 rounded-full blur-3xl" /></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <BookOpen size={16} className="text-amber-400" /><span className="text-sm font-medium text-emerald-100">Application Success Center</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Application Success Center</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">Expert guidance and practical tools to help you craft a standout scholarship application.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* Application Tips */}
            <ExpandableCard
              icon={<PenTool size={24} />}
              title="Application Tips"
              subtitle="Master the art of writing winning scholarship applications"
              defaultOpen={true}
            >
              <TipItem title="Start Early and Plan Ahead">
                <p>Begin your application at least 2-3 months before the deadline. Create a timeline with milestones for each component: personal statement, recommendation letters, transcripts, and test scores. Rushed applications almost always show in the quality of writing.</p>
              </TipItem>

              <TipItem title="Research the Scholarship Provider">
                <p>Understand the mission, values, and goals of the organization offering the scholarship. Tailor your application to reflect what they care about. If they emphasize leadership, highlight your leadership experiences. If they focus on community service, emphasize your volunteer work.</p>
              </TipItem>

              <TipItem title="Write a Compelling Personal Statement">
                <p>Your personal statement is your chance to stand out. Follow this structure:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
                  <li><b>Hook:</b> Start with a compelling opening that grabs attention (a story, a challenge, or a defining moment).</li>
                  <li><b>Body:</b> Discuss your academic journey, achievements, and how they connect to your goals.</li>
                  <li><b>Why This Scholarship:</b> Explain specifically why you&apos;re applying and how it aligns with your aspirations.</li>
                  <li><b>Future Impact:</b> Describe how this scholarship will help you make a difference in your community or field.</li>
                </ul>
              </TipItem>

              <TipItem title="Quantify Your Achievements">
                <p>Numbers make your accomplishments concrete and memorable. Instead of saying &quot;I led a community project,&quot; say &quot;I organized a team of 12 volunteers to tutor 50 students, resulting in a 30% improvement in their exam scores.&quot;</p>
              </TipItem>

              <TipItem title="Tailor Every Application">
                <p>Never submit a generic application. Customize your essays, CV, and even your recommendation letter requests for each scholarship. Reviewers can easily tell when an application was mass-produced.</p>
              </TipItem>

              <TipItem title="Get Strong Recommendation Letters">
                <p>Choose recommenders who know you well and can speak to specific qualities. Provide them with:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
                  <li>Your resume/CV and personal statement draft</li>
                  <li>The scholarship&apos;s criteria and what they value</li>
                  <li>Specific examples of your work they can reference</li>
                  <li>At least 3-4 weeks advance notice</li>
                </ul>
              </TipItem>

              <TipItem title="Proofread Relentlessly">
                <p>Errors can undermine an otherwise strong application. Use tools like Grammarly, read your essay aloud, and have at least two other people review it. Check for grammar, spelling, clarity, and tone. Ensure every sentence adds value.</p>
              </TipItem>

              <div className="bg-amber-50 dark:bg-amber-900/20 darker:bg-amber-900/10 border border-amber-200 dark:border-amber-800 darker:border-amber-900/50 rounded-xl p-4 flex items-start gap-3">
                <Lightbulb size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="font-bold text-amber-800 dark:text-amber-300">Pro Tip:</span>{' '}
                  <span className="text-amber-700 dark:text-amber-400">Keep a master document with all your achievements, activities, and experiences. This makes it much faster to customize applications for different scholarships.</span>
                </div>
              </div>
            </ExpandableCard>

            {/* Interview Prep */}
            <ExpandableCard
              icon={<MessageCircle size={24} />}
              title="Interview Prep"
              subtitle="Ace your scholarship interview with confidence and poise"
            >
              <TipItem title="Before the Interview: Research">
                <p>Thorough preparation is the key to interview success. Research the scholarship organization, its mission, recent initiatives, and what past recipients have accomplished. Understand the selection criteria and prepare examples that demonstrate each one.</p>
              </TipItem>

              <TipItem title="Common Interview Questions">
                <p>Practice answering these frequently asked scholarship interview questions:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
                  <li>&quot;Tell us about yourself and your academic journey.&quot;</li>
                  <li>&quot;Why did you apply for this specific scholarship?&quot;</li>
                  <li>&quot;What are your short-term and long-term goals?&quot;</li>
                  <li>&quot;Describe a challenge you overcame and what you learned.&quot;</li>
                  <li>&quot;How will this scholarship help you achieve your goals?&quot;</li>
                  <li>&quot;What impact do you want to have on your community?&quot;</li>
                  <li>&quot;Tell us about a time you demonstrated leadership.&quot;</li>
                  <li>&quot;What makes you a strong candidate for this scholarship?&quot;</li>
                </ul>
              </TipItem>

              <TipItem title="The STAR Method">
                <p>Use the STAR framework to structure compelling answers about your experiences:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
                  <li><b>Situation:</b> Set the context. Where were you? What was happening?</li>
                  <li><b>Task:</b> What was your role or responsibility?</li>
                  <li><b>Action:</b> What specific steps did you take?</li>
                  <li><b>Result:</b> What was the outcome? Quantify if possible.</li>
                </ul>
              </TipItem>

              <TipItem title="Body Language and Delivery">
                <p>Non-verbal communication matters as much as your words:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
                  <li>Make eye contact with all interviewers, not just the one who asked the question.</li>
                  <li>Smile naturally and sit up straight to project confidence.</li>
                  <li>Speak clearly and at a moderate pace. Don&apos;t rush.</li>
                  <li>Nod to show you&apos;re listening when others speak.</li>
                  <li>Use hand gestures naturally to emphasize points.</li>
                  <li>Avoid fidgeting, crossing arms, or looking at your phone.</li>
                </ul>
              </TipItem>

              <TipItem title="Virtual Interview Tips">
                <p>If your interview is online, additional preparation is needed:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
                  <li>Test your internet, camera, and microphone the day before.</li>
                  <li>Choose a quiet, well-lit space with a neutral background.</li>
                  <li>Look at the camera (not the screen) to simulate eye contact.</li>
                  <li>Dress professionally from head to toe (you may need to stand up).</li>
                  <li>Have a copy of your resume and notes nearby for reference.</li>
                  <li>Close unnecessary browser tabs to prevent distractions.</li>
                </ul>
              </TipItem>

              <TipItem title="Questions to Ask the Interviewers">
                <p>Prepare 2-3 thoughtful questions to ask at the end. This shows genuine interest:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
                  <li>&quot;What qualities do successful scholarship recipients share?&quot;</li>
                  <li>&quot;How does this scholarship support students beyond financial aid?&quot;</li>
                  <li>&quot;Are there networking or mentorship opportunities with past recipients?&quot;</li>
                  <li>&quot;What advice would you give to incoming scholars?&quot;</li>
                </ul>
              </TipItem>

              <TipItem title="After the Interview">
                <p>Follow up within 24 hours:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
                  <li>Send a personalized thank-you email to each interviewer.</li>
                  <li>Reference specific topics discussed during the interview.</li>
                  <li>Reiterate your enthusiasm and gratitude for the opportunity.</li>
                  <li>Keep it brief (3-5 sentences) but sincere.</li>
                </ul>
              </TipItem>

              <div className="bg-amber-50 dark:bg-amber-900/20 darker:bg-amber-900/10 border border-amber-200 dark:border-amber-800 darker:border-amber-900/50 rounded-xl p-4 flex items-start gap-3">
                <Lightbulb size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="font-bold text-amber-800 dark:text-amber-300">Pro Tip:</span>{' '}
                  <span className="text-amber-700 dark:text-amber-400">Practice your answers out loud at least 3 times before the interview. Recording yourself helps you identify filler words, nervous habits, and areas to improve.</span>
                </div>
              </div>
            </ExpandableCard>

            {/* Application Checklist */}
            <ExpandableCard
              icon={<CheckCircle size={24} />}
              title="Application Checklist"
              subtitle="A comprehensive checklist to ensure nothing is missed"
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-heading font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100 mb-3 flex items-center gap-2">
                    <Target size={16} className="text-emerald-600 dark:text-emerald-400" />
                    Before You Start
                  </h4>
                  <div className="space-y-2.5">
                    <CheckItem text="Research the scholarship provider and their values" detail="Understand what they look for in candidates" />
                    <CheckItem text="Verify you meet ALL eligibility requirements" detail="Nationality, age, field of study, degree level, etc." />
                    <CheckItem text="Note the application deadline and set earlier personal deadlines" detail="At least 1 week before the actual deadline" />
                    <CheckItem text="Gather all required documents list" detail="Create a checklist of everything needed" />
                    <CheckItem text="Identify your recommenders and ask early" detail="Give them at least 3-4 weeks notice" />
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 darker:border-zinc-800 pt-4">
                  <h4 className="font-heading font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100 mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-emerald-600 dark:text-emerald-400" />
                    Required Documents
                  </h4>
                  <div className="space-y-2.5">
                    <CheckItem text="Completed application form" detail="Double-check every field before submitting" />
                    <CheckItem text="Personal statement / Statement of purpose" detail="Tailored to this specific scholarship" />
                    <CheckItem text="Updated CV / Resume" detail="Highlight relevant achievements and experiences" />
                    <CheckItem text="Academic transcripts and certificates" detail="Official copies if required" />
                    <CheckItem text="Recommendation letters (usually 2-3)" detail="From professors, employers, or community leaders" />
                    <CheckItem text="Proof of nationality / ID document" detail="Passport copy or national ID" />
                    <CheckItem text="English proficiency test scores" detail="IELTS, TOEFL, or equivalent if applicable" />
                    <CheckItem text="Standardized test scores" detail="GRE, GMAT, SAT, etc. if required" />
                    <CheckItem text="Passport-sized photographs" detail="Check specific requirements for format" />
                    <CheckItem text="Research proposal or study plan" detail="For research-based or graduate scholarships" />
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 darker:border-zinc-800 pt-4">
                  <h4 className="font-heading font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100 mb-3 flex items-center gap-2">
                    <PenTool size={16} className="text-emerald-600 dark:text-emerald-400" />
                    Writing Your Application
                  </h4>
                  <div className="space-y-2.5">
                    <CheckItem text="Write a compelling opening hook" detail="Start with a story, challenge, or defining moment" />
                    <CheckItem text="Connect your goals to the scholarship&apos;s mission" detail="Show alignment between your aspirations and their values" />
                    <CheckItem text="Quantify achievements with specific numbers" detail="e.g., &quot;Led a team of 10...&quot; &quot;Raised $5,000...&quot;" />
                    <CheckItem text="Show, don&apos;t just tell" detail="Use specific examples and anecdotes" />
                    <CheckItem text="Address any weaknesses proactively" detail="Turn potential negatives into growth stories" />
                    <CheckItem text="Stay within the word/character limit" detail="Going over shows inability to follow instructions" />
                    <CheckItem text="Have someone else proofread your essays" detail="Fresh eyes catch errors and unclear phrasing" />
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 darker:border-zinc-800 pt-4">
                  <h4 className="font-heading font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100 mb-3 flex items-center gap-2">
                    <Clock size={16} className="text-emerald-600 dark:text-emerald-400" />
                    Final Submission
                  </h4>
                  <div className="space-y-2.5">
                    <CheckItem text="Review the entire application one final time" detail="Check for consistency, accuracy, and completeness" />
                    <CheckItem text="Verify all files are in the correct format" detail="PDF, DOCX, etc. as specified" />
                    <CheckItem text="Confirm file sizes meet upload requirements" detail="Compress images if needed" />
                    <CheckItem text="Save a copy of everything you submit" detail="Screenshot or PDF your application before submitting" />
                    <CheckItem text="Submit at least 2-3 days before the deadline" detail="Technical issues happen — don&apos;t wait until the last minute" />
                    <CheckItem text="Save the confirmation email or receipt" detail="You may need it for follow-up" />
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 darker:bg-amber-900/10 border border-amber-200 dark:border-amber-800 darker:border-amber-900/50 rounded-xl p-4 flex items-start gap-3 mt-4">
                <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="font-bold text-amber-800 dark:text-amber-300">Important:</span>{' '}
                  <span className="text-amber-700 dark:text-amber-400">Never submit a generic application. Tailoring your materials to each specific scholarship significantly increases your chances of success.</span>
                </div>
              </div>
            </ExpandableCard>

          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Quick Reference Sidebar */}
            <div className="bg-white dark:bg-slate-800 darker:bg-zinc-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 darker:border-zinc-800 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 darker:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                  <FileText className="text-emerald-600 dark:text-emerald-400" size={20} />
                </div>
                <h3 className="font-heading font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100">Download Checklist</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 darker:text-zinc-400 mb-6">Get a printable PDF version of the complete application checklist.</p>
              <a href="/FundedFutures_Application_Checklist.pdf" download className="w-full btn-primary justify-center text-sm">
                <Download size={16} /> Download PDF
              </a>
            </div>

            {/* Featured Scholarship */}
            <div className="bg-white dark:bg-slate-800 darker:bg-zinc-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 darker:border-zinc-800 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 darker:bg-amber-900/20 rounded-xl flex items-center justify-center">
                  <Award className="text-amber-600 dark:text-amber-400" size={20} />
                </div>
                <h3 className="font-heading font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100">Featured Scholarship</h3>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 darker:text-zinc-100">Commonwealth Scholarship</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 darker:text-zinc-400 leading-relaxed">A prestigious award for Masters and PhD study in the UK. Covers tuition fees, living expenses, travel, and thesis grants.</p>
                <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors">
                  Learn More <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Key Deadlines */}
            <div className="bg-white dark:bg-slate-800 darker:bg-zinc-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 darker:border-zinc-800 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 darker:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <Globe className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <h3 className="font-heading font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100">Key Resources</h3>
              </div>
              <div className="space-y-3 text-sm">
                <a href="https://www.scholarshipscanada.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 darker:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <ExternalLink size={14} className="flex-shrink-0" /> Scholarships Canada
                </a>
                <a href="https://www.fulbright.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 darker:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <ExternalLink size={14} className="flex-shrink-0" /> Fulbright Program
                </a>
                <a href="https://www.daad.de/en/study-and-research-in-germany/scholarships/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 darker:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <ExternalLink size={14} className="flex-shrink-0" /> DAAD Scholarships
                </a>
                <a href="https://www.chevening.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 darker:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <ExternalLink size={14} className="flex-shrink-0" /> Chevening Scholarships
                </a>
                <a href="https://www.studyinholland.nl/finances/scholarships" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 darker:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <ExternalLink size={14} className="flex-shrink-0" /> Study in Holland
                </a>
              </div>
            </div>

            {/* Quick Tip */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 rounded-2xl text-white">
              <h3 className="font-heading font-bold mb-3 flex items-center gap-2">
                <Lightbulb size={18} /> Quick Tip
              </h3>
              <p className="text-sm text-emerald-100 leading-relaxed">
                Keep a running document of all your achievements, activities, and experiences. Update it monthly. When a scholarship deadline arrives, you&apos;ll have everything ready to customize a winning application in hours instead of days.
              </p>
            </div>

            {/* Community */}
            <div className="bg-white dark:bg-slate-800 darker:bg-zinc-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 darker:border-zinc-800 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 darker:bg-purple-900/20 rounded-xl flex items-center justify-center">
                  <Users className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
                <h3 className="font-heading font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100">Stay Connected</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 darker:text-zinc-400 leading-relaxed mb-4">
                Join our community of African scholars. Get the latest scholarship opportunities delivered to you.
              </p>
              <a href="mailto:info@fundedfuturesafrica.com" className="w-full btn-secondary justify-center text-sm">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResourcesPage;
