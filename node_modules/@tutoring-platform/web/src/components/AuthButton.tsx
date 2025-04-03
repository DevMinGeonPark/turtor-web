import { useState, useEffect } from 'react';
import { signInWithGoogle, signOut, getCurrentUser } from '../lib/auth';
import type { AuthUser } from '@tutoring-platform/types';

export default function AuthButton() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setError(null);
      } catch (err) {
        console.error('Error checking user:', err);
        setError('사용자 정보를 가져오는 중 오류가 발생했습니다');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      // 리다이렉션 후에는 이 함수가 실행되지 않을 것입니다
    } catch (err) {
      console.error('Sign in error:', err);
      setError('로그인 중 오류가 발생했습니다');
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await signOut();
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError('로그아웃 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {loading && <div>로딩 중...</div>}
      
      {error && <div className="text-red-500 mb-2">{error}</div>}
      
      {user ? (
        <div className="flex items-center gap-4">
          <span>안녕하세요, {user.name || user.email}님!</span>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={loading}
          >
            로그아웃
          </button>
        </div>
      ) : (
        <button
          onClick={handleSignIn}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          Google로 로그인
        </button>
      )}
    </div>
  );
} 