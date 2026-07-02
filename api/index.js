import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const hasDB = !!(process.env.POSTGRES_URL || process.env.DATABASE_URL);
let pool = null;

if (hasDB) {
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    ssl: process.env.POSTGRES_URL ? { rejectUnauthorized: false } : false
  });
}

const defaultContent = {
  profile: {
    name: "A. Siva Kumar",
    roles: ["Software Engineer", "Full Stack Developer", "Problem Solver"],
    tagline: "Building scalable web applications and creating technology that solves real-world problems.",
    availability: "Available for Summer Internships",
    email: "contact@example.com",
    github: "https://github.com/Siva44646",
    linkedin: "https://www.linkedin.com/in/siva-kumar-1946622b3/"
  },
  about: {
    story: "As a B.Tech Computer Science Engineering Student entering my 4th year, my journey is defined by a deep passion for software development. I thrive at the intersection of design and engineering, combining a strong interest in Full Stack Development with a rigorous approach to Data Structures and Algorithms.",
    highlights: [
      { icon: "Cpu", title: "Computer Science Engineering", description: "Entering 4th year B.Tech, building a strong foundation in computer science and problem-solving." },
      { icon: "Code2", title: "Full Stack Development", description: "Passionate about modern web technologies and building scalable, user-centric applications." },
      { icon: "Rocket", title: "Continuous Growth", description: "Actively learning DSA and aspiring to build impactful products for innovative technology solutions." }
    ]
  },
  skills: [
    { title: "Frontend", skills: ["HTML", "CSS", "JavaScript", "React.js"], color: "from-cyan-400/20 to-blue-500/20", borderColor: "group-hover:border-cyan-400/50" },
    { title: "Backend", skills: ["Node.js", "Express.js"], color: "from-green-400/20 to-emerald-600/20", borderColor: "group-hover:border-green-400/50" },
    { title: "Database", skills: ["PostgreSQL", "SQLite"], color: "from-purple-400/20 to-pink-500/20", borderColor: "group-hover:border-purple-400/50" },
    { title: "Tools", skills: ["Git", "GitHub", "VS Code"], color: "from-orange-400/20 to-red-500/20", borderColor: "group-hover:border-orange-400/50" }
  ],
  timeline: [
    { type: "experience", title: "Full Stack Web Development Internship", company: "Tech Company", date: "Recent", icon: "Briefcase", highlights: ["Frontend development and UI optimization", "Backend integration and API handling", "Database interaction and modeling", "Responsive design implementation", "Real-world development workflow experience"] },
    { type: "education", title: "Bachelor of Technology (B.Tech)", company: "Computer Science Engineering", date: "Entering 4th Year", icon: "GraduationCap", highlights: ["Current academic journey in CSE", "Technical learning path focused on DSA", "Software development focus", "Growth in web technologies and problem solving"] }
  ],
  achievements: [
    { value: 10, label: "Projects Completed", suffix: "+" },
    { value: 15, label: "Technologies Learned", suffix: "+" },
    { value: 1, label: "Internship Experience", suffix: "" },
    { value: 1000, label: "Coding Hours", suffix: "+" }
  ],
  contact: {
    title: "Let's build something extraordinary together.",
    description: "Whether you have a question, a project idea, or just want to say hi, my inbox is always open. I'll try my best to get back to you!",
    location: "India",
    socials: [
      { platform: "GitHub", url: "https://github.com/Siva44646", icon: "FiGithub" },
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/siva-kumar-1946622b3/", icon: "FiLinkedin" }
    ]
  }
};

const defaultProjects = [
  { id: 1, title: 'KAAM-SETU', description: 'A platform connecting workers and customers...', tech: 'JavaScript,Node.js,PostgreSQL', github: '#', demo: 'https://kaam-setu-two.vercel.app/', color: 'from-cyan-500/20 via-blue-500/10 to-transparent' },
  { id: 2, title: 'Education Platform for Disabled Students', description: 'An inclusive educational platform...', tech: 'HTML,CSS,JavaScript,React.js', github: '#', demo: '#', color: 'from-purple-500/20 via-pink-500/10 to-transparent' }
];

// Initialize DB and Seed Data
const initializeDB = async () => {
  if (!pool) return;
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS projects (id SERIAL PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, tech TEXT NOT NULL, github TEXT, demo TEXT, color TEXT);`);
    await pool.query(`CREATE TABLE IF NOT EXISTS content (section TEXT PRIMARY KEY, data TEXT NOT NULL);`);

    const projectsRes = await pool.query("SELECT COUNT(*) FROM projects");
    if (parseInt(projectsRes.rows[0].count) === 0) {
      for (const p of defaultProjects) {
        await pool.query("INSERT INTO projects (title, description, tech, github, demo, color) VALUES ($1, $2, $3, $4, $5, $6)", [p.title, p.description, p.tech, p.github, p.demo, p.color]);
      }
    }

    const contentRes = await pool.query("SELECT COUNT(*) FROM content");
    if (parseInt(contentRes.rows[0].count) === 0) {
      for (const [section, data] of Object.entries(defaultContent)) {
        await pool.query("INSERT INTO content (section, data) VALUES ($1, $2)", [section, JSON.stringify(data)]);
      }
    }
  } catch (err) {
    console.error("Database initialization failed:", err);
  }
};

initializeDB();

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || 'sivakumar46';
  const adminPass = process.env.ADMIN_PASSWORD || 'sivakumar46';
  
  if (username === adminUser && password === adminPass) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// --- Projects APIs ---
app.get('/api/projects', async (req, res) => {
  if (!pool) return res.json(defaultProjects);
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  if (!pool) return res.json({ updatedID: req.params.id, warning: 'No database connected. Changes not saved globally.' });
  const { title, description, tech, github, demo, color } = req.body;
  try {
    await pool.query("UPDATE projects SET title = $1, description = $2, tech = $3, github = $4, demo = $5, color = $6 WHERE id = $7", [title, description, tech, github, demo, color, req.params.id]);
    res.json({ updatedID: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  if (!pool) return res.json({ id: Date.now(), warning: 'No database connected. Changes not saved globally.' });
  const { title, description, tech, github, demo, color } = req.body;
  try {
    const result = await pool.query("INSERT INTO projects (title, description, tech, github, demo, color) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", [title, description, tech, github, demo, color]);
    res.json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  if (!pool) return res.json({ deletedID: req.params.id, warning: 'No database connected. Changes not saved globally.' });
  try {
    await pool.query("DELETE FROM projects WHERE id = $1", [req.params.id]);
    res.json({ deletedID: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Content APIs ---
app.get('/api/content/:section', async (req, res) => {
  if (!pool) return res.json(defaultContent[req.params.section] || {});
  try {
    const result = await pool.query("SELECT data FROM content WHERE section = $1", [req.params.section]);
    if (result.rows.length === 0) {
      return res.json(defaultContent[req.params.section] || {});
    }
    res.json(JSON.parse(result.rows[0].data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/content', async (req, res) => {
  if (!pool) return res.json(defaultContent);
  try {
    const result = await pool.query("SELECT * FROM content");
    const allContent = { ...defaultContent };
    result.rows.forEach(r => {
      if (r.data) allContent[r.section] = JSON.parse(r.data);
    });
    res.json(allContent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/content/:section', authenticateToken, async (req, res) => {
  if (!pool) return res.json({ updatedSection: req.params.section, warning: 'No database connected. Changes not saved globally.' });
  try {
    await pool.query(
      "INSERT INTO content (section, data) VALUES ($1, $2) ON CONFLICT (section) DO UPDATE SET data = EXCLUDED.data",
      [req.params.section, JSON.stringify(req.body)]
    );
    res.json({ updatedSection: req.params.section });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server locally if not on Vercel
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
