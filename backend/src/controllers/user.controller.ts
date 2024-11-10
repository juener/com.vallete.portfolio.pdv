import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  UsePipes,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'

const userPostBodySchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
})

type UserPostBodySchema = z.infer<typeof userPostBodySchema>

@Controller('/users')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getUsers() {
    const users = await this.prisma.user.findMany({})

    return { users }
  }

  @Post()
  @UsePipes(new ZodValidationPipe(userPostBodySchema))
  async postUser(@Body() body: UserPostBodySchema) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException('There is already an user using this email.')
    }

    const hashedPassword = await hash(password, 6)

    await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    })
  }
}
