import mockMeetings from '@/services/mockData/meetings.json'

class MeetingService {
  constructor() {
    this.meetings = [...mockMeetings]
  }

  async getAll() {
    await this.delay()
    return [...this.meetings]
  }

  async getById(id) {
    await this.delay()
    const meeting = this.meetings.find(meeting => meeting.Id === id)
    if (!meeting) {
      throw new Error('Meeting not found')
    }
    return { ...meeting }
  }

  async create(meetingData) {
    await this.delay()
    const newId = Math.max(...this.meetings.map(meeting => meeting.Id)) + 1
    const newMeeting = {
      ...meetingData,
      Id: newId
    }
    this.meetings.push(newMeeting)
    return { ...newMeeting }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.meetings.findIndex(meeting => meeting.Id === id)
    if (index === -1) {
      throw new Error('Meeting not found')
    }
    
    this.meetings[index] = {
      ...this.meetings[index],
      ...updateData
    }
    
    return { ...this.meetings[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.meetings.findIndex(meeting => meeting.Id === id)
    if (index === -1) {
      throw new Error('Meeting not found')
    }
    
    this.meetings.splice(index, 1)
    return true
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 250))
  }
}

export const meetingService = new MeetingService()