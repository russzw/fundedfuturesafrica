export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  degree: string[];
  fundingAmount: string;
  deadline: string;
  location: string;
  externalLink: string;
  imageUrl?: string;
  description: string;
  createdAt: number;
}

export type ScholarshipFormData = Omit<Scholarship, 'id' | 'createdAt'>;

export interface NavItem {
  label: string;
  path: string;
}