import Markdown from 'react-markdown';
import { useState } from 'react';
import { fetchArticle } from './article.controller.js';

function ArticleDisplay ({articleId}) {

    const [ content, setContent ] = useState({articleId: "", author: "", title: "", category: "", activity: {activityType: "", body: ""}, meal: {name: "", cuisine: "", mealType: "", body: "", ingredients: []}});
    setContent(fetchArticle(articleId));

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