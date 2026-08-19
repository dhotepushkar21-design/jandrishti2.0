export type IssueCategory =
  | 'Pothole'
  | 'Damaged Road'
  | 'Streetlight'
  | 'Traffic Signal/CCTV'
  | 'Garbage'
  | 'Water Leakage'
  | 'Footpath'
  | 'Other';

export type IssueSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type ComplaintStatus =
  | 'Reported'
  | 'Routed'
  | 'Acknowledged'
  | 'Work Started'
  | 'Resolved'
  | 'Verified'
  | 'Reopened';

export interface LocationCoords {
  lat: number;
  lng: number;
  address: string;
  city: string;
  roadType: 'National Highway' | 'State Highway' | 'Municipal Arterial' | 'Colony Road' | 'Footpath / Public Space';
  landmark?: string;
}

export interface ResponsibleAuthority {
  name: string;
  code: string;
  department: string;
  jurisdiction: string;
  escalationOfficer: string;
  contactEmail: string;
}

export interface OfficerNote {
  id: string;
  timestamp: string;
  officerName: string;
  designation: string;
  comment: string;
  statusUpdate?: ComplaintStatus;
}

export interface Complaint {
  id: string; // e.g. JD-2026-0001
  category: IssueCategory;
  title: string;
  description: string;
  aiAnalysis: {
    detectedIssue: string;
    severity: IssueSeverity;
    confidence: number;
    hazardAssessment: string;
    recommendedAction: string;
  };
  photoUrl: string;
  repairPhotoUrl?: string;
  location: LocationCoords;
  authority: ResponsibleAuthority;
  status: ComplaintStatus;
  reportedAt: string; // ISO date
  updatedAt: string;
  slaDays: number; // e.g. 3 or 7 days
  slaDeadline: string; // ISO date
  isOverdue: boolean;
  communityConfirmations: number;
  confirmedByUser?: boolean;
  assignedOfficer?: {
    name: string;
    designation: string;
    contact: string;
    assignedDate: string;
  };
  officerNotes: OfficerNote[];
  verification?: {
    isFixed: boolean;
    citizenRemarks?: string;
    verifiedAt: string;
  };
  reporter: {
    isAnonymous: boolean;
    displayAlias: string; // Always "Anonymous Citizen" in public feeds
  };
}

export interface CivicStats {
  totalReported: number;
  openIssues: number;
  criticalIssues: number;
  overdueIssues: number;
  resolvedIssues: number;
  verifiedCount: number;
  communityConfirmations: number;
}
