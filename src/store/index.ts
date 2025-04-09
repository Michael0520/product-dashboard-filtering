import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UserState {
  isAuthenticated: boolean
  user: {
    id?: string
    name?: string
    email?: string
    avatar?: string
  } | null
  token: string | null
}

interface ThemeState {
  theme: 'light' | 'dark' | 'system'
}

interface AppState {
  isLoading: boolean
  language: 'en' | 'zh'
}

interface StoreState extends UserState, ThemeState, AppState {
  // User Actions
  login: (userData: { user: UserState['user'], token: string }) => void
  logout: () => void
  updateUser: (user: Partial<UserState['user']>) => void
  
  // Theme Actions
  setTheme: (theme: ThemeState['theme']) => void
  
  // App Actions
  setLoading: (isLoading: boolean) => void
  setLanguage: (language: AppState['language']) => void
}

const initialState: UserState & ThemeState & AppState = {
  // User State
  isAuthenticated: false,
  user: null,
  token: null,
  
  theme: 'system',
  isLoading: false,
  language: 'zh',
}

const useStore = create<StoreState>()(
  persist(
    (set) => ({
      ...initialState,
      
      login: (userData) => set({ 
        isAuthenticated: true, 
        user: userData.user, 
        token: userData.token 
      }),
      logout: () => set({ 
        isAuthenticated: false, 
        user: null, 
        token: null 
      }),
      updateUser: (user) => set((state) => ({ 
        user: { ...state.user, ...user } 
      })),
      
      setTheme: (theme) => set({ theme }),
      
      setLoading: (isLoading) => set({ isLoading }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        language: state.language,
      }),
    }
  )
)

export default useStore 