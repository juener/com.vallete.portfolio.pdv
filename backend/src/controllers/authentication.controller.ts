import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'
import { compare, hash } from 'bcryptjs'

const authenticationPostBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type AuthenticationPostBodySchema = z.infer<typeof authenticationPostBodySchema>

@Controller()
@UsePipes(new ZodValidationPipe(authenticationPostBodySchema))
export class AuthenticationController {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post('/authenticate')
  async handle(@Body() body: AuthenticationPostBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException('User credentials do not match.')
    }

    const hashedPassword = await hash(password, 6)
    const passwordsMatch = compare(user?.email, hashedPassword)

    if (!passwordsMatch) {
      throw new UnauthorizedException('User credentials do not match.')
    }

    const accessToken = this.jwtService.sign({ sub: user.id })

    return { access_token: accessToken }
  }
}
