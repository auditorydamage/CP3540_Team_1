import { useState, useEffect } from 'react';

function ArticleAdmin () {
    const [articles, setArticles] = useState([]);
    const [article, setArticle] = useState({articleId: "", author: "", title: "", category: "activity"});

    useEffect(() => {
        async function fetchArticles() {
            try {
                const data = await fetch(`http://localhost:3000/api/articles/`);
                const fetchedArticles = await data.json();
                setArticles(fetchedArticles.articles);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
        fetchArticles();
    }, []);

    async function handleEdit (e) {
    return e;
  }

  async function handlePublish (e) {
    e.preventDefault();
    const articleId = e.target.parentNode.id;
    const article = await fetch(`http://localhost:3000/api/articles/${articleId}`);
    if (article.isPublished) {
      await fetch(`http://localhost:3000/api/articles/unpublish/${articleId}`);
    } else {
      await fetch(`http://localhost:3000/api/articles/publish/${articleId}`); 
    }
  }

  async function handleDelete (e) {
    e.preventDefault();
    const articleId = e.target.parentNode.id;
    const deletedArticle = await fetch(`http://localhost:3000/api/articles/delete/${articleId}`);
  }

  return (
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

  )
}

export {ArticleAdmin};