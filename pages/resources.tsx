import React from 'react';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
    <h1 className="text-3xl font-bold text-slate-900 mb-4">{title}</h1>
    <p className="text-slate-500 max-w-md">
      This page is currently under development. Please check back later for updates or visit the Scholarships page to see available opportunities.
    </p>
  </div>
);

const ResourcesPage: React.FC = () => {
    return <PlaceholderPage title="Student Resources" />;
};

export default ResourcesPage;