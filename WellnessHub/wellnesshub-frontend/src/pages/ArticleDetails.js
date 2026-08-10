import { Link, useParams } from "react-router-dom";

const sampleArticles = [
  {
    id: 1,
    title: "Simple Ways to Stay Hydrated",
    category: "Hydration",
    author: "WellnessHub Provider",
    content: [
      "Staying hydrated can support energy levels, physical performance, and overall wellbeing.",
      "One simple strategy is to keep water nearby throughout the day and drink regularly instead of waiting until you feel thirsty.",
      "You can also use the WellnessHub Water Tracker to monitor your daily intake and work toward your hydration goal."
    ]
  },
  {
    id: 2,
    title: "Building a Consistent Exercise Routine",
    category: "Exercise",
    author: "WellnessHub Provider",
    content: [
      "Consistency is often more important than trying to create the perfect exercise routine.",
      "Start with a realistic amount of activity that fits your current schedule and gradually increase your exercise over time.",
      "Tracking your activity can make it easier to recognize progress and stay accountable to your goals."
    ]
  },
  {
    id: 3,
    title: "Managing Stress Throughout the Day",
    category: "Mental Wellness",
    author: "WellnessHub Provider",
    content: [
      "Stress can build gradually throughout the day, which makes regular check-ins useful.",
      "Short walks, breathing exercises, stretching, and taking brief breaks can help you reset during demanding periods.",
      "Using the WellnessHub Mood Check-In can also help you recognize patterns in how you are feeling."
    ]
  }
];

function ArticleDetails() {
  const { id } = useParams();

  const article = sampleArticles.find(
    (currentArticle) => currentArticle.id === Number(id)
  );

  if (!article) {
    return (
      <div style={{ padding: "30px" }}>
        <h1>Article Not Found</h1>

        <Link to="/articles">
          Return to Articles
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <Link
        to="/articles"
        style={{
          color: "#465269",
          textDecoration: "none",
          fontWeight: "700"
        }}
      >
        ← Back to Articles
      </Link>

      <article
        style={{
          maxWidth: "850px",
          marginTop: "24px",
          padding: "35px",
          backgroundColor: "#ffffff",
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

        <h1>{article.title}</h1>

        <p style={{ color: "#667085" }}>
          By {article.author}
        </p>

        <hr
          style={{
            margin: "25px 0",
            border: "none",
            borderTop: "1px solid #e1e5ea"
          }}
        />

        {article.content.map((paragraph, index) => (
          <p
            key={index}
            style={{
              fontSize: "17px",
              lineHeight: "1.7"
            }}
          >
            {paragraph}
          </p>
        ))}
      </article>
    </div>
  );
}

export default ArticleDetails;