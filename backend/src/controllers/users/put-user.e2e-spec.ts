import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Update an user (e2e)', () => {
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

  test('[PUT] /users', async () => {
    const email = 'johndoe@vallete.com'
    const password = '123abc'

    const createdUser = await prisma.user.create({
      data: {
        name: 'John Doe',
        email,
        password,
      },
    })

    const accessToken = jwt.sign({ sub: createdUser.id })

    const response = await request(app.getHttpServer())
      .put('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        id: createdUser.id,
        name: 'John Doe is updated',
        email: 'johndoe2@vallete.com',
        password: '123abc@',
      })

    expect(response.statusCode).toBe(200)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'johndoe2@vallete.com',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
