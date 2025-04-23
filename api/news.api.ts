import axios from "axios";
import { Article } from "../types/article.types";

if (!process.env.NEWS_API_KEY) {
  throw new Error("Не задана переменная окружения NEWS_API_KEY");
}
const API_KEY = process.env.NEWS_API_KEY;

/**
 * Получить топ-заголовки.
 * @param page Номер страницы (начиная с 1).
 * @param q Опциональный поисковый запрос.
 * @param category Опциональная категория.
 */
export async function fetchTopHeadlines(
  page: number,
  q?: string,
  category?: string
): Promise<{ articles: Article[]; totalResults: number }> {
  const resp = await axios.get("https://newsapi.org/v2/top-headlines", {
    params: {
      apiKey: API_KEY,
      country: "us",
      pageSize: 10,
      page,
      ...(q ? { q } : {}),
      ...(category ? { category } : {}),
    },
  });

  return {
    articles: resp.data.articles as Article[],
    totalResults: resp.data.totalResults as number,
  };
}

/**
 * Получить одну статью по её заголовку.
 * @param title Точный заголовок статьи.
 */
export async function fetchSingleArticle(
  title: string
): Promise<Article | null> {
  const resp = await axios.get("https://newsapi.org/v2/everything", {
    params: {
      apiKey: API_KEY,
      qInTitle: title,
      pageSize: 1,
    },
  });

  const articles = resp.data.articles as Article[];
  return articles.length > 0 ? articles[0] : null;
}
