import { supabase } from './supabase'
import { User } from '../types'

export const createUser = async (userData: {
  user_id: string
  password: string
}): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        user_id: userData.user_id,
        password: userData.password
      }
    ])
    .select()
    .single()

  console.log('User created...')

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const findUserById = async (user_id: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', user_id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(error.message)
  }
  return data
}
