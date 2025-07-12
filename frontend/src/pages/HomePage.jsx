import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown, MessageCircle, Eye, Calendar, Tag } from 'lucide-react';
import { Card, CardContent, Badge, Avatar, Button } from '../components/ui';
import { formatRelativeTime, truncateText } from '../utils/helpers';
import { questionsAPI } from '../services/api';

const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data for demonstration
  const dummyQuestions = [
    {
      id: 1,
      title: "How to implement authentication in a React application?",
      content: "I'm building a React app and need to implement user authentication. What's the best approach to handle login/logout and protect routes?",
      author: {
        name: "John Doe",
        avatar: null,
        reputation: 1250
      },
      votes: 15,
      answers: 3,
      views: 247,
      tags: ["react", "authentication", "javascript"],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      hasAcceptedAnswer: false
    },
    {
      id: 2,
      title: "Best practices for state management in large React applications",
      content: "I'm working on a large React application with complex state requirements. Should I use Redux, Context API, or something else?",
      author: {
        name: "Jane Smith",
        avatar: null,
        reputation: 2850
      },
      votes: 23,
      answers: 7,
      views: 432,
      tags: ["react", "state-management", "redux", "context-api"],
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      hasAcceptedAnswer: true
    },
    {
      id: 3,
      title: "How to optimize React component performance?",
      content: "My React components are re-rendering frequently and causing performance issues. What are the best techniques to optimize component performance?",
      author: {
        name: "Mike Johnson",
        avatar: null,
        reputation: 890
      },
      votes: 8,
      answers: 2,
      views: 156,
      tags: ["react", "performance", "optimization"],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      hasAcceptedAnswer: false
    },
    {
      id: 4,
      title: "Understanding JavaScript closures with practical examples",
      content: "I'm having trouble understanding closures in JavaScript. Can someone explain them with practical examples and use cases?",
      author: {
        name: "Sarah Wilson",
        avatar: null,
        reputation: 1580
      },
      votes: 31,
      answers: 5,
      views: 789,
      tags: ["javascript", "closures", "fundamentals"],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      hasAcceptedAnswer: true
    }
  ];

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch from your API:
        // const response = await questionsAPI.getAll({ filter, search: searchTerm });
        // setQuestions(response.data);
        
        // For now, use dummy data
        setTimeout(() => {
          setQuestions(dummyQuestions);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setQuestions(dummyQuestions); // Fallback to dummy data
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [filter, searchTerm]);

  const handleVote = async (questionId, voteType) => {
    // This would call your API to vote on a question
    console.log(`Voting ${voteType} on question ${questionId}`);
    // For demo, just update local state
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? { ...q, votes: q.votes + (voteType === 'up' ? 1 : -1) }
          : q
      )
    );
  };

  const filterButtons = [
    { key: 'newest', label: 'Newest' },
    { key: 'active', label: 'Active' },
    { key: 'votes', label: 'Votes' },
    { key: 'unanswered', label: 'Unanswered' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen pb-12 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight gradient-text">All Questions</h1>
          <p className="text-gray-500 mt-1 text-base sm:text-lg">
            {questions.length} questions
          </p>
        </div>
        <Button
          as={Link}
          to="/ask"
          variant="primary"
          className="flex items-center space-x-2 shadow-lg rounded-xl text-base sm:text-lg px-4 sm:px-6 py-2 w-full sm:w-auto"
        >
          <span>Ask Question</span>
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mt-2">
        {filterButtons.map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? 'primary' : 'outline'}
            size="sm"
            className={`rounded-full px-3 sm:px-4 py-1 text-sm sm:text-base font-semibold transition-all shadow ${filter === key ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4 mt-4">
        {questions.map((question) => (
          <Card key={question.id} className="hover:shadow-xl transition-shadow rounded-2xl border border-gray-100 bg-white/90 backdrop-blur-md">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Vote Section */}
                <div className="flex flex-row sm:flex-col items-center space-x-2 sm:space-x-0 sm:space-y-2 text-gray-500">
                  <button
                    onClick={() => handleVote(question.id, 'up')}
                    className="vote-button hover:text-blue-600"
                  >
                    <ChevronUp className="h-5 w-5" />
                  </button>
                  <span className="font-bold text-lg text-blue-600">{question.votes}</span>
                  <button
                    onClick={() => handleVote(question.id, 'down')}
                    className="vote-button hover:text-red-500"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                  <Link to={`/questions/${question.id}`} className="text-base sm:text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                    {question.title}
                  </Link>
                  <p className="text-gray-600 mt-2 text-sm sm:text-base">{truncateText(question.content, 150)}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {question.tags.map(tag => (
                      <Badge key={tag} className="bg-blue-100 text-blue-600 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shadow-sm">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-4 text-xs sm:text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {question.views} views</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {question.answers} answers</span>
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {formatRelativeTime(question.createdAt)}</span>
                  </div>
                </div>

                {/* Author Section */}
                <div className="flex flex-col items-center justify-center min-w-[60px] sm:min-w-[80px]">
                  <Avatar name={question.author.name} src={question.author.avatar} size="sm" />
                  <span className="text-xs font-semibold text-gray-700 mt-1">{question.author.name}</span>
                  <span className="text-xs text-gray-400">{question.author.reputation} rep</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <style>{`
        .gradient-text {
          background: linear-gradient(135deg, #2563eb 0%, #38bdf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
