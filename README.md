# Express + TypeORM 기반 웹 애플리케이션

Node.js, Express, TypeORM을 사용하여 구현한 웹 애플리케이션 프로젝트입니다. 헥사고날 아키텍처(Hexagonal Architecture)를 참고하여 유지보수와 확장이 용이한 구조를 지향합니다.

## ✨ 주요 기능 (Features)

- **사용자 인증**: 로컬 이메일/비밀번호, 소셜 로그인(Google, GitHub)
- **세션 관리**: `express-session`을 이용한 로그인 상태 유지
- **게시판**: 게시글 CRUD(만들기, 읽기, 수정, 삭제)
- **댓글**: 게시글에 대한 댓글 작성 및 조회
- **실시간 알림**: `socket.io`를 활용한 새 댓글 실시간 푸시 알림

## 🛠️ 기술 스택 (Tech Stack)

### 핵심 (Core)
- **`express`**: 웹 서버 프레임워크
- **`typescript`**: 정적 타입 지원
- **`typeorm`**: ORM (Object-Relational Mapper)
- **`sqlite3`**: 경량 데이터베이스
- **`reflect-metadata`**: TypeORM 데코레이터 지원

### 인증 & 보안 (Auth & Security)
- **`passport`**: 인증 미들웨어
  - `passport-local`: 로컬 로그인 전략
  - `passport-google-oauth20`, `passport-github2`: 소셜 로그인 전략
- **`express-session`**: 세션 관리
- **`bcrypt`**: 비밀번호 해싱

### 템플릿 & 실시간 (View & Real-time)
- **`ejs`**: 템플릿 엔진
- **`socket.io`**: 실시간 웹 소켓 통신

### 개발 도구 (Dev Tools)
- **`ts-node-dev`**: 개발 환경용 핫 리로드 서버
- **`@types/*`**:各種ライブラリのTypeScript型定義

## 📂 프로젝트 구조 (Project Structure)

```
.
├── src/
│   ├── main.ts             # Express 서버 엔트리포인트 및 초기화
│   ├── adapter/            # 외부 시스템 연동 (I/O)
│   │   ├── db/             # 데이터베이스 (TypeORM 설정, Repository)
│   │   └── rest/           # REST API (Express 라우터)
│   ├── application/        # 서비스 로직 (비즈니스 규칙)
│   ├── domain/             # 핵심 도메인 모델 (엔티티, DTO)
│   └── settings/           # 보안, 세션 등 각종 설정
│
├── database.sqlite         # SQLite 데이터베이스 파일
├── package.json
└── tsconfig.json
```

## 🚀 시작하기 (Getting Started)

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

`ts-node-dev`를 사용하여 코드가 변경될 때마다 서버가 자동으로 재시작됩니다.

```bash
npm run dev
```

### 3. 데이터베이스

서버가 처음 시작될 때 `src/main.ts`의 TypeORM `synchronize: true` 설정에 의해 `database.sqlite` 파일과 테이블이 자동으로 생성됩니다.
> **⚠️ 주의**: `synchronize: true`는 개발 환경에서만 사용해야 합니다. 프로덕션 환경에서는 데이터 손실의 위험이 있으므로 TypeORM 마이레이션을 사용해야 합니다.