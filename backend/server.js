const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'app-data.json');

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const seedData = {
      jobs: [
        {
          id: 'job-1',
          title: 'Senior Product Designer',
          department: 'Design',
          location: 'Remote',
          employmentType: 'Full-time',
          status: 'Open',
          salaryRange: '$110k - $140k',
          publishedAt: '2026-09-15',
          candidates: 27,
          priority: 'High'
        },
        {
          id: 'job-2',
          title: 'HR Business Partner',
          department: 'People Ops',
          location: 'New York, NY',
          employmentType: 'Full-time',
          status: 'Reviewing',
          salaryRange: '$95k - $120k',
          publishedAt: '2026-09-20',
          candidates: 18,
          priority: 'Medium'
        },
        {
          id: 'job-3',
          title: 'Frontend Engineer',
          department: 'Engineering',
          location: 'Austin, TX',
          employmentType: 'Hybrid',
          status: 'Open',
          salaryRange: '$120k - $155k',
          publishedAt: '2026-09-28',
          candidates: 34,
          priority: 'High'
        }
      ],
      candidates: [
        {
          id: 'cand-1',
          fullName: 'Maya Thompson',
          email: 'maya.thompson@email.com',
          phone: '+1 (415) 223-1100',
          role: 'Senior Product Designer',
          status: 'Screening',
          source: 'LinkedIn',
          score: 88,
          rating: 4.8,
          lastContact: '2026-10-01',
          resumeFile: 'maya-thompson.pdf',
          createdAt: '2026-09-18'
        },
        {
          id: 'cand-2',
          fullName: 'Daniel Brooks',
          email: 'daniel.brooks@email.com',
          phone: '+1 (646) 334-1010',
          role: 'HR Business Partner',
          status: 'Interviewing',
          source: 'Referral',
          score: 92,
          rating: 4.9,
          lastContact: '2026-10-03',
          resumeFile: 'daniel-brooks.pdf',
          createdAt: '2026-09-21'
        },
        {
          id: 'cand-3',
          fullName: 'Elena Rodriguez',
          email: 'elena.rodriguez@email.com',
          phone: '+1 (206) 770-3040',
          role: 'Frontend Engineer',
          status: 'Shortlist',
          source: 'Indeed',
          score: 90,
          rating: 4.7,
          lastContact: '2026-10-08',
          resumeFile: 'elena-rodriguez.pdf',
          createdAt: '2026-09-25'
        },
        {
          id: 'cand-4',
          fullName: 'Samuel Lee',
          email: 'samuel.lee@email.com',
          phone: '+1 (312) 521-1900',
          role: 'Frontend Engineer',
          status: 'Applied',
          source: 'Company Career Site',
          score: 74,
          rating: 4.2,
          lastContact: '2026-10-05',
          resumeFile: 'samuel-lee.pdf',
          createdAt: '2026-09-26'
        }
      ],
      communications: [
        {
          id: 'msg-1',
          templateName: 'Initial outreach',
          subject: 'Thank you for your interest',
          channel: 'Email',
          audience: 'Applicants',
          lastUsed: '2026-10-04',
          responseRate: 62
        },
        {
          id: 'msg-2',
          templateName: 'Interview confirmation',
          subject: 'Your interview is scheduled',
          channel: 'Email',
          audience: 'Interview candidates',
          lastUsed: '2026-10-02',
          responseRate: 81
        },
        {
          id: 'msg-3',
          templateName: 'Offer follow-up',
          subject: 'Next steps in the offer process',
          channel: 'SMS',
          audience: 'Finalists',
          lastUsed: '2026-09-30',
          responseRate: 73
        }
      ],
      screeningQuestions: [
        {
          id: 'q-1',
          question: 'What is your current notice period?',
          type: 'Short answer',
          required: true
        },
        {
          id: 'q-2',
          question: 'Which tools are you most comfortable with for stakeholder communication?',
          type: 'Multiple choice',
          required: true
        },
        {
          id: 'q-3',
          question: 'Describe a time you improved hiring efficiency.',
          type: 'Long answer',
          required: false
        }
      ]
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(seedData, null, 2));
  }
}

function readStore() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

function writeStore(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HR Talent Acquisition API running' });
});

app.get('/api/dashboard', (req, res) => {
  const store = readStore();
  const totalCandidates = store.candidates.length;
  const openJobs = store.jobs.filter((job) => job.status === 'Open').length;
  const shortlistedCandidates = store.candidates.filter((candidate) => candidate.status === 'Shortlist').length;
  const avgScore = store.candidates.reduce((total, candidate) => total + candidate.score, 0) / totalCandidates;

  res.json({
    summary: {
      totalCandidates,
      openJobs,
      shortlistedCandidates,
      avgScore: Number(avgScore.toFixed(1))
    },
    jobs: store.jobs,
    candidates: store.candidates.slice(0, 4),
    communications: store.communications
  });
});

app.get('/api/jobs', (req, res) => {
  const { jobs } = readStore();
  res.json(jobs);
});

app.post('/api/jobs', (req, res) => {
  const store = readStore();
  const payload = req.body;

  const newJob = {
    id: `job-${uuidv4()}`,
    title: payload.title,
    department: payload.department,
    location: payload.location,
    employmentType: payload.employmentType,
    status: payload.status || 'Open',
    salaryRange: payload.salaryRange || 'Not specified',
    publishedAt: new Date().toISOString().slice(0, 10),
    candidates: 0,
    priority: payload.priority || 'Medium'
  };

  store.jobs.unshift(newJob);
  writeStore(store);
  res.status(201).json(newJob);
});

app.get('/api/candidates', (req, res) => {
  const { candidates } = readStore();
  res.json(candidates);
});

app.post('/api/candidates', (req, res) => {
  const store = readStore();
  const payload = req.body;

  const newCandidate = {
    id: `cand-${uuidv4()}`,
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    role: payload.role,
    status: payload.status || 'Applied',
    source: payload.source || 'Career site',
    score: payload.score || 0,
    rating: payload.rating || 0,
    lastContact: new Date().toISOString().slice(0, 10),
    resumeFile: payload.resumeFile || 'resume.pdf',
    createdAt: new Date().toISOString().slice(0, 10)
  };

  store.candidates.unshift(newCandidate);
  writeStore(store);
  res.status(201).json(newCandidate);
});

app.get('/api/communications', (req, res) => {
  const { communications } = readStore();
  res.json(communications);
});

app.post('/api/communications', (req, res) => {
  const store = readStore();
  const payload = req.body;

  const newMessage = {
    id: `msg-${uuidv4()}`,
    templateName: payload.templateName,
    subject: payload.subject,
    channel: payload.channel,
    audience: payload.audience,
    lastUsed: new Date().toISOString().slice(0, 10),
    responseRate: payload.responseRate || 0
  };

  store.communications.unshift(newMessage);
  writeStore(store);
  res.status(201).json(newMessage);
});

app.get('/api/screening-questions', (req, res) => {
  const { screeningQuestions } = readStore();
  res.json(screeningQuestions);
});

app.listen(PORT, () => {
  console.log(`HR Talent Acquisition API is running on http://localhost:${PORT}`);
});
