



export interface CustomerIssue {
  id: string;
  customerID: string;
  customerName: string;
  customerPhone: string;
  issueDesc: string;
  reportedAt: string; // ISO string
  resolvedAt: string;
  createdBy: string;
  createduser: string;
  communicationMethod: number;
  issueStatus: number;
}

export interface SupportGuideline {
  resolutionStep: string;
  addedAt: Date;
  addedUserName: string;
  isAddedAsSupportGuideline: boolean;
}



