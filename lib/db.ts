// /lib/prisma.ts
/**
 * 클라이언트가 Prisma Client를 연결시마다 생성하지 않도록 Singleton 패턴 적용 (클라이언트 설정은 여기서)
 */
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  if (process.env.NODE_ENV === 'development') {
    const prisma = new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
    });

    // 이벤트 리스너 등록
    prisma.$on('query', (e) => {
      console.log('Query: ' + e.query);
      console.log('Params: ' + e.params);
      console.log('Duration: ' + e.duration + 'ms');
    });

    return prisma;
  } else {
    const prisma = new PrismaClient();
    return prisma;
  }
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

export default prisma;
