import { api } from '@/lib/api'

export const authService = {
  changePassword: async (currentPassword, newPassword) => {
    return api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    })
  },
}
