import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/articles");

      const publishedArticles = (data.articles || [])
        .filter((article) => article.isPublished)
        .sort(
          (a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

      setArticles(publishedArticles);
    } catch (error) {
      console.error("Unable to load articles:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const recommendedArticles = articles.slice(0, 3);

  return (
    <div style={{ padding: "30px" }}>
      <h1>📚 Wellness Articles</h1>

      <p>
        Browse health, activity and meal content published by
        WellnessHub providers.
      </p>

      {loading && <p>Loading articles...</p>}

      {error && (
        <p style={errorStyle}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <section style={recommendationSectionStyle}>
            <div style={sectionHeaderStyle}>
              <div>
                <h2 style={{ marginBottom: "6px" }}>
                  ⭐ Recommended for You
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: "#667085"
                  }}
                >
                  Personalized recommendations will be based
                  on the articles you view.
                </p>
              </div>
            </div>

            {recommendedArticles.length === 0 ? (
              <div style={recommendationEmptyStyle}>
                <p style={{ margin: 0 }}>
                  Recommendations will appear here as you
                  explore WellnessHub articles.
                </p>
              </div>
            ) : (
              <div style={recommendationGridStyle}>
                {recommendedArticles.map((article) => (
                  <article
                    key={article._id}
                    style={recommendedCardStyle}
                  >
                    <span style={recommendedLabelStyle}>
                      Recommended
                    </span>

                    <span style={categoryStyle}>
                      {getCategoryLabel(article)}
                    </span>

                    <h3>{article.title}</h3>

                    {article.subhead && (
                      <p style={{ color: "#465269" }}>
                        {article.subhead}
                      </p>
                    )}

                    <p style={metaStyle}>
                      By{" "}
                      {article.author ||
                        "WellnessHub Provider"}
                    </p>

                    <Link
                      to={`/articles/${article._id}`}
                      style={readButtonStyle}
                    >
                      Read Article
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section style={{ marginTop: "40px" }}>
            <h2>All Articles</h2>

            {articles.length === 0 ? (
              <div style={emptyStyle}>
                <h2>No Articles Available</h2>

                <p>
                  Published wellness articles will appear
                  here.
                </p>
              </div>
            ) : (
              <div style={gridStyle}>
                {articles.map((article) => (
                  <article
                    key={article._id}
                    style={cardStyle}
                  >
                    <span style={categoryStyle}>
                      {getCategoryLabel(article)}
                    </span>

                    <h2>{article.title}</h2>

                    {article.subhead && (
                      <p style={{ color: "#465269" }}>
                        {article.subhead}
                      </p>
                    )}

                    <p style={metaStyle}>
                      By{" "}
                      {article.author ||
                        "WellnessHub Provider"}
                    </p>

                    <p style={metaStyle}>
                      {article.views || 0} views
                    </p>

                    <Link
                      to={`/articles/${article._id}`}
                      style={readButtonStyle}
                    >
                      Read Article
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
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

const recommendationSectionStyle = {
  maxWidth: "1100px",
  marginTop: "30px",
  padding: "28px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
};

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px"
};

const recommendationGridStyle = {
  marginTop: "22px",
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "18px"
};

const recommendedCardStyle = {
  padding: "20px",
  border: "1px solid #e1e5ea",
  borderRadius: "10px",
  backgroundColor: "#f9fafb"
};

const recommendedLabelStyle = {
  display: "inline-block",
  marginRight: "8px",
  marginBottom: "10px",
  padding: "5px 10px",
  borderRadius: "20px",
  backgroundColor: "#fff3cd",
  color: "#7a5b00",
  fontSize: "12px",
  fontWeight: "700"
};

const recommendationEmptyStyle = {
  marginTop: "20px",
  padding: "20px",
  borderRadius: "8px",
  backgroundColor: "#f5f7fa",
  color: "#667085"
};

const gridStyle = {
  maxWidth: "1100px",
  marginTop: "20px",
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px"
};

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
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

const readButtonStyle = {
  display: "inline-block",
  marginTop: "10px",
  padding: "10px 16px",
  borderRadius: "7px",
  backgroundColor: "#2f3542",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: "700"
};

const errorStyle = {
  marginTop: "20px",
  padding: "12px",
  backgroundColor: "#fde8df",
  color: "#9a3412",
  borderRadius: "7px",
  maxWidth: "850px"
};

const emptyStyle = {
  maxWidth: "850px",
  marginTop: "30px",
  padding: "30px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
};

export default Articles;