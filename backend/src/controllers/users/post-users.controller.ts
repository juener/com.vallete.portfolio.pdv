import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ApiBody } from '@nestjs/swagger'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const postUserBodySchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
})

type PutUserBodySchema = z.infer<typeof postUserBodySchema>

@Controller('/users')
export class PostUserController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(postUserBodySchema))
  @ApiBody({
    schema: {
      properties: {
        name: { example: 'John Doe' },
        email: { example: 'johndoe@vallete.com' },
        password: { example: '123abc' },
      },
    },
  })
  async postUser(@Body() body: PutUserBodySchema) {
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
        password: hashedPassword,
      },
    })
  }
}
