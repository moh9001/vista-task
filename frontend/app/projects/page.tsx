'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth'; // From previous utils/auth.ts

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [error, setError] = useState('');
  const token = getToken();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects`);
      setProjects(res.data);
    } catch (err) {
      setError('Failed to load projects');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
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
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
      <ul>
        {projects.map((project: any) => (
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
                <button onClick={() => {
                  setEditingId(project.id);
                  setEditingTitle(project.title);
                  setEditingDescription(project.description || '');
                }} className="bg-blue-500 text-white p-2 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(project.id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}