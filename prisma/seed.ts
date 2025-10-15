import { PrismaClient, Role, CourseLevel, EnrollmentStatus, ScheduleType, VideoStatus, NotificationType } from '@prisma/client';
import { hash } from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  await db.$transaction([
    db.message.deleteMany(),
    db.messageThread.deleteMany(),
    db.notification.deleteMany(),
    db.comment.deleteMany(),
    db.grade.deleteMany(),
    db.submission.deleteMany(),
    db.assignment.deleteMany(),
    db.lesson.deleteMany(),
    db.enrollment.deleteMany(),
    db.scheduleItem.deleteMany(),
    db.course.deleteMany(),
    db.profile.deleteMany(),
    db.user.deleteMany(),
    db.tag.deleteMany(),
    db.videoAsset.deleteMany()
  ]);

  const passwordHash = await hash('password123', 10);

  const admin = await db.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@norkode.dev',
      role: Role.admin,
      passwordHash,
      profile: {
        create: {
          bio: 'Platform administrator',
          socials: {},
          timezone: 'Asia/Tehran',
          languages: ['fa', 'en']
        }
      }
    }
  });

  const mentors = await Promise.all(
    [1, 2].map((index) =>
      db.user.create({
        data: {
          name: `Mentor ${index}`,
          email: `mentor${index}@norkode.dev`,
          role: Role.mentor,
          passwordHash,
          profile: {
            create: {
              bio: 'Experienced software engineer',
              socials: { twitter: `@mentor${index}` },
              timezone: 'Asia/Tehran',
              languages: ['fa', 'en']
            }
          }
        }
      })
    )
  );

  const students = await Promise.all(
    Array.from({ length: 6 }).map((_, index) =>
      db.user.create({
        data: {
          name: `Student ${index + 1}`,
          email: `student${index + 1}@norkode.dev`,
          role: Role.student,
          passwordHash,
          profile: {
            create: {
              bio: 'Aspiring developer',
              socials: {},
              timezone: 'Asia/Tehran',
              languages: ['fa']
            }
          }
        }
      })
    )
  );

  const tags = await Promise.all(
    ['frontend', 'backend', 'devops', 'ai'].map((name) =>
      db.tag.create({ data: { name, slug: name } })
    )
  );

  const videoAssets = await Promise.all(
    Array.from({ length: 18 }).map((_, index) =>
      db.videoAsset.create({
        data: {
          path: `videos/sample-${index + 1}.mp4`,
          size: 1024,
          mimeType: 'video/mp4',
          durationSec: 600,
          thumbnailUrl: '/images/video-placeholder.jpg',
          status: VideoStatus.ready
        }
      })
    )
  );

  const courses = await Promise.all(
    [0, 1, 2].map((i) =>
      db.course.create({
        data: {
          title: `Fullstack Bootcamp ${i + 1}`,
          slug: `fullstack-bootcamp-${i + 1}`,
          description: 'Deep dive into modern web development with Persian mentors.',
          level: [CourseLevel.beginner, CourseLevel.intermediate, CourseLevel.advanced][i % 3],
          language: 'fa',
          tags: tags.slice(0, 3).map((t) => t.name),
          thumbnailUrl: '/images/course-thumb.jpg',
          published: true,
          mentorId: mentors[i % mentors.length].id
        }
      })
    )
  );

  await Promise.all(
    courses.map((course, courseIndex) =>
      (async () => {
        const lessons = await Promise.all(
          Array.from({ length: 6 }).map((_, lessonIndex) =>
            db.lesson.create({
              data: {
                courseId: course.id,
                title: `Lesson ${lessonIndex + 1}`,
                slug: `${course.slug}-lesson-${lessonIndex + 1}`,
                order: lessonIndex + 1,
                summary: 'Understanding core concepts with hands-on demos.',
                durationSec: 900,
                resources: ['/resources/sample.pdf'],
                videoAssetId: videoAssets[courseIndex * 6 + lessonIndex].id
              }
            })
          )
        );

        const assignments = await Promise.all(
          Array.from({ length: 2 }).map((_, assignmentIndex) =>
            db.assignment.create({
              data: {
                courseId: course.id,
                title: `Assignment ${assignmentIndex + 1}`,
                description: 'Build a feature to practise the module.',
                dueAt: new Date(Date.now() + (assignmentIndex + 1) * 7 * 24 * 60 * 60 * 1000),
                maxPoints: 100,
                rubric: { clarity: 40, functionality: 60 }
              }
            })
          )
        );

        await Promise.all(
          Array.from({ length: 2 }).map((_, studentIndex) =>
            db.enrollment.create({
              data: {
                courseId: course.id,
                studentId: students[(courseIndex * 2 + studentIndex) % students.length].id,
                status: EnrollmentStatus.active,
                progress: (studentIndex + 1) * 20
              }
            })
          )
        );

        await Promise.all(
          assignments.map((assignment, idx) =>
            db.submission.create({
              data: {
                assignmentId: assignment.id,
                studentId: students[(courseIndex + idx) % students.length].id,
                text: 'https://github.com/example/project',
                files: ['submission.zip'],
                submittedAt: new Date(),
                grade: {
                  create: {
                    graderId: mentors[courseIndex % mentors.length].id,
                    points: 80 + idx * 5,
                    feedback: 'Great job! Keep iterating.'
                  }
                }
              }
            })
          )
        );

        await Promise.all(
          Array.from({ length: 4 }).map((_, scheduleIdx) =>
            db.scheduleItem.create({
              data: {
                courseId: course.id,
                title: `Live session ${scheduleIdx + 1}`,
                startsAt: new Date(Date.now() + scheduleIdx * 2 * 24 * 60 * 60 * 1000),
                endsAt: new Date(Date.now() + scheduleIdx * 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
                type: scheduleIdx % 2 === 0 ? ScheduleType.live : ScheduleType.deadline
              }
            })
          )
        );

        await Promise.all(
          lessons.slice(0, 3).map((lesson, idx) =>
            db.comment.create({
              data: {
                lessonId: lesson.id,
                authorId: students[(courseIndex + idx) % students.length].id,
                content: 'Could you explain this topic again?'
              }
            })
          )
        );

        const thread = await db.messageThread.create({
          data: {
            courseId: course.id,
            mentorId: mentors[courseIndex % mentors.length].id,
            studentId: students[courseIndex % students.length].id
          }
        });

        await Promise.all(
          Array.from({ length: 3 }).map((_, msgIdx) =>
            db.message.create({
              data: {
                threadId: thread.id,
                authorId: msgIdx % 2 === 0 ? mentors[courseIndex % mentors.length].id : students[courseIndex % students.length].id,
                content: msgIdx % 2 === 0 ? 'How is the assignment going?' : 'Need help with deployment.'
              }
            })
          )
        );

        await Promise.all(
          students.slice(0, 3).map((student) =>
            db.notification.create({
              data: {
                userId: student.id,
                type: NotificationType.assignment,
                payload: { course: course.title, message: 'New assignment posted!' }
              }
            })
          )
        );
      })()
    )
  );

  console.log('Seed complete', { admin: admin.email });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
