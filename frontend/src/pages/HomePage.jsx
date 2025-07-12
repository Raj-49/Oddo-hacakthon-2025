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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Questions</h1>
          <p className="text-gray-600 mt-1">
            {questions.length} questions
          </p>
        </div>
        
        <Button
          as={Link}
          to="/ask"
          variant="primary"
          className="flex items-center space-x-2"
        >
          <span>Ask Question</span>
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filterButtons.map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question) => (
          <Card key={question.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                {/* Vote Section */}
                <div className="flex flex-col items-center space-y-2 text-gray-500">
                  <button
                    onClick={() => handleVote(question.id, 'up')}
                    className="vote-button hover:text-blue-600"
                  >
                    <ChevronUp className="h-5 w-5" />
                  </button>
                  <span className="text-sm font-medium">{question.votes}</span>
                  <button
                    onClick={() => handleVote(question.id, 'down')}
                    className="vote-button hover:text-red-600"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>

                {/* Question Stats */}
                <div className="flex flex-col items-center space-y-2 text-gray-500 min-w-[60px]">
                  <div className="text-center">
                    <div className={`text-sm font-medium ${
                      question.hasAcceptedAnswer ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {question.answers}
                    </div>
                    <div className="text-xs">answers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{question.views}</div>
                    <div className="text-xs">views</div>
                  </div>
                </div>

                {/* Question Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        to={`/questions/${question.id}`}
                        className="text-lg font-medium text-blue-600 hover:text-blue-800 block"
                      >
                        {question.title}
                      </Link>
                      <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                        {truncateText(question.content, 200)}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {question.tags.map((tag) => (
                      <Badge key={tag} variant="primary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Author and Time */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <Avatar
                        name={question.author.name}
                        src={question.author.avatar}
                        size="sm"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {question.author.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {question.author.reputation} reputation
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatRelativeTime(question.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-8">
        <Button variant="outline" size="lg">
          Load More Questions
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
