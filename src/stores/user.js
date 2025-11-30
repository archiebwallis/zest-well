import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'
import { sanitize } from '@/utils/sanitize'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)
  const userRole = ref(null)

  const register = async (userData) => {
    const { email, password, firstName, lastName, phone, suburb } = userData
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // This write operation will automatically trigger the Cloud Function!
    await setDoc(doc(db, 'users', user.uid), {
      firstName: sanitize(firstName),
      lastName: sanitize(lastName),
      email: email,
      phone: sanitize(phone),
      suburb: sanitize(suburb),
      role: 'user',
      createdAt: new Date()
    })

    currentUser.value = user
    userRole.value = 'user'
  }

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        userRole.value = userDoc.data().role
      }
    } catch (error) {
      console.warn('Unable to fetch user role during login (offline):', error)
      // Set default role when offline
      userRole.value = 'user'
    }

    currentUser.value = user
  }

  const logout = async () => {
    await signOut(auth)
    currentUser.value = null
    userRole.value = null
  }

  const initAuth = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        currentUser.value = user
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            userRole.value = userDoc.data().role
          }
        } catch (error) {
          console.warn('Unable to fetch user role (offline):', error)
          // Set default role when offline
          userRole.value = 'user'
        }
      } else {
        currentUser.value = null
        userRole.value = null
      }
    })
  }

  return {
    currentUser,
    userRole,
    register,
    login,
    logout,
    initAuth
  }
})