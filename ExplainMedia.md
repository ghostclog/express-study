1. 메인 페이지

<img width="1039" height="583" alt="image" src="https://github.com/user-attachments/assets/37d2ce17-7a0d-4daa-a5bb-466b09237279" />

---

2. 로그인 및 회원가입 페이지

<img width="582" height="519" alt="image" src="https://github.com/user-attachments/assets/1c5ccc94-9bfd-4b7c-a7f7-16e1281200d4" />

<img width="510" height="460" alt="image" src="https://github.com/user-attachments/assets/5925eaad-cdaf-4a96-8017-6c1a60fee8c2" />

---

3. 로그인 이후 메인 페이지

<img width="996" height="495" alt="image" src="https://github.com/user-attachments/assets/7435aa7c-444e-42a8-aae2-75ea16fb2128" />

4. 스트리밍 페이지 예시

<img width="975" height="808" alt="image" src="https://github.com/user-attachments/assets/db8b0fc5-539a-47ae-88cf-86b6f5865873" />

---

5. 그 밖의 작업 사항들

테이블 버그 수정

<img width="805" height="422" alt="image" src="https://github.com/user-attachments/assets/60dae980-d090-4daa-8a80-6743748efdc6" />

버그 발견 위치: 로그인
버그 사유: 회원가입 당시에는 profile이라는 테이블을 사용하지 않았으나, 로그인 이후에는 profile이라는 테이블을 같이 가져오는데, 이때 해당 테이블과의 연결이 재대로 되어있지 않는다는 이슈가 존재.
해결: 해당 컬럼(역참조 컬럼)에 조인 선언 어노테이션 추가로 해결
