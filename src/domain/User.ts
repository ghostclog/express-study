

export class UserEn {
  id!: number;
  email!: string;
  password?: string;
  name?: string;
  count_post: number = 0;
  count_comment: number = 0;
  comment?: string;
  profile_image?: string;

  // 생성 시점 KST 기준 현재 시간
  createdAt: Date = new Date(
    new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
  );
  updatedAt: Date = new Date(
    new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
  );
}