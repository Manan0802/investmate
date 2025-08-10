import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import userService from '../services/UserService.js';

function NewsSection() {
  const [articles, setArticles] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        if (user && user.token) {
          const data = await userService.getNews(user.token);
          // Take the top 5 articles for our list
          setArticles(data.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch news', error);
      }
    };

    fetchNews();
  }, [user]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Market News</h2>
      {articles.length > 0 ? (
        <ul className="space-y-4">
          {articles.map((article, index) => (
            <li key={index} className="border-b border-gray-700 pb-2">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold hover:text-teal-400"
              >
                {article.title}
              </a>
              <p className="text-sm text-gray-400">{article.source.name}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading news...</p>
      )}
    </div>
  );
}

export default NewsSection;