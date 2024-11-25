// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/ko'; // 한글 데이터 생성을 위해 ko locale 사용

const prisma = new PrismaClient();

// 데이터 생성 수량 설정
const USER_COUNT = 5;
const CATEGORIES_PER_USER = 3;
const POSTS_PER_CATEGORY = 4;
const COMMENTS_PER_POST = 3;
const REPLIES_PER_COMMENT = 2;

// URL slug 생성 헬퍼 함수
const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

async function main() {
  try {
    // 기존 데이터 정리
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.category.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    await prisma.verificationToken.deleteMany();

    console.log('🧹 기존 데이터 정리 완료');

    // 테스트용 관리자 계정 생성
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        emailVerified: new Date(),
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`,
        role: 'admin',
        bio: '관리자 계정입니다.',
        slug: 'admin-user',
      },
    });

    console.log('👑 관리자 계정 생성 완료');

    // 일반 사용자 생성
    const users = await Promise.all(
      Array(USER_COUNT)
        .fill(null)
        .map(async () => {
          const firstName = faker.person.firstName();
          const lastName = faker.person.lastName();
          const fullName = `${lastName}${firstName}`;

          return prisma.user.create({
            data: {
              name: fullName,
              email: faker.internet.email({ firstName, lastName }),
              emailVerified: faker.date.past(),
              image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`,
              role: 'user',
              bio: faker.person.bio(),
              slug: createSlug(fullName),
            },
          });
        })
    );

    console.log('👥 일반 사용자 생성 완료');

    // 모든 사용자 (관리자 포함)
    const allUsers = [adminUser, ...users];

    // 각 사용자별 카테고리 생성
    for (const user of allUsers) {
      const categories = await Promise.all(
        Array(CATEGORIES_PER_USER)
          .fill(null)
          .map(async (_, index) => {
            const name = faker.word.words(2);
            return prisma.category.create({
              data: {
                name,
                slug: createSlug(name),
                userId: user.id,
              },
            });
          })
      );

      // 각 카테고리별 포스트 생성
      for (const category of categories) {
        const posts = await Promise.all(
          Array(POSTS_PER_CATEGORY)
            .fill(null)
            .map(async () => {
              const title = faker.lorem.sentence();
              return prisma.post.create({
                data: {
                  title,
                  slug: createSlug(title),
                  content: faker.lorem.paragraphs(5),
                  published: faker.datatype.boolean(0.8), // 80% 확률로 published true
                  userId: user.id,
                  categoryId: category.id,
                },
              });
            })
        );

        // 각 포스트별 댓글 생성
        for (const post of posts) {
          // 최상위 댓글 생성
          const comments = await Promise.all(
            Array(COMMENTS_PER_POST)
              .fill(null)
              .map(async () => {
                return prisma.comment.create({
                  data: {
                    content: faker.lorem.paragraph(),
                    userId: faker.helpers.arrayElement(allUsers).id,
                    postId: post.id,
                    isDeleted: faker.datatype.boolean(0.1), // 10% 확률로 삭제된 댓글
                  },
                });
              })
          );

          // 대댓글 생성
          for (const comment of comments) {
            await Promise.all(
              Array(REPLIES_PER_COMMENT)
                .fill(null)
                .map(async () => {
                  return prisma.comment.create({
                    data: {
                      content: faker.lorem.paragraph(),
                      userId: faker.helpers.arrayElement(allUsers).id,
                      postId: post.id,
                      parentId: comment.id,
                      isDeleted: faker.datatype.boolean(0.1), // 10% 확률로 삭제된 댓글
                    },
                  });
                })
            );
          }
        }
      }
    }

    console.log('📝 카테고리, 포스트, 댓글 생성 완료');

    // 통계 출력
    const stats = {
      users: await prisma.user.count(),
      categories: await prisma.category.count(),
      posts: await prisma.post.count(),
      comments: await prisma.comment.count(),
    };

    console.log('\n📊 데이터 생성 통계:');
    console.log('------------------------');
    console.log(`사용자 수: ${stats.users}명`);
    console.log(`카테고리 수: ${stats.categories}개`);
    console.log(`포스트 수: ${stats.posts}개`);
    console.log(`댓글 수: ${stats.comments}개`);
    console.log('------------------------');
    console.log('✅ 시드 데이터 생성이 완료되었습니다!');

    // 테스트 계정 정보 출력
    console.log('\n🔑 테스트 계정 정보:');
    console.log('------------------------');
    console.log('관리자 계정:');
    console.log(`- 이메일: ${adminUser.email}`);
    console.log(`- 역할: ${adminUser.role}`);
  } catch (error) {
    console.error('❌ 시드 데이터 생성 중 오류 발생:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
