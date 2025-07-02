import mockLeads from '@/services/mockData/leads.json'

class LeadService {
  constructor() {
    this.leads = [...mockLeads]
  }

  async getAll() {
    await this.delay()
    return [...this.leads]
  }

  async getById(id) {
    await this.delay()
    const lead = this.leads.find(lead => lead.Id === id)
    if (!lead) {
      throw new Error('Lead not found')
    }
    return { ...lead }
  }

  async create(leadData) {
    await this.delay()
    const newId = Math.max(...this.leads.map(lead => lead.Id)) + 1
    const newLead = {
      ...leadData,
      Id: newId,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    }
    this.leads.push(newLead)
    return { ...newLead }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.leads.findIndex(lead => lead.Id === id)
    if (index === -1) {
      throw new Error('Lead not found')
    }
    
    this.leads[index] = {
      ...this.leads[index],
      ...updateData,
      lastActivity: new Date().toISOString()
    }
    
    return { ...this.leads[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.leads.findIndex(lead => lead.Id === id)
    if (index === -1) {
      throw new Error('Lead not found')
    }
    
    this.leads.splice(index, 1)
    return true
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300))
  }
}

export const leadService = new LeadService()