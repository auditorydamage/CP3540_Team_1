import Markdown from 'react-markdown';
import { useState, useEffect } from 'react';

function ArticleDisplay ({articleId}) {

    const [ content, setContent ] = useState({articleId: "", author: "", title: "", category: "", activity: {activityType: "", body: ""}, meal: {name: "", cuisine: "", mealType: "", body: "", ingredients: []}});
    
    useEffect(() => {
        async function fetchContent() {
            try {
                const data = await fetch(`http://localhost:3000/api/articles/${articleId}`);
                const fetchedArticle = await data.json();
                setContent(fetchedArticle.article);
            } catch (error) {
                console.error("Error fetching article content:", error);
            }
        }
        fetchContent();
    }, [articleId]);

    return (
        <>
            <div className="article-header">
                <h3>{content.title}</h3>
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

    function handleTitleChange(e) {
        e.preventDefault();
        setContent({...content, title: e.target.value});
    }

    function handleCategoryChange(e) {
        e.preventDefault();
        setContent({...content, category: e.target.value});
    }

    function handleBodyChange(e) {
        e.preventDefault();
        setContent({...content, activity: {...content.activity, body: e.target.value}});
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
                    <table>
                        <tbody>
                        <tr>
                            <td><label>Category:</label></td>
                            <td><select value={content.category} onChange={handleCategoryChange}>
                                <option value="activity">Activity</option>
                                <option value="meal">Meal</option>
                            </select></td>
                        </tr>
                        <tr>
                            <td><label>Title:</label></td>
                            <td><input type="text" name="title" value={content.title} onChange={handleTitleChange} /></td>
                        </tr>
                        </tbody>
                    </table>
                    <label>Enter content here in Markdown format:</label>
                    <textarea 
                        name="activity.body"
                        value={content.activity.body}
                        onChange={handleBodyChange}
                        rows="30"
                        cols="100"
                    /><br />
                    <input type="submit" />
                </form>
            </div>
            <div className="article-preview">
                <p>Preview:</p>
                <Markdown>{content.activity.body}</Markdown>
            </div>
        </>
    );
}

export {ArticleDisplay, ArticleEditor};