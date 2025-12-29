export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyId?: string;
  status: "lead" | "customer" | "churned";
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  contactName: string;
  stageId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineStage {
  id: string;
  title: string;
  order: number;
}

export interface Pipeline {
  id: string;
  stages: PipelineStage[];
  deals: Deal[];
}
