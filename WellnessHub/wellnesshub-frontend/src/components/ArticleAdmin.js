import { useState, useEffect } from 'react';
import { apiRequest } from '../services/api.js';
import { ArticleEditor } from '../components/Article.js';

function ArticleAdmin () {
    const [articles, setArticles] = useState([]);
    const [articleId, setArticleId] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchArticles();
    }, []);

    async function fetchArticles() {
      try {
          const data = await apiRequest("/articles");
          const fetchedArticles = data.articles;
          setArticles(fetchedArticles);
      } catch (error) {
          console.error("Error fetching articles:", error);
      }
    }
  
  function handleFilter(e) {
    e.preventDefault();
    setFilter(e.target.value);
  }

  async function handleEdit (e) {
    e.preventDefault();
    setArticleId(e.target.parentNode.parentNode.id);
  }

  async function handlePublish (e) {
    e.preventDefault();
    const articleId = e.target.parentNode.parentNode.id;
    const updatedArticle = await apiRequest(`/articles/${articleId}`);
    try { 
      if (!updatedArticle.article.isPublished) {
        updatedArticle.article.isPublished = true;
        await apiRequest(`/articles/publish/${articleId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedArticle.article)
        });
        alert("Article is published.");
      } else {
        updatedArticle.article.isPublished = false;
        await apiRequest(`/articles/unpublish/${articleId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedArticle.article)
        });
        alert("Article is unpublished.");
      }
    } catch (error) {
      console.log("Unable to change publication status: ", error.message);
      alert(`Unable to change publication status: ${error.message}`);
    }
    fetchArticles();
  }

  async function handleDelete (e) {
    e.preventDefault();
    const articleId = e.target.parentNode.id;
    try {
      await apiRequest(`/articles/${articleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })
      alert("Article successfully deleted.");
    } catch (error) {
      alert("Unable to delete article: ", error.message);
    }
    fetchArticles();
  }

  return (
    <>
          <label>Filter articles by: </label>
          <select value={filter} onChange={handleFilter}>
            <option value="all">All</option>
            <option value="activity">Activities</option>
            <option value="meal">Meals</option>
          </select>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
            { !articles ? null : articles.map((article) => {
                if (article.category === filter || filter === "all") {
                  return (
                    <>
                      <tr key={article._id} id={article._id}>
                        <td>{article.title}</td>
                        <td>{article.category}</td>
                        <td>{article.isPublished ? "Published" : "Draft"}</td>
                        <td><button onClick={handleEdit}>Edit</button></td>
                        <td><button onClick={handlePublish}>{ article.isPublished ? "Unpublish" : "Publish" }</button></td>
                        <td><button onClick={handleDelete}>Delete</button></td>
                      </tr>
                    </>
                  )
                } else { 
                  return null;
                }
              }
            )}
            </tbody>
          </table>
          { articleId ? 
          <>
            <ArticleEditor articleId={articleId} />
          </>
          : null }
        </>
  )
}

export {ArticleAdmin};