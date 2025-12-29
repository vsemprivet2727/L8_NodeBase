const fs = require('fs').promises;
const path = require('path');

module.exports = class dataBase {
  constructor(filename = 'db.json') {
    this.filePath = path.join(__dirname, filename);
    this.data = null;
  }
  
  
  async init() {
    try {
      const fileContent = await fs.readFile(this.filePath, 'utf-8');
      this.data = JSON.parse(fileContent);
    } catch (error) {
      
      this.data = { users: [], products: [] };
      await this.save();
    }
    return this;
  }
  
  
  async save() {
    await fs.writeFile(this.filePath, JSON.stringify(this.data, null, 2));
  }
  
  
  async create(collection, item) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    
    const newItem = {
      id: Date.now(), 
    };
    
    this.data[collection].push(newItem);
    await this.save();
    return newItem;
  }
  
  
  async findAll(collection, filter = {}) {
    if (!this.data[collection]) return [];
    
    let items = this.data[collection];
    
    
    Object.keys(filter).forEach(key => {
      items = items.filter(item => item[key] === filter[key]);
    });
    
    return items;
  }
  
  
  async findOne(collection, id) {
    if (!this.data[collection]) return null;
    return this.data[collection].find(item => item.id === id);
  }
  
  
  async findOneBy(collection, field, value) {
    if (!this.data[collection]) return null;
    return this.data[collection].find(item => item[field] === value);
  }
  
  
  async update(collection, id, updates) {
    if (!this.data[collection]) return null;
    
    const index = this.data[collection].findIndex(item => item.id === id);
    if (index === -1) return null;
    
    
    const { id: _, ...safeUpdates } = updates;
    
    this.data[collection][index] = {
      ...this.data[collection][index],
      ...safeUpdates
    };
    
    await this.save();
    return this.data[collection][index];
  }
  
  
  async delete(collection, id) {
    if (!this.data[collection]) return false;
    
    const initialLength = this.data[collection].length;
    this.data[collection] = this.data[collection].filter(item => item.id !== id);
    
    if (this.data[collection].length < initialLength) {
      await this.save();
      return true;
    }
    
    return false;
  }
  
  
  async paginate(collection, page = 1, limit = 10, filter = {}) {
    const items = await this.findAll(collection, filter);
    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    
    const paginatedItems = items.slice(offset, offset + limit);
    
    return {
      data: paginatedItems,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }
  
  
  async count(collection, filter = {}) {
    const items = await this.findAll(collection, filter);
    return items.length;
  }
}
