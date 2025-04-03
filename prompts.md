### 현재 개발 환경
- Window11 기반 Powershell

### 🛠️ 기술 스택 요구사항
1. **Monorepo 구조**: Yarn workspace 기반으로 Astro(웹) 공유
2. **백엔드**: Supabase 활용(Social Login, DB, Storage)
3. **프론트엔드**: Astro 기반 자유롭게, TypeScript
4. **호스팅**: Vercel(프론트엔드) + Supabase(백엔드) 무료 티어 활용
5. **필수 기능**:
   - Google 소셜 로그인
   - BOJ 문제ID 기반 숙제 제출
   - 캘린더 기반 수업일/결제일 관리
   - 관리자용 제출 현황 대시보드

### 👨‍🏫 시스템 구성
1. **사용자 역할**:
   - 선생님: 단일 관리자 (본인)
   - 학생: 수강생들
2. **결제 관리**:
   - 실제 결제 시스템 미사용
   - 선생님이 직접 결제 상태 관리
   - 결제일 설정 및 결제 상태 수동 변경

### 📁 프로젝트 구조
```
my-edu-app/
├─ apps/
│  ├─ web/       # Astro 애플리케이션
├─ packages/
│  ├─ supabase/  # Supabase 클라이언트 공통 설정
│  ├─ ui/        # 공유 UI 컴포넌트
│  └─ types/     # 공통 타입 정의
└─ package.json  # Yarn workspace 설정
```

### 🔒 Supabase 설정 (필수)
```
// packages/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL!
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 📝 기능 구현 프롬프트
**1. 소셜 로그인 구현**:
```
// apps/web/components/AuthButton.tsx
const GoogleLogin = () => {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
    if (error) console.error('Login Error:', error)
  }
  
  return <button onClick={handleLogin}>Google 로그인</button>
}
```

**2. 숙제 제출 기능**:
```
// apps/web/lib/assignments.ts
interface HomeworkSubmission {
  user_id: string;
  problem_id: string;
  code: string;
  status: 'pending' | 'completed';
}

const submitHomework = async (submission: HomeworkSubmission) => {
  const { data, error } = await supabase
    .from('submissions')
    .insert([submission])
    .select()
  
  if (error) throw new Error(error.message)
  return data
}
```

**3. 캘린더 컴포넌트**:
```
// packages/ui/components/Calendar.tsx
const EduCalendar = ({ events }) => {
  const isPaymentDue = (date) => 
    events.some(event => event.type === 'payment' && event.date === date)

  return (
    <div className="calendar">
      {events.map(event => (
        <div key={event.id} className="event">
          {event.title}
        </div>
      ))}
    </div>
  )
}
```

### ⚙️ 환경 변수 설정 (.env)
```
PUBLIC_SUPABASE_URL=https://sgypverywcewrbvvekmy.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNneXB2ZXJ5d2Nld3JidnZla215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NTM3MzAsImV4cCI6MjA1OTIyOTczMH0.AfKQ7_ZZo_GJVJa0qwZTeIMIUaawZwvLKJP09kUMmQ4
```

### 🚀 배포 설정
1. **Vercel 배포**:
```bash
vercel deploy --prod
```
2. **Supabase 무료 티어 사용**:
- Database: 기본 500MB 제공
- Auth: 월 50,000명 무료 사용자
- Storage: 1GB 무료 제공

### 💡 최적화 팁
1. **SSG 활용**: 정적 페이지 생성
```astro
---
// apps/web/src/pages/assignments/[id].astro
const { id } = Astro.params;
const { data } = await supabase.from('problems').select('*').eq('id', id).single();
---

<Layout>
  <h1>{data.title}</h1>
  <p>{data.description}</p>
</Layout>
```

2. **RLS 활성화**:
```sql
-- Supabase SQL 편집기에서 실행
create policy "Students can view own submissions"
on submissions for select using (auth.uid() = user_id);
```

3. **실시간 알림**:
```
// apps/web/lib/realtime.ts
const channel = supabase.channel('submissions')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public' },
    (payload) => showNotification(`새 제출: ${payload.new.problem_id}`)
  )
  .subscribe()
```

### ⚠️ 주의사항
1. 반드시 `@supabase/ssr` 패키지 사용
2. Cookie 처리 시 `getAll()`, `setAll()`만 사용
3. `auth-helpers-nextjs` 패키지 사용 금지
4. Supabase 클라이언트는 항상 공유 패키지에서 관리
5. 선생님 계정은 단일 관리자로만 존재
6. 결제는 실제 결제 시스템 없이 수동으로 관리