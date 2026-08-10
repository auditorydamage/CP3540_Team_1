import { Link } from "react-router-dom";

const sampleArticles = [
  {
    id: 1,
    title: "Simple Ways to Stay Hydrated",
    category: "Hydration",
    summary:
      "Learn practical ways to improve your daily water intake and stay consistent with hydration.",
    author: "WellnessHub Provider"
  },
  {
    id: 2,
    title: "Building a Consistent Exercise Routine",
    category: "Exercise",
    summary:
      "A simple approach to creating an exercise routine that fits your schedule and wellness goals.",
    author: "WellnessHub Provider"
  },
  {
    id: 3,
    title: "Managing Stress Throughout the Day",
    category: "Mental Wellness",
    summary:
      "Explore small habits that may help reduce stress and improve your overall sense of wellbeing.",
    author: "WellnessHub Provider"
  }
];

function Articles() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>📚 Wellness Articles</h1>

      <p>
        Browse health and wellness articles published by WellnessHub content
        providers.
      </p>

      <div
        style={{
          maxWidth: "1000px",
          marginTop: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px"
        }}
      >
        {sampleArticles.map((article) => (
          <article
            key={article.id}
            style={{
              backgroundColor: "#ffffff",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "5px 10px",
                borderRadius: "20px",
                backgroundColor: "#e8edf5",
                color: "#465269",
                fontSize: "13px",
                fontWeight: "700"
              }}
            >
              {article.category}
            </span>

            <h2>{article.title}</h2>

            <p>{article.summary}</p>

            <p
              style={{
                color: "#667085",
                fontSize: "14px"
              }}
            >
              By {article.author}
            </p>

            <Link
              to={`/articles/${article.id}`}
              style={{
                display: "inline-block",
                marginTop: "10px",
                padding: "10px 16px",
                borderRadius: "7px",
                backgroundColor: "#2f3542",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: "700"
              }}
            >
              Read Article
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Articles;