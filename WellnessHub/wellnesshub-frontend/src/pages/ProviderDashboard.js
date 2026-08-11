import { useState, useEffect } from "react";
import { ArticleEditor } from "../components/Article.js";

function ProviderDashboard() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchArticles(author) {
      try {
        const data = await fetch(`http://localhost:3000/api/articles/author/${author}`);
        const fetchedArticles = await data.json();
        setArticles(fetchedArticles.articles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    }
     fetchArticles(author);
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Welcome to WellnessHub!</h1>

      <p>Content Provider Dashboard.</p>

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
          <h3>Your articles.</h3>
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
                    <tr key={article._id}>
                      <td>{article.title}</td>
                      <td>{article.category}</td>
                      <td>{article.isPublished ? "Published" : "Draft"}</td>
                      <td><button>Edit</button></td>
                      <td><button>{ article.isPublished ? "Unpublish" : "Publish" }</button></td>
                      <td><button>Delete</button></td>
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
          <h3>Create an Article</h3>
          <ArticleEditor />
        </div>
      </div>
    </div>
  );
}

export default ProviderDashboard;