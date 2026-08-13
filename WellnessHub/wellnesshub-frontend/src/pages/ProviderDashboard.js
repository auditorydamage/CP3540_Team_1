import { useState, useEffect } from "react";
import { ArticleEditor } from "../components/Article.js";
import { apiRequest, getStoredAccount } from "../services/api.js";

function ProviderDashboard() {
  const [articles, setArticles] = useState([]);
  const [articleId, setArticleId] = useState("");
  const author = getStoredAccount().username;

  useEffect(() => {
    fetchArticles(author);
  }, [articles]);

  async function fetchArticles(author) {
      try {
        const data = await apiRequest(`/articles/author/${author}`);
        setArticles(data.articles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    }

  async function handleEdit (e) {
    setArticleId(e.target.parentNode.parentNode.id);
  }

  async function handlePublish (e) {
    e.preventDefault();
    const articleId = e.target.parentNode.parentNode.id;
    const updatedArticle = await apiRequest(`/articles/${articleId}`);
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
    fetchArticles(author);
  }

  async function handleDelete (e) {
    e.preventDefault();
    const articleId = e.target.parentNode.parentNode.id;
    try {
      const deletedArticle = await apiRequest(`/articles/${articleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      alert("Successfully deleted article.");
    } catch (error) {
      alert("Unable to delete article: ", error.message);
    }
    setArticles([]);
  }

  return (
      <div style={{ padding: "30px" }}>
        <h1>Welcome to WellnessHub!</h1>

        <h2>Content Provider Dashboard</h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginTop: "30px"
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "80%",
              boxShadow: "0 2px 5px rgba(0,0,0,.15)"
            }}
          >
            <h3>Your articles</h3>
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
                }
              )}
              </tbody>
            </table>
          </div>

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "80%",
              boxShadow: "0 2px 5px rgba(0,0,0,.15)"
            }}
          >
            { articleId !== "" ?
              <>
              <h3>Edit an Article</h3>
              <ArticleEditor articleId={articleId} />
              </> :
              <>
              <h3>Create an Article</h3>
              <ArticleEditor />
              </> }
          </div>
        </div>
      </div>
  );
}

export default ProviderDashboard;