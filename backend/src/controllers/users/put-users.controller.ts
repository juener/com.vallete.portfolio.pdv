import {
  Body,
  ConflictException,
  Controller,
  Put,
  UsePipes,
} from '@nestjs/common'
import { ApiBody } from '@nestjs/swagger'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const putUserBodySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
})

type PutUserBodySchema = z.infer<typeof putUserBodySchema>

@Controller('/users')
export class PutUserController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @UsePipes(new ZodValidationPipe(putUserBodySchema))
  @ApiBody({
    schema: {
      properties: {
        id: { example: '12345678-1234-1234-1234-123456789012' },
        name: { example: 'John Doe' },
        email: { example: 'johndoe@vallete.com' },
        password: { example: '123abc' },
      },
    },
  })
  async putUser(@Body() body: PutUserBodySchema) {
    const { id, name, email, password } = body

    const doesUserExist = id
      ? await this.prisma.user.findFirst({ where: { id } })
      : null

    if (doesUserExist) {
      await this.prisma.user.update({
        data: {
          name,
          email,
          password,
        },
        where: {
          id,
        },
      })

      return
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
