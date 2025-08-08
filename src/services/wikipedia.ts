import { WikipediaResponse, WikipediaPage } from '@/app/types';

const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/api/rest_v1/page/random/summary';
const WIKIPEDIA_QUERY_URL = 'https://en.wikipedia.org/w/api.php';

export class WikipediaService {
  private static async fetchRandomPage(): Promise<WikipediaPage> {
    try {
      const response = await fetch(WIKIPEDIA_API_URL);
      const data = await response.json();
      
      // Get more detailed info using the page title
      const detailResponse = await fetch(
        `${WIKIPEDIA_QUERY_URL}?action=query&format=json&prop=extracts|pageimages|info&exintro=true&exlimit=1&explaintext=true&titles=${encodeURIComponent(data.title)}&piprop=thumbnail&pithumbsize=500&pilimit=1&inprop=url&origin=*`
      );
      
      const detailData: WikipediaResponse = await detailResponse.json();
      const pages = detailData.query.pages;
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];
      
      return {
        pageid: page.pageid,
        title: page.title,
        extract: page.extract || data.extract || 'No description available.',
        thumbnail: page.thumbnail,
        pageimage: page.pageimage,
        fullurl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`
      };
    } catch (error) {
      console.error('Error fetching Wikipedia page:', error);
      throw new Error('Failed to fetch Wikipedia article');
    }
  }

  public static async fetchMultipleRandomPages(count: number = 5): Promise<WikipediaPage[]> {
    const promises = Array(count).fill(null).map(() => this.fetchRandomPage());
    
    try {
      const results = await Promise.allSettled(promises);
      return results
        .filter((result): result is PromiseFulfilledResult<WikipediaPage> => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(page => page.extract && page.extract.length > 50); // Filter out pages with insufficient content
    } catch (error) {
      console.error('Error fetching multiple pages:', error);
      return [];
    }
  }

  public static async searchArticles(query: string, limit: number = 3): Promise<WikipediaPage[]> {
    try {
      const response = await fetch(
        `${WIKIPEDIA_QUERY_URL}?action=query&format=json&prop=extracts|pageimages|info&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=${limit}&exintro=true&explaintext=true&piprop=thumbnail&pithumbsize=500&inprop=url&origin=*`
      );
      
      const data: WikipediaResponse = await response.json();
      if (!data.query?.pages) return [];
      
      return Object.values(data.query.pages).map(page => ({
        pageid: page.pageid,
        title: page.title,
        extract: page.extract || 'No description available.',
        thumbnail: page.thumbnail,
        pageimage: page.pageimage,
        fullurl: page.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`
      }));
    } catch (error) {
      console.error('Error searching Wikipedia:', error);
      return [];
    }
  }
} 