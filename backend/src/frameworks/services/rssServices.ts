import axios from "axios";
import Parser from "rss-parser";
import ErrorInApplication from "../../utils/ErrorInApplication";

const RSS_FEEDS = [
  "https://www.sciencenews.org/feed",
  "http://www.espn.com/espn/rss/news",
  "http://www.skysports.com/rss/12040",
  "https://www.tmz.com/rss.xml", 
  "http://rss.cnn.com/rss/edition.rss",  
  "https://variety.com/feed/", 
];

export const fetchRssFeeds = async () => {
  try {
    const parser = new Parser();
    const axiosInstance = axios.create({ timeout: 10000 });

    const feedPromises = RSS_FEEDS.map(async url => {
      try {
        const response = await axiosInstance.get(url);
        const feed = await parser.parseString(response.data);
        return feed.items;
      } catch (error) {
        console.error(`Failed to fetch RSS feed from URL: ${url}`, error);
        return [];
      }
    });

    const feeds = await Promise.all(feedPromises);
    return feeds.flat();
  } catch (error) {
    console.error("Failed to fetch or parse RSS feeds", error);
    throw new ErrorInApplication("Failed to get feeds", 500);
  }
};
