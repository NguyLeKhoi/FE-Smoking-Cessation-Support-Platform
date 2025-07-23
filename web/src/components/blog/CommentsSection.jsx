import React, { useState } from 'react';

const mockComments = [
    {
        id: 1,
        user: {
            name: 'Capin Judicael Akpado',
            avatar: 'https://ui-avatars.com/api/?name=Capin+Judicael+Akpado',
            badge: true,
        },
        date: 'Jul 20',
        text: 'Okay !',
        likes: 2,
        replies: [],
    },
    {
        id: 2,
        user: {
            name: 'Anna kowoski',
            avatar: 'https://ui-avatars.com/api/?name=Anna+kowoski',
            badge: false,
        },
        date: 'Jul 18',
        text: 'Intresting Concept, MCP is indeed taking over the whole IT Space!!!',
        likes: 2,
        replies: [],
    },
    {
        id: 3,
        user: {
            name: 'Om Shree',
            avatar: 'https://ui-avatars.com/api/?name=Om+Shree',
            badge: false,
        },
        date: 'Jul 19',
        text: 'True 😁',
        likes: 1,
        replies: [],
    },
];

function CommentsSection() {
    const [comments, setComments] = useState(mockComments);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        const comment = {
            id: Date.now(),
            user: {
                name: 'You',
                avatar: 'https://ui-avatars.com/api/?name=You',
                badge: false,
            },
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            text: newComment,
            likes: 0,
            replies: [],
        };
        setComments([comment, ...comments]);
        setNewComment('');
    };

    return (
        <div className="comments-section">
            <div className="comments-header">
                <h2>Top comments ({comments.length})</h2>
                <button className="subscribe-btn">Subscribe</button>
            </div>
            <div className="add-comment">
                <img src="https://ui-avatars.com/api/?name=You" alt="avatar" className="avatar" />
                <textarea
                    placeholder="Add to the discussion"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                />
                <button className="add-btn" onClick={handleAddComment}>Post</button>
            </div>
            <div className="comments-list">
                {comments.map(comment => (
                    <div className="comment-card" key={comment.id}>
                        <img src={comment.user.avatar} alt="avatar" className="avatar" />
                        <div className="comment-content">
                            <div className="comment-header">
                                <span className="comment-user">{comment.user.name}</span>
                                {comment.user.badge && <span className="badge">✦✦</span>}
                                <span className="comment-date">• {comment.date}</span>
                                <span className="comment-options">⋯</span>
                            </div>
                            <div className="comment-text">{comment.text}</div>
                            <div className="comment-actions">
                                <span className="like-btn">♡ {comment.likes} likes</span>
                                <span className="reply-btn">Reply</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="comments-footer">
                <a href="#">Code of Conduct</a> · <a href="#">Report abuse</a>
            </div>
        </div>
    );
}

export default CommentsSection;
