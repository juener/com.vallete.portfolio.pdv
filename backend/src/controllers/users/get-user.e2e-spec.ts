import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Get user (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /user', async () => {
    const email = 'johndoe@vallete.com'
    const password = '123abc'

    const createdUser = await prisma.user.create({
      data: {
        name: 'John Doe',
        email,
        password,
      },
    })

    await prisma.user.createMany({
      data: [
        {
          name: 'John Doe 002',
          email: 'johndoe002@vallete.com',
          password,
        },
        {
          name: 'John Doe 003',
          email: 'johndoe003@vallete.com',
          password,
        },
      ],
    })

    const accessToken = jwt.sign({ sub: createdUser.id })

    const response = await request(app.getHttpServer())
      .get(`/users/${createdUser.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ user: expect.objectContaining({ email }) })
  })
})
