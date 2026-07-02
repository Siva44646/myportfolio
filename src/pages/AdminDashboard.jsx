import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Save, Plus, Trash2, GripVertical } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [content, setContent] = useState({
    profile: {}, about: { highlights: [] }, skills: [], timeline: [], achievements: []
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [contentRes, projectsRes] = await Promise.all([
        axios.get('/api/content'),
        axios.get('/api/projects')
      ]);
      
      setContent({
        profile: contentRes.data.profile || {},
        about: contentRes.data.about || { highlights: [] },
        skills: contentRes.data.skills || [],
        timeline: contentRes.data.timeline || [],
        achievements: contentRes.data.achievements || [],
      });
      setProjects(projectsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  // --- Content Handlers ---
  const handleContentChange = (section, field, value) => {
    setContent({
      ...content,
      [section]: field ? { ...content[section], [field]: value } : value
    });
  };

  const handleNestedArrayChange = (section, arrayField, index, field, value) => {
    const newArray = [...content[section][arrayField]];
    newArray[index] = { ...newArray[index], [field]: value };
    setContent({
      ...content,
      [section]: { ...content[section], [arrayField]: newArray }
    });
  };

  const handleRootArrayChange = (section, index, field, value) => {
    const newArray = [...content[section]];
    newArray[index] = { ...newArray[index], [field]: value };
    setContent({
      ...content,
      [section]: newArray
    });
  };

  const addArrayItem = (section, arrayField, defaultItem) => {
    if (arrayField) {
      setContent({
        ...content,
        [section]: { 
          ...content[section], 
          [arrayField]: [...(content[section][arrayField] || []), defaultItem] 
        }
      });
    } else {
      setContent({
        ...content,
        [section]: [...(content[section] || []), defaultItem]
      });
    }
  };

  const removeArrayItem = (section, arrayField, index) => {
    if (arrayField) {
      const newArray = [...content[section][arrayField]];
      newArray.splice(index, 1);
      setContent({
        ...content,
        [section]: { ...content[section], [arrayField]: newArray }
      });
    } else {
      const newArray = [...content[section]];
      newArray.splice(index, 1);
      setContent({
        ...content,
        [section]: newArray
      });
    }
  };

  const handleSaveContent = async (section) => {
    const token = localStorage.getItem('adminToken');
    try {
      await axios.put(`/api/content/${section}`, content[section], {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`${section} saved successfully!`);
    } catch (err) {
      alert('Error saving content');
    }
  };

  // --- Projects Handlers ---
  const handleProjectUpdate = async (project) => {
    const token = localStorage.getItem('adminToken');
    try {
      await axios.put(`/api/projects/${project.id}`, project, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Project saved!');
    } catch (err) {
      alert('Error saving project');
    }
  };

  const handleProjectDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      alert('Error deleting project');
    }
  };

  const handleProjectAdd = async () => {
    const token = localStorage.getItem('adminToken');
    const newProject = {
      title: 'New Project',
      description: 'Project description',
      tech: 'React,Node',
      github: '#',
      demo: '#',
      color: 'from-cyan-500/20 via-blue-500/10 to-transparent'
    };
    try {
      const res = await axios.post('/api/projects', newProject, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects([...projects, { ...newProject, id: res.data.id }]);
    } catch (err) {
      alert('Error adding project');
    }
  };

  const handleProjectChange = (id, field, value) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-neutral-950">Loading...</div>;

  const tabs = ['profile', 'about', 'skills', 'timeline', 'achievements', 'projects'];

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? 'bg-cyan-500 text-black' : 'bg-white/5 hover:bg-white/10'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="glass p-8 rounded-3xl border border-white/5">
          
          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">Profile & Links</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-neutral-400">Name</label>
                  <input value={content.profile.name || ''} onChange={(e) => handleContentChange('profile', 'name', e.target.value)} className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-cyan-400/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-neutral-400">Availability Banner</label>
                  <input value={content.profile.availability || ''} onChange={(e) => handleContentChange('profile', 'availability', e.target.value)} className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-cyan-400/50" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs text-neutral-400">Tagline</label>
                  <textarea value={content.profile.tagline || ''} onChange={(e) => handleContentChange('profile', 'tagline', e.target.value)} rows={2} className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-cyan-400/50" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs text-neutral-400">Roles (Comma Separated)</label>
                  <input value={(content.profile.roles || []).join(', ')} onChange={(e) => handleContentChange('profile', 'roles', e.target.value.split(',').map(r => r.trim()))} className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-cyan-400/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-neutral-400">Email Address</label>
                  <input value={content.profile.email || ''} onChange={(e) => handleContentChange('profile', 'email', e.target.value)} className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-cyan-400/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-neutral-400">GitHub Link</label>
                  <input value={content.profile.github || ''} onChange={(e) => handleContentChange('profile', 'github', e.target.value)} className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-cyan-400/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-neutral-400">LinkedIn Link</label>
                  <input value={content.profile.linkedin || ''} onChange={(e) => handleContentChange('profile', 'linkedin', e.target.value)} className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-cyan-400/50" />
                </div>
              </div>
              <button onClick={() => handleSaveContent('profile')} className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 transition-colors text-sm font-bold">
                <Save size={16} /> Save Profile
              </button>
            </div>
          )}

          {/* ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold mb-4">Main Story Text</h2>
                <textarea value={content.about.story || ''} onChange={(e) => handleContentChange('about', 'story', e.target.value)} rows={5} className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400/50" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Highlights</h2>
                  <button onClick={() => addArrayItem('about', 'highlights', { icon: 'Cpu', title: 'New Highlight', description: 'Description here' })} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
                    <Plus size={14} /> Add Highlight
                  </button>
                </div>
                
                <div className="space-y-4">
                  {(content.about.highlights || []).map((highlight, index) => (
                    <div key={index} className="bg-neutral-900/50 border border-white/5 p-4 rounded-2xl relative group">
                      <button onClick={() => removeArrayItem('about', 'highlights', index)} className="absolute top-4 right-4 text-neutral-500 hover:text-red-400 transition-colors">
                        <Trash2 size={16} />
                      </button>
                      
                      <div className="grid md:grid-cols-2 gap-4 pr-8">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-neutral-500 font-bold">Title</label>
                          <input value={highlight.title} onChange={(e) => handleNestedArrayChange('about', 'highlights', index, 'title', e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-400/50" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-neutral-500 font-bold">Icon (Cpu, Code2, Rocket, Briefcase, GraduationCap)</label>
                          <input value={highlight.icon} onChange={(e) => handleNestedArrayChange('about', 'highlights', index, 'icon', e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-400/50" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] uppercase text-neutral-500 font-bold">Description</label>
                          <input value={highlight.description} onChange={(e) => handleNestedArrayChange('about', 'highlights', index, 'description', e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-400/50" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => handleSaveContent('about')} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 transition-colors text-sm font-bold">
                <Save size={16} /> Save About
              </button>
            </div>
          )}

          {/* SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Skill Categories</h2>
                <button onClick={() => addArrayItem('skills', null, { title: 'New Category', skills: ['Skill 1'], color: 'from-cyan-400/20 to-blue-500/20', borderColor: 'group-hover:border-cyan-400/50' })} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
                  <Plus size={14} /> Add Category
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {(content.skills || []).map((cat, index) => (
                  <div key={index} className="bg-neutral-900/50 border border-white/5 p-5 rounded-2xl relative">
                    <button onClick={() => removeArrayItem('skills', null, index)} className="absolute top-5 right-5 text-neutral-500 hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="space-y-4 pr-8">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-neutral-500 font-bold">Category Title</label>
                        <input value={cat.title} onChange={(e) => handleRootArrayChange('skills', index, 'title', e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-400/50" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-neutral-500 font-bold">Skills (Comma Separated)</label>
                        <input value={cat.skills.join(', ')} onChange={(e) => handleRootArrayChange('skills', index, 'skills', e.target.value.split(',').map(s => s.trim()))} className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-400/50" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => handleSaveContent('skills')} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 transition-colors text-sm font-bold">
                <Save size={16} /> Save Skills
              </button>
            </div>
          )}

          {/* TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Timeline & Education</h2>
                <button onClick={() => addArrayItem('timeline', null, { type: 'experience', title: 'New Role', company: 'Company', date: '2024', icon: 'Briefcase', highlights: ['Responsibility 1'] })} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
                  <Plus size={14} /> Add Event
                </button>
              </div>

              <div className="space-y-6">
                {(content.timeline || []).map((event, index) => (
                  <div key={index} className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl relative">
                    <button onClick={() => removeArrayItem('timeline', null, index)} className="absolute top-6 right-6 text-neutral-500 hover:text-red-400 transition-colors">
                      <Trash2 size={18} />
                    </button>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pr-10">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-neutral-500 font-bold">Title (Role/Degree)</label>
                        <input value={event.title} onChange={(e) => handleRootArrayChange('timeline', index, 'title', e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-400/50" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-neutral-500 font-bold">Company / Institution</label>
                        <input value={event.company} onChange={(e) => handleRootArrayChange('timeline', index, 'company', e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-400/50" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-neutral-500 font-bold">Date / Duration</label>
                        <input value={event.date} onChange={(e) => handleRootArrayChange('timeline', index, 'date', e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-400/50" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-neutral-500 font-bold">Icon (Briefcase, GraduationCap...)</label>
                        <input value={event.icon} onChange={(e) => handleRootArrayChange('timeline', index, 'icon', e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-400/50" />
                      </div>
                      <div className="space-y-1 lg:col-span-2">
                        <label className="text-[10px] uppercase text-neutral-500 font-bold">Highlights/Bullets (Comma Separated)</label>
                        <textarea rows={2} value={event.highlights.join(', ')} onChange={(e) => handleRootArrayChange('timeline', index, 'highlights', e.target.value.split(',').map(h => h.trim()))} className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-400/50" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => handleSaveContent('timeline')} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 transition-colors text-sm font-bold">
                <Save size={16} /> Save Timeline
              </button>
            </div>
          )}

          {/* ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Achievements & Stats</h2>
                <button onClick={() => addArrayItem('achievements', null, { value: 0, label: 'New Stat', suffix: '+' })} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
                  <Plus size={14} /> Add Stat
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(content.achievements || []).map((stat, index) => (
                  <div key={index} className="bg-neutral-900/50 border border-white/5 p-5 rounded-2xl relative">
                    <button onClick={() => removeArrayItem('achievements', null, index)} className="absolute top-3 right-3 text-neutral-500 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                    
                    <div className="space-y-3 pr-6">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-neutral-500 font-bold">Label</label>
                        <input value={stat.label} onChange={(e) => handleRootArrayChange('achievements', index, 'label', e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-cyan-400/50" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-neutral-500 font-bold">Value (Number or Word)</label>
                          <input type="text" value={stat.value} onChange={(e) => handleRootArrayChange('achievements', index, 'value', e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-cyan-400/50" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-neutral-500 font-bold">Suffix (e.g. +)</label>
                          <input value={stat.suffix} onChange={(e) => handleRootArrayChange('achievements', index, 'suffix', e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-cyan-400/50" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => handleSaveContent('achievements')} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 transition-colors text-sm font-bold">
                <Save size={16} /> Save Achievements
              </button>
            </div>
          )}

          {/* PROJECTS */}
          {activeTab === 'projects' && (
            <div>
              <div className="mb-8 flex justify-between items-center">
                <h2 className="text-xl font-bold">Manage Projects</h2>
                <button onClick={handleProjectAdd} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-neutral-200 transition-colors text-sm">
                  <Plus size={16} /> Add Project
                </button>
              </div>

              <div className="space-y-6">
                {projects.map(project => (
                  <div key={project.id} className="bg-neutral-900/50 p-6 rounded-2xl border border-white/5">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="text-xs text-neutral-400">Title</label>
                        <input value={project.title} onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-cyan-400/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-neutral-400">Technologies (comma separated)</label>
                        <input value={project.tech} onChange={(e) => handleProjectChange(project.id, 'tech', e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-cyan-400/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-neutral-400">GitHub URL</label>
                        <input value={project.github} onChange={(e) => handleProjectChange(project.id, 'github', e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-cyan-400/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-neutral-400">Live Demo URL</label>
                        <input value={project.demo} onChange={(e) => handleProjectChange(project.id, 'demo', e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-cyan-400/50" />
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <label className="text-xs text-neutral-400">Description</label>
                      <textarea value={project.description} onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)} rows={3} className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-cyan-400/50 resize-none" />
                    </div>

                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleProjectDelete(project.id)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium">
                        <Trash2 size={16} /> Delete
                      </button>
                      <button onClick={() => handleProjectUpdate(project)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm font-medium">
                        <Save size={16} /> Save Changes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
