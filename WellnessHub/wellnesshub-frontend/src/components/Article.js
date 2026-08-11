import Markdown from 'react-markdown';
import { useState, useEffect } from 'react';

function ArticleDisplay ({articleId}) {

    const [ content, setContent ] = useState({articleId: "", author: "", title: "", category: "activity"});
    
    useEffect(() => {
        async function fetchContent() {
            try {
                const data = await fetch(`http://localhost:3000/api/articles/${articleId}`);
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

function ArticleEditor () {

    const [ content, setContent ] = useState({author: "", title: "", category: "", activity: {activityType: "", body: ""}, meal: {name: "", cuisine: "", mealType: "", body: "", ingredients: []}});

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

    async function handleSubmit(e) {
        e.preventDefault();
            const result = await fetch("http://localhost:3000/api/articles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(content)
            });
            if (!result.ok) {
                console.error("Error submitting article: ", result.statusText);
                alert(`Error submitting article. Please try again.
                       Error: ${result.statusText}`);
            } else {
                alert("Article submitted successfully!");
                console.log("Submitted content: ", {content});
        }
    }
    
    return (
        <>
            <div className="article-editor">
                <form onSubmit={handleSubmit}>
                    <table>
                        <tbody>
                        <tr>
                            <td><label>Category:</label></td>
                            <td><select value={content.category} defaultValue="activity" onChange={handleCategoryChange}>
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
                    <input type="submit" />
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