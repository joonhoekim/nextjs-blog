# Server Actions

[docs](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

## Use actions in client components

인라인에서 정의해서 쓸 수는 있다. 해당 컴포넌트에서만 쓰는 경우에만 이렇게 쓰고, 일반적으로는 @/actions 에 모아두고 쓴다.

```typescript
'use client';

import { create } from '@/app/actions';

export function Button() {
  return <button onClick={() => create()}>Create</button>;
}
```

## 궁금했던 것들

- Server Action은 'use server' 지시문이 있는 함수로, 서버에서만 실행됨
- Form 또는 버튼 이벤트에서 직접 호출할 수 있음
- Prisma Client는 Server Action 내부에서 안전하게 사용할 수 있음
- 전역 상태로 관리하는 경우의 장단점
  - 데이터 흐름의 일관성을 얻을 수 있는 장점
  - 서버/클라이언트 컴포넌트 경계가 모호해지고 하이드레이션 이슈가 발생하거나, 타입 추론이 어려워지는 문제가 생길 수 있는 단점

## @/actions 구성

도메인 단위로 구성하거나, 기능별로 구성하거나, 하이브리드 접근 방식을 쓰거나...  
Java에서 프로젝트 디렉토리 구성할 때와 동일하게 정해진 답은 없음.

일반적으로 권장되는 구성은 도메인 단위 구성하는 것이고, 단일 파일로 시작했다가 불편이 느껴지는 시점에서 분리하는 것이 권장됨.

@/app/actions 에 구성하는 경우도 있으나, 많은 사례가 @/actions를 더 선호하는 것으로 보임. 다들 자주 사용하는 경로다보니 접근이 쉬워지는 쪽을 선호하시는 듯.

### 단일파일로 구성하고 사용하는 예시

#### action 구성

```typescript
// @/actions/posts.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// 타입 정의
export interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
}

export interface CreatePostData {
  title: string;
  content: string;
}

// 유틸리티 함수들
function validatePost(data: CreatePostData) {
  if (!data.title.trim()) throw new Error('Title is required');
  if (!data.content.trim()) throw new Error('Content is required');
}

// 액션들
export async function createPost(data: CreatePostData) {
  validatePost(data);
  const post = await prisma.post.create({ data });
  revalidatePath('/posts');
  return post;
}

export async function updatePost(id: string, data: Partial<CreatePostData>) {
  const post = await prisma.post.update({
    where: { id },
    data,
  });
  revalidatePath(`/posts/${id}`);
  return post;
}

export async function deletePost(id: string) {
  await prisma.post.delete({ where: { id } });
  revalidatePath('/posts');
}

export async function publishPost(id: string) {
  const post = await prisma.post.update({
    where: { id },
    data: { published: true },
  });
  revalidatePath(`/posts/${id}`);
  return post;
}
```

#### 사용

```typescript
// 필요한 액션만 선택적으로 import
import { createPost, updatePost } from '@/app/actions/posts';

// @/components/PostForm.tsx
('use client');

export function PostForm() {
  async function handleSubmit(formData: FormData) {
    await createPost({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
    });
  }

  return <form action={handleSubmit}>{/* form 내용 */}</form>;
}
```
