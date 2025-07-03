import mockDeals from '@/services/mockData/deals.json'

class DealService {
  constructor() {
    this.deals = [...mockDeals]
  }

  async getAll() {
    await this.delay()
    return [...this.deals]
  }

  async getById(id) {
    await this.delay()
    const deal = this.deals.find(deal => deal.Id === id)
    if (!deal) {
      throw new Error('Deal not found')
    }
    return { ...deal }
  }

  async create(dealData) {
    await this.delay()
    const newId = Math.max(...this.deals.map(deal => deal.Id)) + 1
    const newDeal = {
      ...dealData,
      Id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.deals.push(newDeal)
    return { ...newDeal }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.deals.findIndex(deal => deal.Id === id)
    if (index === -1) {
      throw new Error('Deal not found')
    }
    
    this.deals[index] = {
      ...this.deals[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    return { ...this.deals[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.deals.findIndex(deal => deal.Id === id)
    if (index === -1) {
      throw new Error('Deal not found')
    }
    
    this.deals.splice(index, 1)
    return true
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 250))
  }
}

export const dealService = new DealService()