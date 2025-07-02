import mockSalesReps from '@/services/mockData/salesReps.json'

class SalesRepService {
  constructor() {
    this.salesReps = [...mockSalesReps]
  }

  async getAll() {
    await this.delay()
    return [...this.salesReps]
  }

  async getById(id) {
    await this.delay()
    const rep = this.salesReps.find(rep => rep.Id === id)
    if (!rep) {
      throw new Error('Sales rep not found')
    }
    return { ...rep }
  }

  async create(repData) {
    await this.delay()
    const newId = Math.max(...this.salesReps.map(rep => rep.Id)) + 1
    const newRep = {
      ...repData,
      Id: newId
    }
    this.salesReps.push(newRep)
    return { ...newRep }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.salesReps.findIndex(rep => rep.Id === id)
    if (index === -1) {
      throw new Error('Sales rep not found')
    }
    
    this.salesReps[index] = {
      ...this.salesReps[index],
      ...updateData
    }
    
    return { ...this.salesReps[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.salesReps.findIndex(rep => rep.Id === id)
    if (index === -1) {
      throw new Error('Sales rep not found')
    }
    
    this.salesReps.splice(index, 1)
    return true
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 200))
  }
}

export const salesRepService = new SalesRepService()