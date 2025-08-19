import { Service } from '../types';

// In-memory service store (replace with API later)
class ServiceStore {
  private services: Service[] = [];

  constructor(initial: Service[] = []) {
    this.services = initial.map(s => ({ ...s }));
  }

  list(category?: Service['category']) {
    return this.services.filter(s => !category || s.category === category);
  }

  search(query: string, category?: Service['category']) {
    const q = query.toLowerCase();
    return this.list(category).filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.details.toLowerCase().includes(q)
    );
  }

  get(id: string) { return this.services.find(s => s.id === id) || null; }

  create(data: Omit<Service,'id'> & { id?: string }): Service {
    const id = data.id || crypto.randomUUID();
    const item: Service = { ...data, id };
    this.services.push(item);
    return item;
  }

  update(id: string, changes: Partial<Omit<Service,'id'>>) {
    const idx = this.services.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.services[idx] = { ...this.services[idx], ...changes };
    return this.services[idx];
  }

  remove(id: string) {
    const before = this.services.length;
    this.services = this.services.filter(s => s.id !== id);
    return this.services.length < before;
  }

  replaceAll(data: Service[]) {
    this.services = data.map(s => ({ ...s }));
  }
}

export const serviceStore = new ServiceStore();
