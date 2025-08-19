import { NewsItem } from '../types';

// Simple in-memory news store (demo). Replace with API integration later.
class NewsStore {
  private news: NewsItem[] = [];

  constructor() {
    // seed with example items
    this.news = [
      {
        id: 'seed-1',
        title: 'Welcome to the New Academic Year',
        summary: 'Orientation schedule and key resources are now available.',
        content: 'Orientation schedule and key resources are now available for download. Please check your department notice boards for venue allocations.',
        date: new Date().toISOString(),
        category: 'Announcement',
        priority: 'medium',
  campus: 'south',
  isVisible: true
      },
      {
        id: 'seed-2',
        title: 'eMalahleni Power Interruption Notice',
        summary: 'Scheduled maintenance affecting selected labs.',
        content: 'Scheduled maintenance will affect Labs 2 & 3 on Saturday between 08:00 and 14:00. Please plan accordingly.',
        date: new Date().toISOString(),
        category: 'Event',
        priority: 'high',
        isUrgent: true,
  campus: 'emalahleni',
  isVisible: true
      }
    ];
  }

  list(campus?: string, search?: string): NewsItem[] {
    let items = [...this.news].sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
    if (campus) items = items.filter(n => !n.campus || n.campus === campus);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(n => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q));
    }
    return items;
  }

  get(id: string) { return this.news.find(n => n.id === id) || null; }

  create(data: Omit<NewsItem,'id'|'date'> & { date?: string }): NewsItem {
    const item: NewsItem = { ...data, id: crypto.randomUUID(), date: data.date || new Date().toISOString(), isVisible: data.isVisible ?? true };
    this.news.push(item);
    return item;
  }

  update(id: string, changes: Partial<Omit<NewsItem,'id'>>): NewsItem | null {
    const idx = this.news.findIndex(n => n.id === id);
    if (idx === -1) return null;
    this.news[idx] = { ...this.news[idx], ...changes };
    return this.news[idx];
  }

  toggleVisibility(id: string): NewsItem | null {
    const idx = this.news.findIndex(n => n.id === id);
    if (idx === -1) return null;
    const current = this.news[idx].isVisible !== false; // default true
    this.news[idx] = { ...this.news[idx], isVisible: !current };
    return this.news[idx];
  }

  remove(id: string): boolean {
    const before = this.news.length;
    this.news = this.news.filter(n => n.id !== id);
    return this.news.length < before;
  }
}

export const newsStore = new NewsStore();
