# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요 (Project Overview)

Next.js App Router 기반 개인 홈페이지. MDX 파일을 읽어 블로그 포스트를 생성하는 구조다.

## 기술 스택 (Tech Stack)

- Frontend: Next.js 15 (App Router, RSC)
- Styling: Tailwind CSS + @tailwindcss/typography
- Font: Noto Serif KR (Google Fonts)
- 콘텐츠: MDX (`next-mdx-remote/rsc`) + `gray-matter` + `reading-time`

## 디자인 토큰 (Design Tokens)

| 역할 | 값 |
|---|---|
| 배경 | `#F9F8F6` (`cream`) |
| 포인트 컬러 | `#2C4A2E` (`green-deep`) |
| 호버 | `#4A7C59` (`green-mid`) |
| 연한 배경 강조 | `#E8F0E9` (`green-light`) |
| 구분선 | `#E5E3DE` (`border`) |

## 디렉토리 구조 (Directory Structure)

```
src/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (폰트, 메타데이터)
│   ├── page.tsx            # 홈 (최근 글 3개 표시)
│   └── posts/
│       ├── page.tsx        # 전체 글 목록
│       └── [slug]/page.tsx # 개별 포스트 (MDX 렌더링)
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── PostCard.tsx
└── lib/
    └── mdx.ts              # getAllPosts(), getPostBySlug() 유틸리티

content/
└── posts/                  # .mdx 파일을 이곳에 추가
```

## 콘텐츠 작성 규칙 (MDX Frontmatter)

```mdx
---
title: 글 제목
date: 2026-05-02
description: 글 설명 (목록에 표시됨)
tags:
  - 태그1
  - 태그2
---
```

`content/posts/` 에 `.mdx` 파일을 추가하면 자동으로 포스트가 생성된다.

## 가이드라인 & 규칙 (Guidelines)

- UI 컴포넌트는 `src/components/`에 위치시킨다.
- 모든 페이지는 `generateMetadata`로 SEO 메타 태그를 설정한다.
- 색상은 Tailwind 커스텀 토큰(`green-deep`, `cream` 등)을 사용하고 하드코딩하지 않는다.
- TypeScript를 사용하여 타입을 명확히 정의한다.

## 주요 명령어 (Commands)

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 린트 체크
npm run lint
```
