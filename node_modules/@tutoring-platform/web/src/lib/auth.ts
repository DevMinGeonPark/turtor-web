import { supabase } from '@tutoring-platform/supabase'
import type { AuthUser } from '@tutoring-platform/types'

export const signInWithGoogle = async () => {
  try {
    console.log('Starting Google sign-in process...')
    console.log('Current origin:', window.location.origin)
    
    // Supabase 클라이언트 설정 확인
    console.log('Supabase URL:', import.meta.env.PUBLIC_SUPABASE_URL)
    console.log('Supabase client initialized:', !!supabase)
    
    // Supabase의 기본 콜백 URL 사용
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // redirectTo 옵션 제거하여 Supabase 기본 콜백 URL 사용
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('Google login error:', error)
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        name: error.name,
        stack: error.stack
      })
      throw error
    }

    console.log('Sign-in response:', data)
    
    if (data?.url) {
      console.log('Redirecting to:', data.url)
      window.location.href = data.url
    } else {
      console.error('No redirect URL provided in response')
      throw new Error('No redirect URL provided in response')
    }
  } catch (error) {
    console.error('Sign in error:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
    }
    throw error
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
      throw error
    }
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    console.log('Getting current user...')
    
    // 먼저 세션을 확인
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return null
    }
    
    console.log('Session data:', session)
    
    if (!session?.user) {
      console.log('No user in session')
      return null
    }
    
    // 사용자 정보 가져오기
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('Error getting user:', userError)
      return null
    }
    
    if (!user) {
      console.log('No user found')
      return null
    }
    
    console.log('User data:', user)
    
    // 사용자 프로필 가져오기
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role, name')
      .eq('id', user.id)
      .single()
    
    if (profileError) {
      console.error('Error getting profile:', profileError)
      // 프로필이 없는 경우 기본값 사용
      return {
        ...user,
        role: 'student',
        name: user.user_metadata.full_name || user.email?.split('@')[0] || '사용자'
      }
    }
    
    console.log('Profile data:', profile)
    
    return {
      ...user,
      role: profile.role,
      name: profile.name
    }
  } catch (error) {
    console.error('Get current user error:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
    }
    return null
  }
}

export const createUserProfile = async (userId: string, email: string, name: string) => {
  try {
    console.log('Creating user profile:', { userId, email, name })
    
    const { error } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          email,
          name,
          role: 'student'
        }
      ])
    
    if (error) {
      console.error('Error creating user profile:', error)
      throw error
    }
    
    console.log('User profile created successfully')
  } catch (error) {
    console.error('Create user profile error:', error)
    throw error
  }
} 