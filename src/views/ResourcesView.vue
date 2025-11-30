<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h1>Health Resources</h1>
        <p class="lead">Access free health information and wellness guides</p>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="row mt-4">
      <div class="col-md-6">
        <input 
          v-model="searchTerm" 
          type="text" 
          class="form-control" 
          placeholder="Search resources..."
        >
      </div>
      <div class="col-md-6">
        <select v-model="selectedCategory" class="form-select">
          <option value="">All Categories</option>
          <option value="Nutrition">Nutrition</option>
          <option value="Exercise">Exercise</option>
          <option value="Mental Health">Mental Health</option>
          <option value="Preventive Care">Preventive Care</option>
          <option value="Family Health">Family Health</option>
          <option value="Senior Health">Senior Health</option>
        </select>
      </div>
    </div>

    <!-- Resources Grid -->
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="resource in filteredResources" :key="resource.id">
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <div class="text-center mb-3">
              <span class="fs-1">{{ resource.icon }}</span>
            </div>
            <span class="badge bg-secondary mb-2 align-self-start">{{ resource.category }}</span>
            <h5 class="card-title">{{ resource.title }}</h5>
            <p class="card-text flex-grow-1">{{ resource.description }}</p>
            <button 
              class="btn btn-primary" 
              @click="openResource(resource)"
              data-bs-toggle="modal" 
              data-bs-target="#resourceModal"
            >
              Read More
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Resource Modal -->
    <div class="modal fade" id="resourceModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedResource?.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="text-center mb-3">
              <span class="fs-1">{{ selectedResource?.icon }}</span>
            </div>
            <span class="badge bg-secondary mb-3">{{ selectedResource?.category }}</span>
            <p class="lead">{{ selectedResource?.description }}</p>
            <div v-html="selectedResource?.content"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchTerm = ref('')
const selectedCategory = ref('')
const selectedResource = ref(null)

const resources = ref([
  {
    id: 1,
    category: 'Nutrition',
    title: 'Healthy Eating on a Budget',
    description: 'Learn how to prepare nutritious meals without breaking the bank',
    content: `
      <h4>Smart Shopping Tips</h4>
      <ul>
        <li>Buy seasonal produce when it's cheaper</li>
        <li>Purchase generic brands for staples</li>
        <li>Shop at farmers markets near closing time for discounts</li>
        <li>Buy in bulk for non-perishables</li>
      </ul>
      <h4>Budget-Friendly Protein Sources</h4>
      <ul>
        <li>Legumes (beans, lentils, chickpeas)</li>
        <li>Eggs</li>
        <li>Canned fish like tuna and salmon</li>
        <li>Chicken thighs (cheaper than breasts)</li>
      </ul>
      <h4>Meal Planning Strategy</h4>
      <p>Plan your meals around sales and seasonal produce. Cook large batches and freeze portions for busy days.</p>
    `,
    icon: '🥗'
  },
  {
    id: 2,
    category: 'Exercise',
    title: 'Free Home Workouts',
    description: 'Stay fit without expensive gym memberships',
    content: `
      <h4>No Equipment Needed</h4>
      <ul>
        <li>Bodyweight squats: 3 sets of 10-15</li>
        <li>Push-ups: 3 sets of 5-10</li>
        <li>Walking or jogging: 30 minutes daily</li>
        <li>Planks: 3 sets of 30 seconds</li>
      </ul>
      <h4>Using Household Items</h4>
      <ul>
        <li>Water bottles as weights</li>
        <li>Stairs for step-ups</li>
        <li>Towels for resistance exercises</li>
        <li>Chairs for support during exercises</li>
      </ul>
      <h4>Weekly Schedule</h4>
      <p>Aim for 150 minutes of moderate exercise per week. Break it into 30-minute sessions, 5 days a week.</p>
    `,
    icon: '💪'
  },
  {
    id: 3,
    category: 'Mental Health',
    title: 'Managing Stress and Anxiety',
    description: 'Simple techniques for better mental wellbeing',
    content: `
      <h4>Breathing Techniques</h4>
      <ul>
        <li>4-7-8 breathing: Inhale for 4, hold for 7, exhale for 8</li>
        <li>Box breathing: Equal counts for inhale, hold, exhale, hold</li>
        <li>Progressive muscle relaxation</li>
      </ul>
      <h4>Daily Practices</h4>
      <ul>
        <li>Mindfulness meditation (even 5 minutes helps)</li>
        <li>Gratitude journaling</li>
        <li>Regular sleep schedule</li>
        <li>Limiting news and social media</li>
      </ul>
      <h4>When to Seek Help</h4>
      <p>If stress interferes with daily life for more than 2 weeks, consider speaking with a healthcare provider or counsellor.</p>
    `,
    icon: '🧠'
  },
  {
    id: 4,
    category: 'Preventive Care',
    title: 'Essential Health Screenings',
    description: 'Know what health checks you need and when',
    content: `
      <h4>Regular Screenings by Age</h4>
      <h5>18-39 years:</h5>
      <ul>
        <li>Blood pressure: Every 2 years</li>
        <li>Cholesterol: Every 5 years</li>
        <li>Diabetes: Every 3 years if at risk</li>
        <li>Dental: Every 6 months</li>
      </ul>
      <h5>40-64 years:</h5>
      <ul>
        <li>Mammogram: Annually (women)</li>
        <li>Colonoscopy: Every 10 years starting at 45</li>
        <li>Eye exam: Every 2 years</li>
      </ul>
      <h4>Self-Checks</h4>
      <ul>
        <li>Skin checks for unusual moles</li>
        <li>Breast self-exams</li>
        <li>Monitor weight and BMI</li>
      </ul>
    `,
    icon: '🩺'
  },
  {
    id: 5,
    category: 'Family Health',
    title: 'Child Health and Safety',
    description: 'Keeping your children healthy and safe',
    content: `
      <h4>Vaccination Schedule</h4>
      <p>Follow the recommended immunisation schedule. Keep records updated and consult your doctor about any missed vaccines.</p>
      <h4>Nutrition for Growing Kids</h4>
      <ul>
        <li>5 servings of fruits and vegetables daily</li>
        <li>Whole grains over processed foods</li>
        <li>Limit sugary drinks and snacks</li>
        <li>Encourage water intake</li>
      </ul>
      <h4>Safety at Home</h4>
      <ul>
        <li>Childproof cabinets and outlets</li>
        <li>Secure heavy furniture to walls</li>
        <li>Keep small objects away from young children</li>
        <li>Install safety gates at stairs</li>
      </ul>
      <h4>Screen Time Guidelines</h4>
      <p>Under 2 years: No screens except video calls<br>2-5 years: Max 1 hour of quality programming daily</p>
    `,
    icon: '👶'
  },
  {
    id: 6,
    category: 'Senior Health',
    title: 'Healthy Ageing Tips',
    description: 'Maintaining health and independence as you age',
    content: `
      <h4>Staying Active</h4>
      <ul>
        <li>Balance exercises to prevent falls</li>
        <li>Strength training 2-3 times per week</li>
        <li>Low-impact activities like swimming or walking</li>
        <li>Chair exercises if mobility is limited</li>
      </ul>
      <h4>Nutrition Needs</h4>
      <ul>
        <li>Adequate protein for muscle maintenance</li>
        <li>Calcium and Vitamin D for bone health</li>
        <li>Stay hydrated (sense of thirst decreases with age)</li>
        <li>Smaller, more frequent meals if appetite is poor</li>
      </ul>
      <h4>Mental Stimulation</h4>
      <ul>
        <li>Learn new skills or hobbies</li>
        <li>Social activities and connections</li>
        <li>Reading and puzzles</li>
        <li>Consider technology classes</li>
      </ul>
    `,
    icon: '👵'
  }
])

const filteredResources = computed(() => {
  let filtered = resources.value

  if (searchTerm.value) {
    filtered = filtered.filter(resource =>
      resource.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(resource => 
      resource.category === selectedCategory.value
    )
  }

  return filtered
})

const openResource = (resource) => {
  selectedResource.value = resource
}
</script>