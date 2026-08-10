import Markdown from 'react-markdown';
import { useState, useEffect } from 'react';

function ArticleDisplay ({articleId}) {

    const [ content, setContent ] = useState({articleId: "", author: "", title: "", category: "", activity: {activityType: "", body: ""}, meal: {name: "", cuisine: "", mealType: "", body: "", ingredients: []}});
    
    useEffect(() => {
        async function fetchContent() {
            try {
                const response = await fetch(`http://localhost:3000/api/articles/${articleId}`);
                const data = await response.json();
                setContent(data.article);
            } catch (error) {
                console.error("Error fetching article content:", error);
            }
        }
        fetchContent();
    }, [articleId]);

    return (
        <>
            <div className="article-header">
                <h1>{content.title}</h1>
                <p>By {content.author}</p>
                <p>In: {content.activity.activityType}</p>
            </div>
            <div className="article-content">
                <Markdown>{content.activity.body}</Markdown>
            </div>
        </>
    );
};

function ArticleEditor () {

    const [ content, setContent ] = useState({author: "", title: "", category: "", activity: {activityType: "", body: ""}, meal: {name: "", cuisine: "", mealType: "", body: "", ingredients: []}});

    function handleChange(e) {
        setContent(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        // Insert correct submission logic once endpoints are in place.
        console.log("Submitted content: ", {content});
    }
    
    return (
        <>
            <div className="article-editor">
                <form onSubmit={handleSubmit}>
                    <label>Category:</label>
                    <select value={content.category} onChange={handleChange}>
                        <option value="activity">Activity</option>
                        <option value="meal">Meal</option>
                    </select>
                    <label>Author:</label>
                    <textarea value={content.author} />
                    <label>Title:</label>
                    <textarea value={content.title} />
                    <label>Enter content here in Markdown format:</label>
                    <textarea 
                        value={content.activity.body}
                        onChange={handleChange} 
                        rows="10"
                        cols="50"
                    />
                    <input type="submit" />
                </form>
            </div>
            <div className="article-preview">
                <p>Preview:</p>
                <Markdown>{content}</Markdown>
            </div>
        </>
    );
}

export {ArticleDisplay, ArticleEditor};