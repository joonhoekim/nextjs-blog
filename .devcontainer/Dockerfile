# 플랫폼에 따라 기본 이미지 선택
ARG VARIANT=20-bullseye
FROM node:${VARIANT}

# 기본 패키지 설치
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        sudo \
        git \
        curl \
        sqlite3 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g env-cmd

# 개발 툴 설치
RUN npm install -g pnpm typescript @types/node

# 작업 디렉토리 설정
WORKDIR /workspace

# node_modules에 전역 쓰기 권한 부여
RUN mkdir -p /workspace/node_modules
RUN chmod 777 /workspace/node_modules

# 선택적: Prisma CLI 설치
RUN npm install -g prisma

USER node