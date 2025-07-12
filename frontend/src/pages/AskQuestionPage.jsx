import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, X } from 'lucide-react';
import { Card, CardHeader, CardContent, Button, Input, Textarea } from '../components/ui';
import { questionsAPI } from '../services/api';
import { toast } from 'react-toastify';
const AskQuestionPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Question content is required';
    } else if (formData.content.length < 20) {
      newErrors.content = 'Question content must be at least 20 characters';
    }
    
    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    } else if (formData.tags.length > 5) {
      newErrors.tags = 'Maximum 5 tags allowed';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare payload for backend
      const payload = {
        title: formData.title,
        body: formData.content,
        tags: formData.tags
      };
      const response = await questionsAPI.create(payload);
      toast.success('Question submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting question:', error);
      setErrors({ submit: 'Failed to submit question. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask a Question</h1>
        <p className="text-gray-600">
          Get help from the community by asking a clear and detailed question.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Writing a good question</h2>
          <p className="text-gray-600 text-sm">
            The community is here to help you with specific coding problems. To get the best answers:
          </p>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li>• Be specific about your problem</li>
            <li>• Include relevant code and error messages</li>
            <li>• Explain what you've tried so far</li>
            <li>• Add appropriate tags to help others find your question</li>
          </ul>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., How do I center a div in CSS?"
                error={!!errors.title}
                className="w-full"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Be specific and imagine you're asking a question to another person.
              </p>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Question Details
              </label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Provide more details about your question. Include any relevant code, error messages, or context that would help others understand your problem."
                rows={10}
                className="w-full"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Include all the information someone would need to answer your question.
              </p>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  variant="outline"
                  disabled={!currentTag.trim()}
                >
                  Add Tag
                </Button>
              </div>
              {errors.tags && (
                <p className="mt-1 text-sm text-red-600">{errors.tags}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Add up to 5 tags to describe what your question is about.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? 'Submitting...' : 'Post Question'}
              </Button>
            </div>

            {errors.submit && (
              <div className="text-red-600 text-sm">{errors.submit}</div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AskQuestionPage;
