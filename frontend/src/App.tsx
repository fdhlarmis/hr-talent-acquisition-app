import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  status: string;
  salaryRange: string;
  publishedAt: string;
  candidates: number;
  priority: string;
};

type Candidate = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  source: string;
  score: number;
  rating: number;
  lastContact: string;
  resumeFile: string;
};

type Communication = {
  id: string;
  templateName: string;
  subject: string;
  channel: string;
  audience: string;
  lastUsed: string;
  responseRate: number;
};

type DashboardState = {
  summary: {
    totalCandidates: number;
    openJobs: number;
    shortlistedCandidates: number;
    avgScore: number;
  };
  jobs: Job[];
  candidates: Candidate[];
  communications: Communication[];
};

async function fetchDashboard(): Promise<DashboardState> {
  const response = await fetch(`${API_URL}/dashboard`);
  if (!response.ok) {
    throw new Error('Unable to load dashboard data');
  }
  return response.json();
}

async function fetchJobs(): Promise<Job[]> {
  const response = await fetch(`${API_URL}/jobs`);
  if (!response.ok) {
    throw new Error('Unable to load jobs');
  }
  return response.json();
}

async function fetchCandidates(): Promise<Candidate[]> {
  const response = await fetch(`${API_URL}/candidates`);
  if (!response.ok) {
    throw new Error('Unable to load candidates');
  }
  return response.json();
}

async function fetchCommunications(): Promise<Communication[]> {
  const response = await fetch(`${API_URL}/communications`);
  if (!response.ok) {
    throw new Error('Unable to load communications');
  }
  return response.json();
}

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'candidates' | 'communications'>('dashboard');
  const [dashboard, setDashboard] = useState<DashboardState | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    location: '',
    employmentType: 'Full-time',
    salaryRange: '',
    priority: 'Medium'
  });

  const [candidateForm, setCandidateForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    source: 'LinkedIn',
    score: '80'
  });

  const [communicationForm, setCommunicationForm] = useState({
    templateName: '',
    subject: '',
    channel: 'Email',
    audience: 'Applicants',
    responseRate: '70'
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [dashboardData, jobsData, candidatesData, communicationsData] = await Promise.all([
          fetchDashboard(),
          fetchJobs(),
          fetchCandidates(),
          fetchCommunications()
        ]);

        setDashboard(dashboardData);
        setJobs(jobsData);
        setCandidates(candidatesData);
        setCommunications(communicationsData);
        setError('');
      } catch (err) {
        setError('Unable to connect to the recruitment API. Please start the backend server.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleCreateJob(e: React.FormEvent) {
    e.preventDefault();
    const response = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobForm)
    });

    if (response.ok) {
      const createdJob = await response.json();
      setJobs((current) => [createdJob, ...current]);
      setJobForm({ title: '', department: '', location: '', employmentType: 'Full-time', salaryRange: '', priority: 'Medium' });
      setActiveTab('jobs');
    }
  }

  async function handleCreateCandidate(e: React.FormEvent) {
    e.preventDefault();
    const response = await fetch(`${API_URL}/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...candidateForm,
        score: Number(candidateForm.score),
        status: 'Applied',
        rating: 4.5,
        resumeFile: `${candidateForm.fullName.toLowerCase().replace(/\s+/g, '-')}.pdf`
      })
    });

    if (response.ok) {
      const createdCandidate = await response.json();
      setCandidates((current) => [createdCandidate, ...current]);
      setCandidateForm({ fullName: '', email: '', phone: '', role: '', source: 'LinkedIn', score: '80' });
      setActiveTab('candidates');
    }
  }

  async function handleCreateMessage(e: React.FormEvent) {
    e.preventDefault();
    const response = await fetch(`${API_URL}/communications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...communicationForm,
        responseRate: Number(communicationForm.responseRate)
      })
    });

    if (response.ok) {
      const createdMessage = await response.json();
      setCommunications((current) => [createdMessage, ...current]);
      setCommunicationForm({ templateName: '', subject: '', channel: 'Email', audience: 'Applicants', responseRate: '70' });
      setActiveTab('communications');
    }
  }

  if (loading) {
    return <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>Loading recruitment dashboard...</div>;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">TalentFlow HR</div>

        <ul className="nav-list">
          {[
            ['dashboard', 'Dashboard'],
            ['jobs', 'Jobs'],
            ['candidates', 'Candidates'],
            ['communications', 'Communications']
          ].map(([key, label]) => (
            <li key={key}>
              <button
                className={`nav-item ${activeTab === key ? 'active' : ''}`}
                onClick={() => setActiveTab(key as 'dashboard' | 'jobs' | 'candidates' | 'communications')}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="content">
        <header className="topbar">
          <h1 className="page-title">Talent Acquisition</h1>
          <div className="user-pill">Recruiting Team</div>
        </header>

        {error ? <div className="card" style={{ marginBottom: 20, color: '#991b1b' }}>{error}</div> : null}

        {activeTab === 'dashboard' && dashboard && (
          <>
            <section className="grid stats-grid">
              <div className="card stat-card">
                <span className="stat-label">Total Candidates</span>
                <span className="stat-value">{dashboard.summary.totalCandidates}</span>
                <span className="stat-subtext">+12 this month</span>
              </div>

              <div className="card stat-card">
                <span className="stat-label">Open Roles</span>
                <span className="stat-value">{dashboard.summary.openJobs}</span>
                <span className="stat-subtext">2 hires in progress</span>
              </div>

              <div className="card stat-card">
                <span className="stat-label">Shortlisted</span>
                <span className="stat-value">{dashboard.summary.shortlistedCandidates}</span>
                <span className="stat-subtext">High-quality funnel</span>
              </div>

              <div className="card stat-card">
                <span className="stat-label">Avg. Score</span>
                <span className="stat-value">{dashboard.summary.avgScore}</span>
                <span className="stat-subtext">Across all active applicants</span>
              </div>
            </section>

            <div className="two-col" style={{ marginTop: 20 }}>
              <div className="card">
                <div className="card-header">
                  <h3>Open positions</h3>
                  <span className="badge badge-open">Live</span>
                </div>
                <div className="job-list">
                  {dashboard.jobs.map((job) => (
                    <div className="job-row" key={job.id}>
                      <div className="job-meta">
                        <strong>{job.title}</strong>
                        <span className="muted">{job.department} • {job.location}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="muted">{job.candidates} applicants</div>
                        <strong>{job.status}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>Top candidates</h3>
                  <span className="badge badge-screening">Priority</span>
                </div>
                <div className="candidate-list">
                  {dashboard.candidates.map((candidate) => (
                    <div className="candidate-row" key={candidate.id}>
                      <div className="candidate-meta">
                        <strong>{candidate.fullName}</strong>
                        <span className="muted">{candidate.role}</span>
                      </div>
                      <span className="score">{candidate.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'jobs' && (
          <div className="two-col">
            <div className="card">
              <div className="card-header">
                <h3>Job postings</h3>
              </div>
              <div className="job-list">
                {jobs.map((job) => (
                  <div className="job-row" key={job.id}>
                    <div className="job-meta">
                      <strong>{job.title}</strong>
                      <span className="muted">{job.department} • {job.location}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="muted">{job.candidates} applicants</div>
                      <span className={`badge ${job.status === 'Open' ? 'badge-open' : 'badge-review'}`}>{job.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Create new job</h3>
              </div>
              <form onSubmit={handleCreateJob} className="form-grid">
                <input
                  className="input"
                  placeholder="Role title"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  required
                />
                <input
                  className="input"
                  placeholder="Department"
                  value={jobForm.department}
                  onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                  required
                />
                <input
                  className="input"
                  placeholder="Location"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  required
                />
                <select
                  className="select"
                  value={jobForm.employmentType}
                  onChange={(e) => setJobForm({ ...jobForm, employmentType: e.target.value })}
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Hybrid</option>
                  <option>Remote</option>
                </select>
                <input
                  className="input"
                  placeholder="Salary range"
                  value={jobForm.salaryRange}
                  onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                />
                <select
                  className="select"
                  value={jobForm.priority}
                  onChange={(e) => setJobForm({ ...jobForm, priority: e.target.value })}
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="primary-btn">Publish role</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="two-col">
            <div className="card">
              <div className="card-header">
                <h3>Candidate pipeline</h3>
              </div>
              <div className="candidate-list">
                {candidates.map((candidate) => (
                  <div className="candidate-row" key={candidate.id}>
                    <div className="candidate-meta">
                      <strong>{candidate.fullName}</strong>
                      <span className="muted">{candidate.role} • {candidate.source}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="score">{candidate.score}</div>
                      <span className={`badge ${candidate.status === 'Shortlist' ? 'badge-open' : candidate.status === 'Interviewing' ? 'badge-review' : 'badge-screening'}`}>
                        {candidate.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Add candidate</h3>
              </div>
              <form onSubmit={handleCreateCandidate} className="form-grid">
                <input
                  className="input"
                  placeholder="Full name"
                  value={candidateForm.fullName}
                  onChange={(e) => setCandidateForm({ ...candidateForm, fullName: e.target.value })}
                  required
                />
                <input
                  className="input"
                  placeholder="Email"
                  type="email"
                  value={candidateForm.email}
                  onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
                  required
                />
                <input
                  className="input"
                  placeholder="Phone"
                  value={candidateForm.phone}
                  onChange={(e) => setCandidateForm({ ...candidateForm, phone: e.target.value })}
                  required
                />
                <input
                  className="input"
                  placeholder="Target role"
                  value={candidateForm.role}
                  onChange={(e) => setCandidateForm({ ...candidateForm, role: e.target.value })}
                  required
                />
                <select
                  className="select"
                  value={candidateForm.source}
                  onChange={(e) => setCandidateForm({ ...candidateForm, source: e.target.value })}
                >
                  <option>LinkedIn</option>
                  <option>Indeed</option>
                  <option>Referral</option>
                  <option>Company Career Site</option>
                </select>
                <input
                  className="input"
                  type="number"
                  min="0"
                  max="100"
                  value={candidateForm.score}
                  onChange={(e) => setCandidateForm({ ...candidateForm, score: e.target.value })}
                />
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="primary-btn">Save candidate</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'communications' && (
          <div className="two-col">
            <div className="card">
              <div className="card-header">
                <h3>Communication templates</h3>
              </div>
              <div className="communication-list">
                {communications.map((message) => (
                  <div className="communication-row" key={message.id}>
                    <div className="communication-meta">
                      <strong>{message.templateName}</strong>
                      <span className="muted">{message.subject}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="muted">{message.channel}</div>
                      <strong>{message.responseRate}%</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>New template</h3>
              </div>
              <form onSubmit={handleCreateMessage} className="form-grid">
                <input
                  className="input"
                  placeholder="Template name"
                  value={communicationForm.templateName}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, templateName: e.target.value })}
                  required
                />
                <input
                  className="input"
                  placeholder="Email subject"
                  value={communicationForm.subject}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, subject: e.target.value })}
                  required
                />
                <select
                  className="select"
                  value={communicationForm.channel}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, channel: e.target.value })}
                >
                  <option>Email</option>
                  <option>SMS</option>
                  <option>LinkedIn</option>
                </select>
                <select
                  className="select"
                  value={communicationForm.audience}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, audience: e.target.value })}
                >
                  <option>Applicants</option>
                  <option>Interview candidates</option>
                  <option>Finalists</option>
                </select>
                <input
                  className="input"
                  type="number"
                  min="0"
                  max="100"
                  value={communicationForm.responseRate}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, responseRate: e.target.value })}
                />
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="primary-btn">Save template</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
