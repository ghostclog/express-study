project-root/
├── src/
│   ├── app.ts                # Express 서버 엔트리포인트
│   ├── config/               # 설정 파일들 (DB, 세션 등)
│   │   ├── db.ts             # TypeORM DataSource 설정
│   │   └── session.ts        # express-session & passport 설정
│   ├── domain/               # 엔티티 정의 (TypeORM Entity)
│   │   ├── User.ts
│   │   ├── Post.ts
│   │   └── Comment.ts
│   ├── infrastructure/       # DB/ORM/Repository 계층
│   │   ├── repositories/
│   │   │   ├── UserRepository.ts
│   │   │   ├── PostRepository.ts
│   │   │   └── CommentRepository.ts
│   │   └── orm.ts            # DataSource 초기화
│   ├── application/          # 서비스 로직
│   │   ├── UserService.ts
│   │   ├── PostService.ts
│   │   └── CommentService.ts
│   ├── presentation/         # Express 라우터 (Controller)
│   │   ├── routes/
│   │   │   ├── index.ts      # 홈/소개
│   │   │   ├── auth.ts       # 로그인/회원가입/소셜 로그인
│   │   │   ├── posts.ts      # 게시글 CRUD
│   │   │   └── comments.ts   # 댓글
│   │   └── templates/        # ejs 뷰
│   │       ├── layout/
│   │       │   ├── header.ejs
│   │       │   └── footer.ejs
│   │       ├── index.ejs
│   │       ├── posts.ejs
│   │       └── detail.ejs
│   └── utils/                # 유틸 모듈
│       ├── crypto.ts
│       └── sessionStore.ts
│
├── public/                   # 정적 파일(css, js, img)
├── ormconfig.json            # TypeORM 설정 파일 (또는 .ts 버전 가능)
├── package.json
├── tsconfig.json
└── README.md

------

📦필요한 npm 패키지 목록
핵심

express → 웹 서버

express-session → 세션 관리

typeorm → ORM (Entity 관리)

sqlite3 → SQLite 드라이버

reflect-metadata → TypeORM 필수 데코레이터 지원

인증 & 보안

passport → 인증 미들웨어

passport-local → 로컬 로그인 전략

passport-google-oauth20 → 구글 소셜 로그인

passport-github2 → 깃허브 소셜 로그인 (추가 예시)

bcrypt → 비밀번호 해싱

템플릿 엔진

ejs → 뷰 템플릿 엔진

실시간 기능

socket.io → 댓글 알림, 실시간 이벤트 전송

개발 편의

typescript

ts-node-dev → 개발용 핫리로드

@types/express

@types/node

@types/ejs

@types/express-session

@types/passport

@types/passport-local

@types/socket.io

🚀 실행 시나리오 (업데이트 반영)

메인 페이지 (/) → 소개 및 시작 버튼

회원가입/로그인 (/auth)

로컬 로그인 (passport-local)

구글/깃허브 로그인 (passport-google-oauth20, passport-github2)

로그인 후 세션 기반 유저 유지

게시글 리스트 (/posts) → 글 목록

게시글 상세 (/posts/:id) → 글 & 댓글, 실시간 알림

세션 관리 → SQLite + connect-sqlite3 (선택)

알림 기능 → 댓글 작성 시 socket.io로 해당 게시글 구독자들에게 push