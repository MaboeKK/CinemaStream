import "./Stats.scss";
//import StatsCard from "./StatsCard";


const StatsCard = ({title, value}) => {
    return (
        <div className="stats-card">
            <h3 className="stat-title">{title}</h3>
            <p className="stat-value">{value}</p>
        </div>
    );
};

  const stats = [
    { title: "Total Trailers Watched", value: 2456 },
    { title: "Most Watched Trailer", value: "Avengers: Secret Wars" },
    { title: "Searches With No Result", value: 87 },
    { title: "Top Genre", value: "Rom-Com" },
    { title: "Rewatches", value: 989 },
    { title: "Active Users", value: "156 of 872" },
  ];

  const Stats = () => {
  return (
    <div className="stats-container">
      <h1 className="stats-title">Key Platform Stats</h1>
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} title={stat.title} value={stat.value} />
        ))}
      </div>
    </div>
  );
};

export default Stats;
