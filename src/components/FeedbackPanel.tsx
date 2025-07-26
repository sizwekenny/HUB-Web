import React, { useState, useEffect, useRef } from 'react';
import { Comment } from '../types';
import { MessageSquare, Send, Reply } from 'lucide-react';

interface FeedbackPanelProps {
  comments: Comment[];
  activeSectionId: string | null;
  onAddComment: (content: string, sectionId: string, parentId?: string) => void;
}

interface CommentThreadProps {
  comments: Comment[];
  parentId?: string;
  onReply: (parentId: string) => void;
}

const CommentThread: React.FC<CommentThreadProps> = ({ comments, parentId, onReply }) => {
  // Filter comments for this thread
  const threadComments = comments.filter(c => 
    parentId ? c.parentId === parentId : !c.parentId
  );

  if (threadComments.length === 0) return null;

  return (
    <div className="space-y-4">
      {threadComments.map(comment => (
        <div key={comment.id} className="relative">
          <div className="flex space-x-3">
            <img 
              src={comment.author.avatar || `https://i.pravatar.cc/150?u=${comment.author.id}`} 
              alt={comment.author.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium text-gray-900">{comment.author.name}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{comment.content}</p>
              </div>
              <button 
                className="text-xs text-blue-600 mt-1 flex items-center hover:text-blue-800 transition-colors"
                onClick={() => onReply(comment.id)}
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </button>

              {/* Render child comments recursively */}
              <div className="mt-3 ml-4 pl-4 border-l-2 border-gray-200">
                <CommentThread 
                  comments={comments} 
                  parentId={comment.id}
                  onReply={onReply}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ 
  comments, 
  activeSectionId, 
  onAddComment 
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | undefined>(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Filter comments for the active section
  const sectionComments = activeSectionId 
    ? comments.filter(c => c.sectionId === activeSectionId)
    : [];

  // Get the section title based on the active section ID
  const getSectionTitle = (sectionId: string | null): string => {
    switch (sectionId) {
      case 'activities': return 'Weekly Activities';
      case 'suggestions': return 'Suggestions';
      case 'communication': return 'Communication Methods';
      case 'sessions': return 'Sessions';
      case 'register': return 'Attendance Register';
      default: return 'Select a section';
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newComment]);

  // Focus textarea when replying
  useEffect(() => {
    if (replyToId && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyToId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '' || !activeSectionId) return;
    
    onAddComment(newComment, activeSectionId, replyToId);
    setNewComment('');
    setReplyToId(undefined);
  };

  const handleReply = (commentId: string) => {
    setReplyToId(commentId);
  };

  const cancelReply = () => {
    setReplyToId(undefined);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Feedback
        </h3>
        {activeSectionId && (
          <p className="text-sm text-gray-600 mt-1">
            Section: {getSectionTitle(activeSectionId)}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!activeSectionId ? (
          <div className="text-center py-10">
            <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Select a section to view or add comments</p>
          </div>
        ) : sectionComments.length === 0 ? (
          <div className="text-center py-10">
            <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No comments on this section yet</p>
            <p className="text-sm text-gray-400 mt-1">Be the first to provide feedback</p>
          </div>
        ) : (
          <CommentThread 
            comments={sectionComments} 
            onReply={handleReply} 
          />
        )}
      </div>

      {activeSectionId && (
        <div className="border-t border-gray-200 p-4">
          {replyToId && (
            <div className="bg-gray-50 p-2 rounded-md mb-3 text-sm flex justify-between items-center">
              <span className="text-gray-700">
                Replying to comment
              </span>
              <button 
                onClick={cancelReply}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
              placeholder="Add your feedback..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!newComment.trim() || !activeSectionId}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FeedbackPanel;