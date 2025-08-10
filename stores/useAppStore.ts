import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Platform, DownloadTask } from '@/types/models'
import { VIDEO_PLATFORMS } from '@/lib/constants/platforms'
import { apiClient } from '@/lib/api/client'

interface AppState {
  // 用户状态
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // 视频下载状态
  selectedPlatform: Platform
  downloadQueue: DownloadTask[]
  currentVideoUrl: string
  
  // UI状态
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  locale: string
  
  // Actions - 用户相关
  setUser: (user: User | null) => void
  logout: () => void
  checkAuth: () => Promise<void>
  
  // Actions - 下载相关
  setSelectedPlatform: (platform: Platform) => void
  setCurrentVideoUrl: (url: string) => void
  addToQueue: (task: DownloadTask) => void
  updateTaskStatus: (taskId: string, status: DownloadTask['status'], progress?: number) => void
  removeFromQueue: (taskId: string) => void
  clearQueue: () => void
  
  // Actions - UI相关
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
  setLocale: (locale: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      isAuthenticated: false,
      isLoading: true,
      selectedPlatform: VIDEO_PLATFORMS[0], // 默认选择YouTube
      downloadQueue: [],
      currentVideoUrl: '',
      sidebarOpen: true,
      theme: 'light',
      locale: 'zh',
      
      // 用户相关Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      
      logout: () => {
        apiClient.setToken(null)
        set({ 
          user: null, 
          isAuthenticated: false,
          downloadQueue: [] 
        })
      },
      
      checkAuth: async () => {
        set({ isLoading: true })
        try {
          const token = apiClient.getToken()
          if (token) {
            // 验证token是否有效
            const response = await apiClient.get('/auth/me')
            if (response && response.id) {
              set({
                user: {
                  id: response.id,
                  email: response.email,
                  username: response.username || response.email.split('@')[0],
                  avatar_url: response.avatar_url
                },
                isAuthenticated: true,
                isLoading: false
              })
            } else {
              // Token无效，清除
              apiClient.setToken(null)
              set({ user: null, isAuthenticated: false, isLoading: false })
            }
          } else {
            set({ isLoading: false })
          }
        } catch (error) {
          // Token验证失败
          apiClient.setToken(null)
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },
      
      // 下载相关Actions
      setSelectedPlatform: (platform) => set({ 
        selectedPlatform: platform,
        currentVideoUrl: '' // 切换平台时清空URL
      }),
      
      setCurrentVideoUrl: (url) => set({ 
        currentVideoUrl: url 
      }),
      
      addToQueue: (task) => set((state) => ({
        downloadQueue: [...state.downloadQueue, task]
      })),
      
      updateTaskStatus: (taskId, status, progress) => set((state) => ({
        downloadQueue: state.downloadQueue.map(task =>
          task.id === taskId
            ? { 
                ...task, 
                status, 
                progress: progress !== undefined ? progress : task.progress,
                completed_at: status === 'completed' ? new Date().toISOString() : task.completed_at
              }
            : task
        )
      })),
      
      removeFromQueue: (taskId) => set((state) => ({
        downloadQueue: state.downloadQueue.filter(task => task.id !== taskId)
      })),
      
      clearQueue: () => set({ 
        downloadQueue: [] 
      }),
      
      // UI相关Actions
      toggleSidebar: () => set((state) => ({ 
        sidebarOpen: !state.sidebarOpen 
      })),
      
      setTheme: (theme) => {
        set({ theme })
        // 更新DOM以应用主题
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark')
        }
      },
      
      setLocale: (locale) => set({ 
        locale 
      }),
    }),
    {
      name: 'sparkvideo-storage', // localStorage key
      partialize: (state) => ({
        // 只持久化必要的状态
        user: state.user,
        theme: state.theme,
        locale: state.locale,
        selectedPlatform: state.selectedPlatform,
      }),
    }
  )
)

// 选择器
export const useUser = () => useAppStore((state) => state.user)
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated)
export const useSelectedPlatform = () => useAppStore((state) => state.selectedPlatform)
export const useDownloadQueue = () => useAppStore((state) => state.downloadQueue)
export const useTheme = () => useAppStore((state) => state.theme)