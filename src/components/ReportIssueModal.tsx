import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  MapPin, 
  Cpu, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RotateCw, 
  ArrowRight,
  ChevronRight,
  Info
} from 'lucide-react';
import { Complaint, IssueCategory, LocationCoords } from '../types';
import { simulateAIVisionAnalysis, routeToResponsibleAuthority, getSLADays } from '../services/routingEngine';
import { getNextComplaintId } from '../services/storage';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingComplaints: Complaint[];
  onComplaintCreated: (newComplaint: Complaint) => void;
}

const SAMPLE_EVIDENCE = [
  {
    name: 'Severe Pothole',
    category: 'Pothole' as IssueCategory,
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    title: 'Deep crater on Main Arterial Junction',
    roadType: 'Municipal Arterial' as const,
    address: 'Near Indiranagar 100ft Road Junction, Bengaluru'
  },
  {
    name: 'Broken Streetlight',
    category: 'Streetlight' as IssueCategory,
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
    title: 'Damaged luminaire pole with exposed wires in dark zone',
    roadType: 'Colony Road' as const,
    address: 'Near Sector 4 Park, HSR Layout, Bengaluru'
  },
  {
    name: 'Water Main Leak',
    category: 'Water Leakage' as IssueCategory,
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    title: 'High-pressure municipal pipeline gushing on roadway',
    roadType: 'Municipal Arterial' as const,
    address: 'Dadar TT Circle, Mumbai'
  },
  {
    name: 'Traffic Signal Outage',
    category: 'Traffic Signal/CCTV' as IssueCategory,
    url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80',
    title: 'Major Junction 4-Way Traffic Signal in Blackout',
    roadType: 'State Highway' as const,
    address: 'Connaught Circus Crossing, New Delhi'
  },
  {
    name: 'Solid Waste Dump',
    category: 'Garbage' as IssueCategory,
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    title: 'Commercial waste overflowing on public sidewalk',
    roadType: 'Municipal Arterial' as const,
    address: 'Near Lajpat Nagar Market, New Delhi'
  }
];

const POPULAR_CITIES = [
  'Bengaluru',
  'Delhi NCR',
  'Mumbai',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad'
];

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  existingComplaints,
  onComplaintCreated
}) => {
  const [step, setStep] = useState<'photo' | 'location' | 'analysis' | 'review'>('photo');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [category, setCategory] = useState<IssueCategory>('Pothole');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Location State
  const [lat, setLat] = useState<number>(12.9716);
  const [lng, setLng] = useState<number>(77.5946);
  const [city, setCity] = useState<string>('Bengaluru');
  const [address, setAddress] = useState<string>('100 Feet Road, Indiranagar');
  const [landmark, setLandmark] = useState<string>('Opposite Metro Pillar 42');
  const [roadType, setRoadType] = useState<LocationCoords['roadType']>('Municipal Arterial');
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');

  // Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // AI Simulation State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<ReturnType<typeof simulateAIVisionAnalysis> | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError('');
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access unavailable or declined. Please upload an image or pick a sample photo.');
      setIsCameraActive(false);
    }
  };

  // Stop camera when closing or unmounting
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPhotoUrl(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectSample = (sample: typeof SAMPLE_EVIDENCE[0]) => {
    stopCamera();
    setPhotoUrl(sample.url);
    setCategory(sample.category);
    setTitle(sample.title);
    setRoadType(sample.roadType);
    setAddress(sample.address);
  };

  const requestGPSLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      return;
    }
    setGpsStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setGpsStatus('success');
        setAddress(`GPS Location (${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E)`);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGpsStatus('error');
      },
      { timeout: 10000 }
    );
  };

  const runAIAnalysis = () => {
    setIsAnalyzing(true);
    setStep('analysis');
    
    // Simulate AI vision inference latency (1.2s)
    setTimeout(() => {
      const result = simulateAIVisionAnalysis(category, description || title);
      setAiResult(result);
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleProceedToReview = () => {
    if (!title) {
      setTitle(`${category} identified at ${address}`);
    }
    setStep('review');
  };

  const handleFinalSubmit = () => {
    const newId = getNextComplaintId(existingComplaints);
    const locationObj: LocationCoords = {
      lat,
      lng,
      address: address || 'Main Road Junction',
      city,
      roadType,
      landmark
    };

    const authority = routeToResponsibleAuthority(category, locationObj);
    const analysis = aiResult || simulateAIVisionAnalysis(category, description);
    const sla = getSLADays(analysis.severity, category);
    
    const now = new Date();
    const deadline = new Date(now.getTime() + sla * 24 * 60 * 60 * 1000);

    const newComplaint: Complaint = {
      id: newId,
      category,
      title: title || `${category} reported on ${address}`,
      description: description || analysis.hazardAssessment,
      aiAnalysis: analysis,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      location: locationObj,
      authority,
      status: 'Reported',
      reportedAt: now.toISOString(),
      updatedAt: now.toISOString(),
      slaDays: sla,
      slaDeadline: deadline.toISOString(),
      isOverdue: false,
      communityConfirmations: 1,
      confirmedByUser: true,
      officerNotes: [
        {
          id: `note-${Date.now()}`,
          timestamp: now.toISOString(),
          officerName: 'JanDrishti Auto-Ingestion',
          designation: 'Civic Ingestion Gateway',
          comment: `Issue registered with AI-Confidence ${(analysis.confidence * 100).toFixed(1)}%. Dispatched to ${authority.name}.`,
          statusUpdate: 'Reported'
        }
      ],
      reporter: {
        isAnonymous: true,
        displayAlias: 'Anonymous Citizen'
      }
    };

    onComplaintCreated(newComplaint);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h3 className="text-lg font-bold">Report Civic Issue</h3>
            </div>
            <p className="text-xs text-slate-400">Step {step === 'photo' ? '1' : step === 'location' ? '2' : step === 'analysis' ? '3' : '4'} of 4 • AI-Assisted Incident Log</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Step 1: Photo & Category */}
          {step === 'photo' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Issue Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Pothole', 'Damaged Road', 'Streetlight', 'Traffic Signal/CCTV', 'Garbage', 'Water Leakage', 'Footpath', 'Other'] as IssueCategory[]).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-2.5 text-xs font-semibold rounded-xl border text-left transition-all ${
                        category === cat
                          ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs ring-1 ring-amber-500'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  2. Capture / Upload Photo Evidence
                </label>

                {/* Live Camera View */}
                {isCameraActive ? (
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-300">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={captureCameraFrame}
                        className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-lg flex items-center gap-2 active:scale-95"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Snap Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-4 py-2.5 rounded-full bg-slate-900/80 text-white text-xs font-semibold hover:bg-slate-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : photoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 bg-slate-900">
                    <img src={photoUrl} alt="Evidence" className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        className="px-2.5 py-1 rounded-md bg-slate-900/80 text-xs text-slate-200 hover:text-white backdrop-blur-xs"
                      >
                        Change Photo
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 text-xs font-medium backdrop-blur-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Photo Evidence Loaded</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/50 flex flex-col items-center justify-center text-center transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-700 group-hover:text-amber-600 mb-2">
                        <Camera className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-slate-800">Open Live Camera</span>
                      <span className="text-xs text-slate-500 mt-0.5">Use device camera directly</span>
                    </button>

                    <label className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/50 flex flex-col items-center justify-center text-center transition-all cursor-pointer group">
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-700 group-hover:text-amber-600 mb-2">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-slate-800">Upload Image File</span>
                      <span className="text-xs text-slate-500 mt-0.5">PNG, JPG, or HEIC</span>
                    </label>
                  </div>
                )}

                {cameraError && (
                  <p className="mt-2 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {cameraError}
                  </p>
                )}
              </div>

              {/* Sample Quick Evidence */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">Or use a sample incident photo for fast demo:</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {SAMPLE_EVIDENCE.map(s => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => selectSample(s)}
                      className="flex-shrink-0 flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-left transition-colors"
                    >
                      <img src={s.url} alt={s.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="text-xs font-medium text-slate-800">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location & Description */}
          {step === 'location' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      GPS Coordinates & Geotag
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={requestGPSLocation}
                    disabled={gpsStatus === 'locating'}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <RotateCw className={`w-3 h-3 ${gpsStatus === 'locating' ? 'animate-spin' : ''}`} />
                    <span>{gpsStatus === 'locating' ? 'Acquiring GPS...' : 'Auto-Detect GPS'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Latitude</span>
                    <span className="font-mono font-semibold text-slate-900">{lat.toFixed(5)}° N</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Longitude</span>
                    <span className="font-mono font-semibold text-slate-900">{lng.toFixed(5)}° E</span>
                  </div>
                </div>

                {gpsStatus === 'success' && (
                  <p className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Exact device GPS locked successfully.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / Region</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {POPULAR_CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Road Jurisdiction Type</label>
                  <select
                    value={roadType}
                    onChange={(e) => setRoadType(e.target.value as LocationCoords['roadType'])}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Municipal Arterial">Municipal Arterial / City Road</option>
                    <option value="Colony Road">Colony / Residential Road</option>
                    <option value="National Highway">National Highway (NHAI)</option>
                    <option value="State Highway">State Highway (PWD)</option>
                    <option value="Footpath / Public Space">Footpath / Public Space</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Street Address / Spot Name</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 100ft Road, near Metro Pillar 84"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nearest Landmark (Optional)</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Central Silk Board Gate 2"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Citizen Observation Notes</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Describe depth, traffic disruption, or recent accident risks..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 3: AI Vision Analysis Simulation */}
          {step === 'analysis' && (
            <div className="space-y-5">
              {isAnalyzing ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative w-20 h-20 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-200 shadow-inner overflow-hidden">
                    <Cpu className="w-10 h-10 text-amber-600 animate-pulse" />
                    <div className="absolute inset-x-0 h-1 bg-amber-500 top-0 animate-bounce"></div>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Scanning Visual Features...</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      Simulating AI Vision model classification, surface depth estimation, and defect classification.
                    </p>
                  </div>
                </div>
              ) : aiResult ? (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-emerald-950">AI Analysis Completed</h4>
                        <p className="text-xs text-emerald-700">Classification Confidence: {(aiResult.confidence * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                      aiResult.severity === 'Critical' ? 'bg-red-600 text-white' :
                      aiResult.severity === 'High' ? 'bg-orange-600 text-white' :
                      'bg-amber-500 text-slate-950'
                    }`}>
                      {aiResult.severity} Severity
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Detected Hazard Classification
                      </span>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{aiResult.detectedIssue}</p>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Safety Hazard Assessment
                      </span>
                      <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{aiResult.hazardAssessment}</p>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Recommended Municipal Action
                      </span>
                      <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{aiResult.recommendedAction}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Modular AI Ready:</strong> This simulation mimics a multi-modal vision prompt. In a live production environment, the same structure connects directly to server-side Gemini Vision APIs.
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Step 4: Final Review & Routing Engine Preview */}
          {step === 'review' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950 text-white border border-indigo-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    Responsible Authority Target
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-800 text-indigo-200">
                    {routeToResponsibleAuthority(category, { lat, lng, address, city, roadType }).code}
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    {routeToResponsibleAuthority(category, { lat, lng, address, city, roadType }).name}
                  </h4>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    {routeToResponsibleAuthority(category, { lat, lng, address, city, roadType }).department}
                  </p>
                </div>
                <div className="pt-2 border-t border-indigo-800/80 flex items-center justify-between text-xs text-indigo-300">
                  <span>Escalation Officer: {routeToResponsibleAuthority(category, { lat, lng, address, city, roadType }).escalationOfficer}</span>
                  <span className="font-semibold text-amber-400">
                    SLA: {getSLADays(aiResult?.severity || 'High', category) * 24}h Target
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-bold text-slate-800">{category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-medium text-slate-800 text-right">{address}, {city}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Jurisdiction:</span>
                  <span className="font-medium text-slate-800">{roadType}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Privacy Mode:</span>
                  <span className="font-semibold text-emerald-700">Anonymous Citizen (Identity Protected)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Navigation */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          {step !== 'photo' ? (
            <button
              type="button"
              onClick={() => {
                if (step === 'review') setStep('analysis');
                else if (step === 'analysis') setStep('location');
                else if (step === 'location') setStep('photo');
              }}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Back
            </button>
          ) : (
            <span className="text-xs text-slate-400">Step 1 of 4</span>
          )}

          {step === 'photo' && (
            <button
              type="button"
              disabled={!photoUrl}
              onClick={() => setStep('location')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Next: Set Location</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {step === 'location' && (
            <button
              type="button"
              onClick={runAIAnalysis}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Run AI Vision Scan</span>
            </button>
          )}

          {step === 'analysis' && (
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleProceedToReview}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-40"
            >
              <span>Review & Auto-Route</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {step === 'review' && (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit & Dispatch Grievance</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
