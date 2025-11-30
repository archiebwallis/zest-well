import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGroupsStore = defineStore('groups', () => {
  const groups = ref([
    {
      id: 1,
      name: 'Nutrition Support Circle',
      description: 'Weekly discussions about healthy eating habits and budget meal planning',
      meetingTime: 'Tuesdays 6:00 PM',
      members: 24,
      category: 'nutrition'
    },
    {
      id: 2,
      name: 'Mental Wellness Group',
      description: 'Safe space to share experiences and coping strategies for mental health',
      meetingTime: 'Thursdays 7:00 PM',
      members: 18,
      category: 'mental-health'
    },
    {
      id: 3,
      name: 'New Parents Support',
      description: 'Connect with other new parents and share parenting tips and experiences',
      meetingTime: 'Saturdays 10:00 AM',
      members: 15,
      category: 'parenting'
    },
    {
      id: 4,
      name: 'Active Seniors Club',
      description: 'Fitness activities and health discussions for seniors staying active',
      meetingTime: 'Mondays 2:00 PM',
      members: 32,
      category: 'seniors'
    },
    {
      id: 5,
      name: 'Diabetes Management',
      description: 'Support and education for managing diabetes and blood sugar levels',
      meetingTime: 'Wednesdays 6:30 PM',
      members: 21,
      category: 'health-conditions'
    }
  ])

  return {
    groups
  }
})