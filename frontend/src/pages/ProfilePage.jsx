import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/profileService';
import { Card, CardHeader, CardContent, Input, Button, Avatar, Badge, Textarea } from '../components/ui';

const ProfilePage = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [userQuestions, setUserQuestions] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await profileService.getProfile();
        setProfile(data);
        setForm({ username: data.username, email: data.email });
        // Fetch user's questions
        const questions = await profileService.getUserQuestions();
        setUserQuestions(questions);
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const updated = await profileService.updateProfile(form);
      setProfile({ ...profile, ...updated });
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading profile...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar name={profile.username} size="lg" />
          <div>
            {editMode ? (
              <form onSubmit={handleSave} className="flex flex-col gap-2">
                <Input name="username" value={form.username} onChange={handleChange} placeholder="Username" required />
                <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
                <div className="flex gap-2 mt-2">
                  <Button type="submit" disabled={saving} variant="primary">Save</Button>
                  <Button type="button" variant="secondary" onClick={() => setEditMode(false)} disabled={saving}>Cancel</Button>
                </div>
              </form>
            ) : (
              <>
                <div className="text-xl font-bold">{profile.username}</div>
                <div className="text-gray-600">{profile.email}</div>
                <div className="mt-2">
                  <Badge variant="primary">{profile.role}</Badge>
                  {profile.is_banned && <Badge variant="danger" className="ml-2">Banned</Badge>}
                </div>
                <Button className="mt-3" variant="outline" size="sm" onClick={() => setEditMode(true)}>Edit Profile</Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8 mt-2">
            <div>
              <div className="text-lg font-semibold">Questions</div>
              <div className="text-2xl font-bold">{profile.stats?.questionCount || 0}</div>
            </div>
            <div>
              <div className="text-lg font-semibold">Answers</div>
              <div className="text-2xl font-bold">{profile.stats?.answerCount || 0}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-lg font-bold">Your Questions</div>
        </CardHeader>
        <CardContent>
          {userQuestions.length ? (
            <ul className="divide-y">
              {userQuestions.map(q => (
                <li key={q._id} className="py-3">
                  <div className="font-semibold">{q.title}</div>
                  <div className="text-gray-500 text-sm">{new Date(q.createdAt).toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Status: {q.status} | Answers: {q.answersCount}</div>
                </li>
              ))}
            </ul>
          ) : <div className="text-gray-500">No questions yet.</div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-lg font-bold">Your Answers</div>
        </CardHeader>
        <CardContent>
          {profile.activity?.answers?.length ? (
            <ul className="divide-y">
              {profile.activity.answers.map(a => (
                <li key={a._id} className="py-3">
                  <div className="text-gray-700">{a.body}</div>
                  <div className="text-gray-500 text-sm">{new Date(a.createdAt).toLocaleString()}</div>
                  {a.question && (
                    <div className="text-xs text-blue-600">On: {a.question.title}</div>
                  )}
                  <div className="text-xs text-gray-400">Status: {a.status}</div>
                </li>
              ))}
            </ul>
          ) : <div className="text-gray-500">No answers yet.</div>}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
