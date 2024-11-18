# Dockerfile 은 이미지를 어떻게 만들지를 정의한다.
# 레이어가 변경된 경우에만 해당 레이어부터 재시작된다.
# FROM base AS prisma 같이 레이어 위치를 조정 가능한데, 일단 단순하게 설정함

# Layer 1: 베이스 이미지 (캐시됨, 거의 재실행 안 됨)
FROM node:20-alpine

# Layer 2: 작업 디렉토리 설정 (캐시됨, 거의 재실행 안 됨)
WORKDIR /workspace
COPY package*.json ./
RUN npm install
COPY . .

# 포트 설정 (메타데이터일 뿐, 레이어 생성 안 함)
EXPOSE 3000
EXPOSE 5555