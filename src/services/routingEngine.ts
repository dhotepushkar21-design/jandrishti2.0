import { IssueCategory, IssueSeverity, ResponsibleAuthority, LocationCoords } from '../types';

export interface AIAnalysisResult {
  detectedIssue: string;
  severity: IssueSeverity;
  confidence: number;
  hazardAssessment: string;
  recommendedAction: string;
}

/**
 * Lightweight simulated AI Vision analysis for JanDrishti.
 * Note: Designed with clean interfaces so a real Gemini/Vision API endpoint 
 * can be plugged in directly when credentials are configured.
 */
export function simulateAIVisionAnalysis(
  category: IssueCategory,
  userNotes?: string
): AIAnalysisResult {
  const noteLower = (userNotes || '').toLowerCase();

  switch (category) {
    case 'Pothole':
      if (noteLower.includes('deep') || noteLower.includes('accident') || noteLower.includes('danger')) {
        return {
          detectedIssue: 'Severe Road Surface Depression (Pothole)',
          severity: 'Critical',
          confidence: 0.96,
          hazardAssessment: 'Deep depression (>15cm depth) on vehicular path with exposed aggregate. High risk of two-wheeler skid and structural vehicular damage.',
          recommendedAction: 'Immediate cold-mix patch filling and emergency safety barricading within 24h.'
        };
      }
      return {
        detectedIssue: 'Medium-Depth Asphalt Pothole',
        severity: 'High',
        confidence: 0.94,
        hazardAssessment: 'Asphalt rupture (approx 40cm dia, 8cm depth) situated on the active wheel track. Causes traffic deceleration and bike balance hazard.',
        recommendedAction: 'Standard bituminous mastic asphalt filling and roller compaction.'
      };

    case 'Damaged Road':
      return {
        detectedIssue: 'Extensive Road Surface Crack & Subsidence',
        severity: 'High',
        confidence: 0.92,
        hazardAssessment: 'Alligator cracking and sub-grade layer settlement over a 12-meter stretch. Vulnerable to monsoon cratering.',
        recommendedAction: 'Surface milling, sub-base reinforcement, and micro-surfacing overlay.'
      };

    case 'Streetlight':
      return {
        detectedIssue: 'Non-Functional LED Luminaire & Exposed Wiring',
        severity: 'Medium',
        confidence: 0.95,
        hazardAssessment: 'Defective street luminaire causing black-spot at pedestrian crossing. Potential pedestrian safety and nocturnal security concern.',
        recommendedAction: 'Fixture ballast replacement and junction box insulation test.'
      };

    case 'Traffic Signal/CCTV':
      return {
        detectedIssue: 'Malfunctioning Traffic Signal Phase Controller',
        severity: 'Critical',
        confidence: 0.97,
        hazardAssessment: 'Signal stuck on amber/blackout at intersection. Immediate risk of multi-directional vehicular collision and gridlock.',
        recommendedAction: 'Deploy traffic warden immediately; dispatch signal electronics engineer for controller reset.'
      };

    case 'Garbage':
      return {
        detectedIssue: 'Uncollected Solid Waste Accumulation',
        severity: 'Medium',
        confidence: 0.91,
        hazardAssessment: 'Open municipal solid waste overflowing onto public pavement. Vector breeding risk and pedestrian obstruction.',
        recommendedAction: 'Dispatch hydraulic compactor tipper and sanitize area with bleaching powder.'
      };

    case 'Water Leakage':
      return {
        detectedIssue: 'Pressurized Underground Pipeline Rupture',
        severity: 'High',
        confidence: 0.93,
        hazardAssessment: 'Treated drinking water gushing under pressure, weakening road sub-grade and flooding nearby lane.',
        recommendedAction: 'Isolate upstream sluice valve and execute trench welding repair.'
      };

    case 'Footpath':
      return {
        detectedIssue: 'Dislodged Paver Blocks & Open Drain Slab',
        severity: 'High',
        confidence: 0.89,
        hazardAssessment: 'Missing pedestrian walkway slabs with 1.2m drop into storm water drain. Severe injury hazard for senior citizens and visually impaired.',
        recommendedAction: 'Install reinforced RCC precast slab and align interlocking pavers.'
      };

    default:
      return {
        detectedIssue: 'Civic Infrastructure Anomaly',
        severity: 'Medium',
        confidence: 0.88,
        hazardAssessment: 'General public infrastructure obstruction identified requiring field engineer inspection.',
        recommendedAction: 'Conduct physical site inspection by ward junior engineer.'
      };
  }
}

/**
 * Mock Authority Routing Engine:
 * Maps Jurisdiction (National Highway, State Highway, Municipal, Electricity, Water)
 * to the exact responsible civic authority.
 */
export function routeToResponsibleAuthority(
  category: IssueCategory,
  location: LocationCoords
): ResponsibleAuthority {
  const city = location.city || 'Bengaluru';

  // 1. Check Highway Jurisdictions
  if (location.roadType === 'National Highway') {
    return {
      name: 'National Highways Authority of India (NHAI)',
      code: 'NHAI-PIU-01',
      department: 'Highway Maintenance & Safety Wing',
      jurisdiction: 'National Highway Corridors & Ring Expressways',
      escalationOfficer: 'Project Director, NHAI Regional Office',
      contactEmail: 'projectdirector.nhai@gov.in'
    };
  }

  if (location.roadType === 'State Highway') {
    return {
      name: 'Public Works Department (PWD)',
      code: 'PWD-SH-DIV',
      department: 'State Roads & Bridges Division',
      jurisdiction: 'State Arterials & PWD Corridors',
      escalationOfficer: 'Executive Engineer, PWD Central Division',
      contactEmail: 'ee.pwd.roads@state.gov.in'
    };
  }

  // 2. Check Specific Category Domain Authorities
  if (category === 'Water Leakage') {
    return {
      name: `${city.includes('Bengaluru') ? 'BWSSB' : city.includes('Delhi') ? 'DJB' : city.includes('Mumbai') ? 'MCGM Water Dept' : 'Water Supply & Sewerage Board'}`,
      code: 'WSSB-OPS',
      department: 'Water Supply Pipeline Maintenance',
      jurisdiction: `${city} Metropolitan Water Supply Grid`,
      escalationOfficer: 'Chief Engineer (Distribution & Quality)',
      contactEmail: 'watercomplaints@gov.in'
    };
  }

  if (category === 'Streetlight') {
    return {
      name: `${city.includes('Bengaluru') ? 'BESCOM' : city.includes('Delhi') ? 'BSES' : city.includes('Mumbai') ? 'Tata Power / Adani' : 'Municipal Electrical Engineering Wing'}`,
      code: 'DISCOM-STLIGHT',
      department: 'Public Lighting & Grid Operations',
      jurisdiction: 'Urban Street Lighting Division',
      escalationOfficer: 'Superintending Electrical Engineer',
      contactEmail: 'streetlights.civic@gov.in'
    };
  }

  if (category === 'Traffic Signal/CCTV') {
    return {
      name: `${city} Traffic Police & Urban Mobility Cell`,
      code: 'TP-SIG-MGMT',
      department: 'Traffic Control Automation & Signals',
      jurisdiction: 'Metropolitan Traffic Signal Junctions',
      escalationOfficer: 'Deputy Commissioner of Police (Traffic)',
      contactEmail: 'trafficsignals@police.gov.in'
    };
  }

  if (category === 'Garbage') {
    return {
      name: `${city.includes('Bengaluru') ? 'BBMP' : city.includes('Delhi') ? 'MCD' : city.includes('Mumbai') ? 'BMC' : 'City Municipal Corporation'} - Solid Waste Management`,
      code: 'CMC-SWM-DIV',
      department: 'Solid Waste Management & Sanitation Wing',
      jurisdiction: 'Ward Sanitation & Secondary Collection',
      escalationOfficer: 'Joint Commissioner (Solid Waste Management)',
      contactEmail: 'swm.complaints@corporation.gov.in'
    };
  }

  // Default: Municipal Corporation Road & Infrastructure Works
  const corpName = city.includes('Bengaluru') ? 'BBMP' : city.includes('Delhi') ? 'MCD' : city.includes('Mumbai') ? 'BMC' : city.includes('Pune') ? 'PMC' : 'Municipal Corporation';
  return {
    name: `${corpName} Road & Infrastructure Department`,
    code: `${corpName.substring(0, 4)}-RD-WKS`,
    department: 'Urban Road Maintenance & Storm Water Drains',
    jurisdiction: `Ward Infrastructure & Zonal Works (${location.address.split(',')[0] || city})`,
    escalationOfficer: `Zonal Executive Engineer, ${corpName}`,
    contactEmail: `roads.maintenance@${corpName.toLowerCase()}.gov.in`
  };
}

/**
 * Determines SLA days based on severity and category
 */
export function getSLADays(severity: IssueSeverity, category: IssueCategory): number {
  if (severity === 'Critical' || category === 'Traffic Signal/CCTV') return 1; // 24 hours
  if (severity === 'High') return 3; // 72 hours
  if (category === 'Garbage') return 2; // 48 hours
  return 5; // Standard 5 days
}
