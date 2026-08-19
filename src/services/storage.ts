import { Complaint, ComplaintStatus, CivicStats, OfficerNote } from '../types';
import { INITIAL_COMPLAINTS } from '../data/initialComplaints';

const STORAGE_KEY = 'jandrishti_complaints_v3';
const CONFIRMED_IDS_KEY = 'jandrishti_user_confirmed_ids';

export function getStoredComplaints(): Complaint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COMPLAINTS));
      return INITIAL_COMPLAINTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_COMPLAINTS;
  } catch (e) {
    console.error('Error reading localStorage for JanDrishti:', e);
    return INITIAL_COMPLAINTS;
  }
}

export function saveComplaints(complaints: Complaint[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  } catch (e) {
    console.error('Error writing to localStorage for JanDrishti:', e);
  }
}

export function resetDemoData(): Complaint[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COMPLAINTS));
  localStorage.removeItem(CONFIRMED_IDS_KEY);
  return INITIAL_COMPLAINTS;
}

export function getNextComplaintId(existing: Complaint[]): string {
  const currentYear = 2026;
  const numbers = existing
    .map(c => {
      const match = c.id.match(/JD-\d{4}-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(n => !isNaN(n));
  const maxNum = numbers.length > 0 ? Math.max(...numbers) : 7;
  const nextNum = maxNum + 1;
  return `JD-${currentYear}-${String(nextNum).padStart(4, '0')}`;
}

export function addComplaint(complaint: Complaint): Complaint[] {
  const all = getStoredComplaints();
  const updated = [complaint, ...all];
  saveComplaints(updated);
  return updated;
}

export function updateComplaintStatus(
  id: string,
  newStatus: ComplaintStatus,
  officerComment?: string,
  repairPhotoUrl?: string
): Complaint[] {
  const all = getStoredComplaints();
  const updated = all.map(c => {
    if (c.id !== id) return c;

    const newNotes: OfficerNote[] = [...c.officerNotes];
    if (officerComment) {
      newNotes.push({
        id: `note-${Date.now()}`,
        timestamp: new Date().toISOString(),
        officerName: c.assignedOfficer?.name || 'Authorized Officer',
        designation: c.assignedOfficer?.designation || 'Civic Authority Wing',
        comment: officerComment,
        statusUpdate: newStatus
      });
    }

    return {
      ...c,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      repairPhotoUrl: repairPhotoUrl || c.repairPhotoUrl,
      officerNotes: newNotes
    };
  });

  saveComplaints(updated);
  return updated;
}

export function assignOfficerToComplaint(
  id: string,
  officer: { name: string; designation: string; contact: string }
): Complaint[] {
  const all = getStoredComplaints();
  const updated = all.map(c => {
    if (c.id !== id) return c;

    const newNotes: OfficerNote[] = [
      ...c.officerNotes,
      {
        id: `note-${Date.now()}`,
        timestamp: new Date().toISOString(),
        officerName: 'Dispatch System',
        designation: 'Auto-Assignment',
        comment: `Case officially assigned to ${officer.name} (${officer.designation}).`,
        statusUpdate: c.status === 'Reported' ? 'Routed' : c.status
      }
    ];

    return {
      ...c,
      status: c.status === 'Reported' ? 'Routed' : c.status,
      assignedOfficer: {
        ...officer,
        assignedDate: new Date().toISOString()
      },
      updatedAt: new Date().toISOString(),
      officerNotes: newNotes
    };
  });

  saveComplaints(updated);
  return updated;
}

export function toggleCommunityConfirmation(id: string): { complaints: Complaint[]; confirmed: boolean } {
  const all = getStoredComplaints();
  let wasConfirmed = false;

  const updated = all.map(c => {
    if (c.id !== id) return c;
    
    // Toggle user confirmation
    const currentlyConfirmed = !!c.confirmedByUser;
    wasConfirmed = !currentlyConfirmed;

    return {
      ...c,
      confirmedByUser: !currentlyConfirmed,
      communityConfirmations: currentlyConfirmed
        ? Math.max(1, c.communityConfirmations - 1)
        : c.communityConfirmations + 1
    };
  });

  saveComplaints(updated);
  return { complaints: updated, confirmed: wasConfirmed };
}

export function submitCitizenVerification(
  id: string,
  isFixed: boolean,
  remarks: string
): Complaint[] {
  const all = getStoredComplaints();
  const updated = all.map(c => {
    if (c.id !== id) return c;

    const newStatus: ComplaintStatus = isFixed ? 'Verified' : 'Reopened';
    const newNotes: OfficerNote[] = [
      ...c.officerNotes,
      {
        id: `note-${Date.now()}`,
        timestamp: new Date().toISOString(),
        officerName: 'Citizen Verification',
        designation: 'Citizen Audit',
        comment: isFixed
          ? `Citizen verified resolution in-person: "${remarks || 'Issue confirmed resolved satisfactorily.'}"`
          : `Citizen disputed resolution: "${remarks || 'Issue still exists. Reopened for field action.'}"`,
        statusUpdate: newStatus
      }
    ];

    return {
      ...c,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      verification: {
        isFixed,
        citizenRemarks: remarks,
        verifiedAt: new Date().toISOString()
      },
      officerNotes: newNotes
    };
  });

  saveComplaints(updated);
  return updated;
}

export function calculateCivicStats(complaints: Complaint[]): CivicStats {
  const totalReported = complaints.length;
  const openIssues = complaints.filter(
    c => c.status === 'Reported' || c.status === 'Routed' || c.status === 'Acknowledged' || c.status === 'Work Started' || c.status === 'Reopened'
  ).length;
  const criticalIssues = complaints.filter(
    c => (c.aiAnalysis.severity === 'Critical' || c.aiAnalysis.severity === 'High') && c.status !== 'Verified'
  ).length;
  const overdueIssues = complaints.filter(c => c.isOverdue && c.status !== 'Verified').length;
  const resolvedIssues = complaints.filter(c => c.status === 'Resolved').length;
  const verifiedCount = complaints.filter(c => c.status === 'Verified').length;
  const communityConfirmations = complaints.reduce((sum, c) => sum + c.communityConfirmations, 0);

  return {
    totalReported,
    openIssues,
    criticalIssues,
    overdueIssues,
    resolvedIssues,
    verifiedCount,
    communityConfirmations
  };
}
