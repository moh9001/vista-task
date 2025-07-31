'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth'; // From Task 3.4 hook
import { Input } from '../components/Input';
import { Button } from '../components/Button';

interface Project {
  id: number;
  title: string;
  description: string;
  ownerId: number;
  createdAt: string;
  owner: { id: number; name: string };
}

export default function Projects() {
  const { token, logout } = useAuth(); // From Task 3.4: Use auth hook for token and logout
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects`);
      if (Array.isArray(res.data)) {
        setProjects(res.data);
      } else {
        setProjects([]);
        setError('Invalid data from server');
      }
    } catch (err) {
      setError('Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setError('Not authenticated');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/projects`, { title, description }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTitle('');
      setDescription('');
      fetchProjects();
    } catch (err) {
      setError('Failed to create project');
    }
  };

  const handleUpdate = async (id: number) => {
    if (!token) return setError('Not authenticated');
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, { title: editingTitle, description: editingDescription }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingId(null);
      fetchProjects();
    } catch (err) {
      setError('Failed to update project');
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return setError('Not authenticated');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjects();
    } catch (err) {
      setError('Failed to delete project');
    }
  };

return (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-6">Projects</h1>
    {token && <button onClick={logout} className="bg-red-500 text-white p-2 rounded mb-4">Logout</button>}
    {error && <p className="text-red-500 mb-4">{error}</p>}
    {token && (
      <form onSubmit={handleCreate} className="mb-8">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded mr-2"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Create Project</button>
      </form>
    )}
    {loading ? (
      <p>Loading projects...</p>
    ) : (
      <ul>
        {projects.map((project) => (
          <li key={project.id} className="mb-4 p-4 border rounded">
            {editingId === project.id ? (
              <div>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="p-2 border rounded mr-2"
                />
                <input
                  type="text"
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  className="p-2 border rounded mr-2"
                />
                <button onClick={() => handleUpdate(project.id)} className="bg-blue-500 text-white p-2 rounded mr-2">Save</button>
                <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold">{project.title}</h2>
                <p>{project.description}</p>
                <p>Owner: {project.owner.name}</p>
                {token && (
                  <>
                    <button onClick={() => {
                      setEditingId(project.id);
                      setEditingTitle(project.title);
                      setEditingDescription(project.description || '');
                    }} className="bg-blue-500 text-white p-2 rounded mr-2">Edit</button>
                    <button onClick={() => handleDelete(project.id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
                  </>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);
}