import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'
import { compare } from 'bcryptjs'
import { ApiBody } from '@nestjs/swagger'

const loginPostBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type LoginPostBodySchema = z.infer<typeof loginPostBodySchema>

@Controller()
export class LoginController {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post('/auth/login')
  @ApiBody({
    description: 'You must get the access_token to use on protected routes.',
    schema: {
      properties: {
        email: { example: 'johndoe@vallete.com' },
        password: { example: '123abc' },
      },
    },
  })
  async login(
    @Body(new ZodValidationPipe(loginPostBodySchema)) body: LoginPostBodySchema,
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
