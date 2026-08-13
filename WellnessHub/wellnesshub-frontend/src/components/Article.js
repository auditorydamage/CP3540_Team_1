import Markdown from 'react-markdown';
import { useState, useEffect } from 'react';
import { apiRequest, getStoredAccount } from '../services/api.js';

function ArticleDisplay ({articleId}) {

    const [ content, setContent ] = useState({_id: "", author: "", title: "", category: "", subhead: ""});
    
    useEffect(() => {
        async function fetchContent() {
            try {
                const data = await apiRequest(`/articles/${articleId}`);
                const fetchedArticle = await data.json();
                setContent(fetchedArticle.article);
            } catch (error) {
                console.error("Error fetching article content:", error);
                alert(`Error fetching article content. Please try again.
                       Error: ${error.message}`);
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

function ArticleEditor ({articleId}) {

    const [ content, setContent ] = useState({author: "", title: "", category: "", activity: {activityType: "", body: ""}, meal: {cuisine: "", mealType: "", body: ""}});
    

    useEffect(() => {
        if (articleId) {
            console.log("Article ID passed: ", articleId);
            loadContentForEdit(articleId);
        } else {
            console.log("No article ID passed, blank entry.");
            const account = getStoredAccount();
            setContent({...content, author: account.username, category: "activity"});
        }
    },[articleId]);

    function handleTitleChange(e) {
        e.preventDefault();
        setContent({...content, title: e.target.value});
    }

    function handleSubheadChange(e) {
        e.preventDefault();
        setContent({...content, subhead: e.target.value});
    }

    function handleCategoryChange(e) {
        e.preventDefault();
        setContent({...content, category: e.target.value});
    }

    function handleBodyChange(e) {
        e.preventDefault();
        if (content.category === "activity") {
            setContent({...content, activity: {...content.activity, body: e.target.value}});
        } else if (content.category === "meal") {
            setContent({...content, meal: {...content.meal, body: e.target.value}});
        }
    }

    function handleActivityTypeChange(e) {
        e.preventDefault();
        setContent({...content, activity: {...content.activity, activityType: e.target.value}});
    }

    function handleMealTypeChange(e) {
        e.preventDefault();
        setContent({...content, meal: {...content.meal, mealType: e.target.value}});
    }

    function handleCuisineChange(e) {
        e.preventDefault();
        setContent({...content, meal: {...content.meal, cuisine: e.target.value}});
    }

    async function loadContentForEdit(articleId) {
            const articleToEdit = await apiRequest(`/articles/${articleId}`);
            setContent({...articleToEdit.article});
    }

    async function handleSubmit(e) {
        e.preventDefault();
        console.log({...content});
        try {
            const resetAuthor = getStoredAccount();
            if (!content._id && resetAuthor.accountType === "provider") {
                const result = await apiRequest("/articles", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({...content})
                });
                alert("Article submitted successfully!");
                console.log(result);
            } else {
                const contentId = content._id;
                const result = await apiRequest(`/articles/${contentId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({...content})
                });
                alert("Article updated successfully!");
                console.log(result);
            }
            if (resetAuthor.accountType === "provider") {
                setContent({author: resetAuthor.username, title: "", category: "activity", subhead: "", activity: {activityType: "", body: ""}, meal: {cuisine: "", mealType: "", body: ""}});
            } else {
                setContent({author: "", title: "", category: "activity", subhead: "", activity: {activityType: "", body: ""}, meal: {cuisine: "", mealType: "", body: ""}});
            }
        } catch (error) {
            console.error("Error submitting article: ", error.message);
            alert(`Error submitting article. Please try again.
                   Error: ${error.message}`);
        }
    }

    function handleClear(e) {
        e.preventDefault();
        const resetAuthor = getStoredAccount();
        if (resetAuthor.accountType === "provider") {
            setContent({author: resetAuthor.username, title: "", category: "activity", subhead: "", activity: {activityType: "", body: ""}, meal: {cuisine: "", mealType: "", body: ""}});
        } else {
            setContent({author: "", title: "", category: "activity", subhead: "", activity: {activityType: "", body: ""}, meal: {cuisine: "", mealType: "", body: ""}});
        }
    }
    
    return (
        <>
            <div className="article-editor">
                <form onSubmit={handleSubmit}>
                    <table>
                        <tbody>
                        <tr>
                            <td>Author:</td>
                            <td>{content.author}</td>
                        </tr>
                        <tr>
                            <td><label>Category:</label></td>
                            <td><select value={content.category} onChange={handleCategoryChange}>
                                <option value="meal">Meal</option>
                                <option value="activity">Activity</option>
                            </select></td>
                        </tr>
                        { content.category === "activity" ?
                            <>
                            <tr>
                                <td><label>Activity type:</label></td>
                                <td><input type="text" name="activity.activityType" value={content.activity.activityType} onChange={handleActivityTypeChange} /></td>
                            </tr>
                            </>
                         : 
                         <>
                            <tr>
                                <td><label>Meal type:</label></td>
                                <td><input type="text" name="meal.mealType" value={content.meal.mealType} onChange={handleMealTypeChange} /></td>
                            </tr>
                            <tr>
                                <td><label>Cuisine:</label></td>
                                <td><input type="text" name="meal.cuisine" value={content.meal.cuisine} onChange={handleCuisineChange} /></td>
                            </tr>
                            </> }
                        <tr>
                            <td><label>Title:</label></td>
                            <td><input type="text" name="title" value={content.title} onChange={handleTitleChange} /></td>
                        </tr>
                        <tr>
                            <td><label>Subhead:</label></td>
                            <td><input type="text" name="subhead" value={content.subhead} onChange={handleSubheadChange} /></td>
                        </tr>
                        </tbody>
                    </table>
                    <label>Enter content here in Markdown format:</label>
                    <textarea 
                        name="body"
                        value={content.category === "activity" ? content.activity.body : content.meal.body}
                        onChange={handleBodyChange}
                        rows="30"
                        cols="100"
                    /><br />
                    <input type="submit" /> <button onClick={handleClear}>Reset</button>
                </form>
            </div>
            <div className="article-preview">
                <p>Preview:</p>
                <Markdown>{content.category === "activity" ? content.activity.body : content.meal.body}</Markdown>
            </div>
        </>
    );
}

export {ArticleDisplay, ArticleEditor};