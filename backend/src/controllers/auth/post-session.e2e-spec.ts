import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Post session (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /auth/session', async () => {
    const email = 'johndoe@vallete.com'
    const password = '123abc'
    const hashedPassword = await hash(password, 6)

    await prisma.user.create({
      data: {
        name: 'John Doe',
        email,
        password: hashedPassword,
      },
    })

    const response = await request(app.getHttpServer())
      .post('/auth/session')
      .send({
        email,
        password,
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
