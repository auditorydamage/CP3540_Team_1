import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";
import Markdown from "react-markdown";

function ArticleDetails() {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadArticle();
  }, [id]);

  async function loadArticle() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(`/articles/${id}`);

      if (!data.article?.isPublished) {
        setError("This article is not currently available.");
        return;
      }

      setArticle(data.article);
    } catch (error) {
      console.error("Unable to load article:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <p>Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div style={{ padding: "30px" }}>
        <h1>Article Not Available</h1>

        <p>{error || "Article could not be found."}</p>

        <Link to="/articles">
          Return to Articles
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <Link to="/articles" style={backLinkStyle}>
        ← Back to Articles
      </Link>

      <article style={articleStyle}>
        <span style={categoryStyle}>
          {getCategoryLabel(article)}
        </span>

        <h1>{article.title}</h1>

        {article.subhead && (
          <h3
            style={{
              color: "#667085",
              fontWeight: "500"
            }}
          >
            {article.subhead}
          </h3>
        )}

        <p style={metaStyle}>
          By {article.author || "WellnessHub Provider"}
        </p>

        <p style={metaStyle}>
          {article.views || 0} views
        </p>

        <hr style={dividerStyle} />

        {article.category === "activity" && (
          <ActivityArticle article={article} />
        )}

        {article.category === "meal" && (
          <MealArticle article={article} />
        )}
      </article>
    </div>
  );
}

function ActivityArticle({ article }) {
  return (
    <>
      {article.activity?.activityType && (
        <p>
          <strong>Activity:</strong>{" "}
          {article.activity.activityType}
        </p>
      )}

      { /* <ArticleBody body={article.activity?.body} /> */ }
      <Markdown>{article.activity?.body}</Markdown>
    </>
  );
}

function MealArticle({ article }) {
  const meal = article.meal || {};

  return (
    <>
      {meal.name && (
        <p>
          <strong>Meal:</strong> {meal.name}
        </p>
      )}

      {meal.cuisine && (
        <p>
          <strong>Cuisine:</strong> {meal.cuisine}
        </p>
      )}

      {meal.mealType && (
        <p>
          <strong>Type:</strong> {meal.mealType}
        </p>
      )}

      { /* <ArticleBody body={meal.body} /> */ }
      <Markdown>{meal.body}</Markdown>

      {meal.ingredients?.length > 0 && (
        <>
          <h2>Ingredients</h2>

          <ul>
            {meal.ingredients.map((ingredient, index) => (
              <li key={`${ingredient}-${index}`}>
                {ingredient}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

function ArticleBody({ body }) {
  if (!body) {
    return null;
  }

  return String(body)
    .split(/\n+/)
    .filter(Boolean)
    .map((paragraph, index) => (
      <p
        key={index}
        style={{
          fontSize: "17px",
          lineHeight: "1.7"
        }}
      >
        {paragraph}
      </p>
    ));
}

function getCategoryLabel(article) {
  if (article.category === "meal") {
    return article.meal?.cuisine
      ? `Meal • ${article.meal.cuisine}`
      : "Meal";
  }

  if (article.category === "activity") {
    return article.activity?.activityType
      ? `Activity • ${article.activity.activityType}`
      : "Activity";
  }

  return "Wellness";
}

const articleStyle = {
  maxWidth: "850px",
  marginTop: "24px",
  padding: "35px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
};

const backLinkStyle = {
  color: "#465269",
  textDecoration: "none",
  fontWeight: "700"
};

const categoryStyle = {
  display: "inline-block",
  padding: "5px 10px",
  borderRadius: "20px",
  backgroundColor: "#e8edf5",
  color: "#465269",
  fontSize: "13px",
  fontWeight: "700"
};

const metaStyle = {
  color: "#667085",
  fontSize: "14px"
};

const dividerStyle = {
  margin: "25px 0",
  border: "none",
  borderTop: "1px solid #e1e5ea"
};

export default ArticleDetails;