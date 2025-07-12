import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent, Badge, Avatar, Button } from '../components/ui';
import { ChevronUp, ChevronDown, MessageCircle } from 'lucide-react';
import { formatRelativeTime } from '../utils/helpers';

const QuestionDetailPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/questions/${id}`);
        const data = await response.json();
        setQuestion(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch question');
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }
  if (error) {
    return <div className="text-center text-red-600 py-12">{error}</div>;
  }
  if (!question) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="rounded-2xl border border-gray-100 bg-white/90 backdrop-blur-md">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{question.title}</h1>
          <p className="text-gray-700 mb-4 text-base">{question.body}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.isArray(question.tags) && question.tags.map(tag => (
              <Badge key={tag.id || tag.name} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">{tag.name}</Badge>
            ))}
          </div>
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Button variant="ghost" size="sm"><ChevronUp className="h-5 w-5" /></Button>
              <span className="font-bold text-lg text-blue-600">{question.votes || 0}</span>
              <Button variant="ghost" size="sm"><ChevronDown className="h-5 w-5" /></Button>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <MessageCircle className="h-5 w-5" />
              <span>{Array.isArray(question.answers) ? question.answers.length : 0} Comments</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Avatar name={question.user_id?.username || 'Unknown'} src={null} size="sm" />
            <span className="text-xs font-semibold text-gray-700">{question.user_id?.username || 'Unknown'}</span>
            <span className="text-xs text-gray-400">{formatRelativeTime(question.createdAt)}</span>
          </div>
        </CardContent>
      </Card>
      {/* Comments section can be added here */}
    </div>
  );
};

export default QuestionDetailPage;
