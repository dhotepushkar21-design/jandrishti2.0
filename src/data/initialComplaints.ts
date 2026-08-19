import { Complaint } from '../types';

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'JD-2026-0001',
    category: 'Pothole',
    title: 'Severe crater pothole on Outer Ring Road underpass',
    description: 'Deep hazardous pothole (approx 60cm wide, 15cm deep) right after the flyover ramp. Causing rapid deceleration and two-wheeler near-misses.',
    aiAnalysis: {
      detectedIssue: 'Severe Road Surface Depression (Pothole)',
      severity: 'Critical',
      confidence: 0.96,
      hazardAssessment: 'Deep depression (>15cm depth) on vehicular path with exposed aggregate. High risk of two-wheeler skid and structural vehicular damage.',
      recommendedAction: 'Immediate cold-mix patch filling and emergency safety barricading within 24h.'
    },
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    repairPhotoUrl: undefined,
    location: {
      lat: 12.9279,
      lng: 77.6271,
      address: 'Near Silk Board Flyover Ramp, Outer Ring Road',
      city: 'Bengaluru',
      roadType: 'Municipal Arterial',
      landmark: 'Opposite Central Silk Board Gate 2'
    },
    authority: {
      name: 'BBMP Road & Infrastructure Department',
      code: 'BBMP-RD-WKS',
      department: 'Urban Road Maintenance & Storm Water Drains',
      jurisdiction: 'South Zone Road Maintenance (Ward 174 HSR)',
      escalationOfficer: 'Zonal Executive Engineer, BBMP South',
      contactEmail: 'roads.maintenance@bbmp.gov.in'
    },
    status: 'Work Started',
    reportedAt: '2026-08-17T09:30:00Z',
    updatedAt: '2026-08-18T14:20:00Z',
    slaDays: 1,
    slaDeadline: '2026-08-18T09:30:00Z',
    isOverdue: true,
    communityConfirmations: 48,
    confirmedByUser: false,
    assignedOfficer: {
      name: 'Er. Rajesh Kulkarni',
      designation: 'Assistant Executive Engineer (Roads)',
      contact: '+91 98450 12345',
      assignedDate: '2026-08-17T11:45:00Z'
    },
    officerNotes: [
      {
        id: 'note-1',
        timestamp: '2026-08-17T11:45:00Z',
        officerName: 'Control Room Officer',
        designation: 'Civic Dispatch Hub',
        comment: 'Complaint verified and dispatched to Ward 174 Quick Response Maintenance Crew.',
        statusUpdate: 'Acknowledged'
      },
      {
        id: 'note-2',
        timestamp: '2026-08-18T14:20:00Z',
        officerName: 'Er. Rajesh Kulkarni',
        designation: 'Assistant Executive Engineer',
        comment: 'Asphalt cold-mix batch ordered. Roller deployed on site. Night repair scheduled to minimize traffic disruption.',
        statusUpdate: 'Work Started'
      }
    ],
    reporter: {
      isAnonymous: true,
      displayAlias: 'Anonymous Citizen'
    }
  },
  {
    id: 'JD-2026-0002',
    category: 'Streetlight',
    title: 'Bank of 5 Streetlights non-functional on 100ft Road',
    description: 'Continuous 300-meter stretch is completely pitch dark during night hours. Pedestrians struggle to cross safely.',
    aiAnalysis: {
      detectedIssue: 'Non-Functional LED Luminaire & Circuit Trip',
      severity: 'Medium',
      confidence: 0.94,
      hazardAssessment: 'Defective street luminaire cluster causing continuous black-spot. Nocturnal security concern for evening commuters.',
      recommendedAction: 'Inspect feeder pillar timer control and replace damaged LED drivers.'
    },
    photoUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
    repairPhotoUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    location: {
      lat: 12.9784,
      lng: 77.6408,
      address: '100 Feet Road, Near 12th Main Crossing, Indiranagar',
      city: 'Bengaluru',
      roadType: 'Municipal Arterial',
      landmark: 'Near Metro Pillar 84'
    },
    authority: {
      name: 'BESCOM Public Lighting Division',
      code: 'BESCOM-STLIGHT',
      department: 'Public Lighting & Grid Operations',
      jurisdiction: 'East Division Public Electrical Infrastructure',
      escalationOfficer: 'Superintending Electrical Engineer',
      contactEmail: 'streetlights.civic@gov.in'
    },
    status: 'Resolved',
    reportedAt: '2026-08-16T18:10:00Z',
    updatedAt: '2026-08-18T16:00:00Z',
    slaDays: 3,
    slaDeadline: '2026-08-19T18:10:00Z',
    isOverdue: false,
    communityConfirmations: 23,
    confirmedByUser: false,
    assignedOfficer: {
      name: 'Venkatesh Murthy',
      designation: 'Junior Electrical Engineer (O&M)',
      contact: '+91 94480 88990',
      assignedDate: '2026-08-17T09:00:00Z'
    },
    officerNotes: [
      {
        id: 'note-3',
        timestamp: '2026-08-17T10:00:00Z',
        officerName: 'Venkatesh Murthy',
        designation: 'Junior Electrical Engineer',
        comment: 'Feeder pillar junction inspected. MCB trip replaced with 63A surge protector.',
        statusUpdate: 'Work Started'
      },
      {
        id: 'note-4',
        timestamp: '2026-08-18T16:00:00Z',
        officerName: 'Venkatesh Murthy',
        designation: 'Junior Electrical Engineer',
        comment: 'All 5 luminaire heads tested and illuminated. Evidence photo attached. Requesting citizen verification.',
        statusUpdate: 'Resolved'
      }
    ],
    reporter: {
      isAnonymous: true,
      displayAlias: 'Anonymous Citizen'
    }
  },
  {
    id: 'JD-2026-0003',
    category: 'Water Leakage',
    title: 'High-pressure water main pipeline burst on Subhash Road',
    description: 'Substantial volume of clean municipal water flooding the roadway. Foundation of footpath beginning to cave in.',
    aiAnalysis: {
      detectedIssue: 'Pressurized Underground Pipeline Rupture',
      severity: 'High',
      confidence: 0.95,
      hazardAssessment: 'Treated drinking water gushing under pressure, weakening road sub-grade and flooding nearby lane.',
      recommendedAction: 'Isolate upstream sluice valve and execute trench welding repair.'
    },
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    repairPhotoUrl: undefined,
    location: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Subhash Road, Near Shivaji Park, Dadar West',
      city: 'Mumbai',
      roadType: 'Municipal Arterial',
      landmark: 'Near Portuguese Church Junction'
    },
    authority: {
      name: 'BMC Water Department (Hydraulic Engineer)',
      code: 'MCGM-HE-DIV',
      department: 'Water Supply Pipeline Maintenance',
      jurisdiction: 'G/North Ward Water Network',
      escalationOfficer: 'Chief Hydraulic Engineer, BMC',
      contactEmail: 'watercomplaints@gov.in'
    },
    status: 'Acknowledged',
    reportedAt: '2026-08-18T07:15:00Z',
    updatedAt: '2026-08-18T08:30:00Z',
    slaDays: 2,
    slaDeadline: '2026-08-20T07:15:00Z',
    isOverdue: false,
    communityConfirmations: 31,
    confirmedByUser: false,
    assignedOfficer: {
      name: 'Sunil Patil',
      designation: 'Ward Hydraulic Supervisor',
      contact: '+91 98200 44556',
      assignedDate: '2026-08-18T08:30:00Z'
    },
    officerNotes: [
      {
        id: 'note-5',
        timestamp: '2026-08-18T08:30:00Z',
        officerName: 'Sunil Patil',
        designation: 'Ward Hydraulic Supervisor',
        comment: 'Valve #14 isolated to reduce pressure. Excavator team en-route to expose damaged collar joint.',
        statusUpdate: 'Acknowledged'
      }
    ],
    reporter: {
      isAnonymous: true,
      displayAlias: 'Anonymous Citizen'
    }
  },
  {
    id: 'JD-2026-0004',
    category: 'Traffic Signal/CCTV',
    title: 'Major Junction 4-Way Traffic Signal in Blackout',
    description: 'Busy intersection signal completely dead during morning peak traffic hours. Heavy gridlock and high risk of collisions.',
    aiAnalysis: {
      detectedIssue: 'Malfunctioning Traffic Signal Phase Controller',
      severity: 'Critical',
      confidence: 0.97,
      hazardAssessment: 'Signal stuck on amber/blackout at intersection. Immediate risk of multi-directional vehicular collision and gridlock.',
      recommendedAction: 'Deploy traffic warden immediately; dispatch signal electronics engineer for controller reset.'
    },
    photoUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80',
    repairPhotoUrl: undefined,
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Barakhamba Road - Connaught Circus Crossing',
      city: 'Delhi',
      roadType: 'State Highway',
      landmark: 'Outer Circle Gate 4'
    },
    authority: {
      name: 'Delhi Traffic Police & Urban Mobility Cell',
      code: 'TP-SIG-MGMT',
      department: 'Traffic Control Automation & Signals',
      jurisdiction: 'New Delhi Zone Traffic Automation',
      escalationOfficer: 'Deputy Commissioner of Police (Traffic)',
      contactEmail: 'trafficsignals@police.gov.in'
    },
    status: 'Reported',
    reportedAt: '2026-08-19T02:00:00Z',
    updatedAt: '2026-08-19T02:00:00Z',
    slaDays: 1,
    slaDeadline: '2026-08-20T02:00:00Z',
    isOverdue: false,
    communityConfirmations: 74,
    confirmedByUser: false,
    assignedOfficer: undefined,
    officerNotes: [],
    reporter: {
      isAnonymous: true,
      displayAlias: 'Anonymous Citizen'
    }
  },
  {
    id: 'JD-2026-0005',
    category: 'Footpath',
    title: 'Missing storm drain concrete slab on pedestrian footpath',
    description: 'Two large slabs missing leaving an open 4-foot drop right near the bus stop. Multiple commuters tripped.',
    aiAnalysis: {
      detectedIssue: 'Dislodged Paver Blocks & Open Drain Slab',
      severity: 'High',
      confidence: 0.91,
      hazardAssessment: 'Missing pedestrian walkway slabs with 1.2m drop into storm water drain. Severe injury hazard for senior citizens and visually impaired.',
      recommendedAction: 'Install reinforced RCC precast slab and align interlocking pavers.'
    },
    photoUrl: 'https://images.unsplash.com/photo-1572932490908-76c9efc78864?auto=format&fit=crop&w=800&q=80',
    repairPhotoUrl: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=800&q=80',
    location: {
      lat: 18.5204,
      lng: 73.8567,
      address: 'FC Road, Near Goodluck Cafe, Deccan Gymkhana',
      city: 'Pune',
      roadType: 'Municipal Arterial',
      landmark: 'Adjacent to Deccan PMPML Bus Shelter'
    },
    authority: {
      name: 'PMC Road & Infrastructure Department',
      code: 'PMC-RD-WKS',
      department: 'Urban Road Maintenance & Storm Water Drains',
      jurisdiction: 'Ghole Road Ward Office Infrastructure Wing',
      escalationOfficer: 'Zonal Executive Engineer, PMC',
      contactEmail: 'roads.maintenance@pmc.gov.in'
    },
    status: 'Verified',
    reportedAt: '2026-08-12T10:00:00Z',
    updatedAt: '2026-08-15T12:00:00Z',
    slaDays: 3,
    slaDeadline: '2026-08-15T10:00:00Z',
    isOverdue: false,
    communityConfirmations: 62,
    confirmedByUser: true,
    assignedOfficer: {
      name: 'Anand Shinde',
      designation: 'Ward Junior Engineer',
      contact: '+91 97650 33221',
      assignedDate: '2026-08-12T14:00:00Z'
    },
    officerNotes: [
      {
        id: 'note-6',
        timestamp: '2026-08-13T09:00:00Z',
        officerName: 'Anand Shinde',
        designation: 'Junior Engineer',
        comment: 'Temporary steel plate installed for safety while precast RCC slab is cured.',
        statusUpdate: 'Work Started'
      },
      {
        id: 'note-7',
        timestamp: '2026-08-14T17:00:00Z',
        officerName: 'Anand Shinde',
        designation: 'Junior Engineer',
        comment: 'Heavy duty RCC cover slab cast and set flush with pavement. Work completed.',
        statusUpdate: 'Resolved'
      }
    ],
    verification: {
      isFixed: true,
      citizenRemarks: 'Checked in person today — new reinforced slab fitted securely. No gap remaining.',
      verifiedAt: '2026-08-15T12:00:00Z'
    },
    reporter: {
      isAnonymous: true,
      displayAlias: 'Anonymous Citizen'
    }
  },
  {
    id: 'JD-2026-0006',
    category: 'Garbage',
    title: 'Overflowing commercial waste obstructing road corner',
    description: 'Black trash bags dumped across the road corner emitting foul odor and attracting stray dogs and cattle.',
    aiAnalysis: {
      detectedIssue: 'Uncollected Solid Waste Accumulation',
      severity: 'Medium',
      confidence: 0.92,
      hazardAssessment: 'Open municipal solid waste overflowing onto public pavement. Vector breeding risk and pedestrian obstruction.',
      recommendedAction: 'Dispatch hydraulic compactor tipper and sanitize area with bleaching powder.'
    },
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    repairPhotoUrl: undefined,
    location: {
      lat: 17.3850,
      lng: 78.4867,
      address: 'Banjara Hills Road No. 12, Near MLA Colony',
      city: 'Hyderabad',
      roadType: 'Colony Road',
      landmark: 'Behind Community Health Center'
    },
    authority: {
      name: 'GHMC - Solid Waste Management',
      code: 'GHMC-SWM-DIV',
      department: 'Solid Waste Management & Sanitation Wing',
      jurisdiction: 'Khairatabad Zone Sanitation Circle',
      escalationOfficer: 'Joint Commissioner (Solid Waste Management)',
      contactEmail: 'swm.complaints@corporation.gov.in'
    },
    status: 'Routed',
    reportedAt: '2026-08-18T14:40:00Z',
    updatedAt: '2026-08-18T15:10:00Z',
    slaDays: 2,
    slaDeadline: '2026-08-20T14:40:00Z',
    isOverdue: false,
    communityConfirmations: 19,
    confirmedByUser: false,
    assignedOfficer: undefined,
    officerNotes: [
      {
        id: 'note-8',
        timestamp: '2026-08-18T15:10:00Z',
        officerName: 'Auto-Routing Engine',
        designation: 'JanDrishti Civic Dispatch',
        comment: 'Routed to GHMC Khairatabad Sanitation Inspector. Route vehicle scheduled on next sweep cycle.',
        statusUpdate: 'Routed'
      }
    ],
    reporter: {
      isAnonymous: true,
      displayAlias: 'Anonymous Citizen'
    }
  },
  {
    id: 'JD-2026-0007',
    category: 'Damaged Road',
    title: 'NH-44 Expressway bridge approach expansion joint sinkage',
    description: 'Extreme jolt when vehicles hit bridge expansion gap at 60km/h. Significant risk of freight axle breakdown.',
    aiAnalysis: {
      detectedIssue: 'Bridge Approach Expansion Joint Settlement',
      severity: 'Critical',
      confidence: 0.98,
      hazardAssessment: 'Structural differential settlement (>80mm step) at bridge approach. High likelihood of high-speed rollover.',
      recommendedAction: 'Emergency mastic asphalt ramping followed by hydraulic bridge jack realignment.'
    },
    photoUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    repairPhotoUrl: undefined,
    location: {
      lat: 28.5355,
      lng: 77.3910,
      address: 'Noida-Greater Noida Expressway, KM 14 Pillar',
      city: 'Delhi NCR',
      roadType: 'National Highway',
      landmark: 'Near Sector 128 Exit Ramp'
    },
    authority: {
      name: 'National Highways Authority of India (NHAI)',
      code: 'NHAI-PIU-01',
      department: 'Highway Maintenance & Safety Wing',
      jurisdiction: 'National Highway Corridors & Ring Expressways',
      escalationOfficer: 'Project Director, NHAI Regional Office',
      contactEmail: 'projectdirector.nhai@gov.in'
    },
    status: 'Reopened',
    reportedAt: '2026-08-10T11:00:00Z',
    updatedAt: '2026-08-17T09:00:00Z',
    slaDays: 1,
    slaDeadline: '2026-08-11T11:00:00Z',
    isOverdue: true,
    communityConfirmations: 104,
    confirmedByUser: true,
    assignedOfficer: {
      name: 'Er. S. P. Verma',
      designation: 'NHAI Highway Resident Engineer',
      contact: '+91 99100 77889',
      assignedDate: '2026-08-11T08:00:00Z'
    },
    officerNotes: [
      {
        id: 'note-9',
        timestamp: '2026-08-15T18:00:00Z',
        officerName: 'Er. S. P. Verma',
        designation: 'Resident Engineer',
        comment: 'Temporary asphalt patch applied over joint.',
        statusUpdate: 'Resolved'
      },
      {
        id: 'note-10',
        timestamp: '2026-08-17T09:00:00Z',
        officerName: 'Citizen Verification',
        designation: 'Reopened by Citizen',
        comment: 'Patch washed away during rain within 24 hours. Gap is worse now.',
        statusUpdate: 'Reopened'
      }
    ],
    verification: {
      isFixed: false,
      citizenRemarks: 'The cold mix patch disintegrated within one monsoon shower. The drop is still 8cm and vehicles are swerving dangerously.',
      verifiedAt: '2026-08-17T09:00:00Z'
    },
    reporter: {
      isAnonymous: true,
      displayAlias: 'Anonymous Citizen'
    }
  }
];
