import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'
import { compare } from 'bcryptjs'
import { ApiBody } from '@nestjs/swagger'

const postSessionBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type PostSessionBodySchema = z.infer<typeof postSessionBodySchema>

@Controller()
export class SessionController {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post('/auth/session')
  @ApiBody({
    description: 'You must get the access_token to use on protected routes.',
    schema: {
      properties: {
        email: { example: 'johndoe@vallete.com' },
        password: { example: '123abc' },
      },
    },
  })
  async postSession(
    @Body(new ZodValidationPipe(postSessionBodySchema))
    body: PostSessionBodySchema,
  ) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException('User credentials do not match.')
    }

    const doPasswordsMatch = await compare(password, user?.password)

    if (!doPasswordsMatch) {
      throw new UnauthorizedException('User credentials do not match.')
    }

    const accessToken = this.jwtService.sign({ sub: user.id })

    return { access_token: accessToken }
  }
}
