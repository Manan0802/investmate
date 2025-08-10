import Parser from 'rss-parser';

const getNews = async (req, res) => {
  try {
    const parser = new Parser();
    
    // Use Google News RSS feed for "India Business"
    const feed = await parser.parseURL('https://news.google.com/rss/search?q=indian+stock+market+business&hl=en-IN&gl=IN&ceid=IN:en');

    const articles = feed.items.slice(0, 15).map(item => ({
      title: item.title,
      description: item.contentSnippet || '',
      url: item.link,
      source: item.creator || item.source || 'Google News',
      publishedAt: item.pubDate || new Date().toISOString(),
    }));

    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ message: 'Failed to fetch news from RSS' });
  }
};
export { getNews };
