import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import {
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBody } from '@nestjs/swagger'
import { z } from 'zod'
import { CurrentUser } from '../users/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import { AuthGuard } from '@nestjs/passport'

const postStoreBodySchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  address: z.string().min(3),
})

type PostStoreBodySchema = z.infer<typeof postStoreBodySchema>

@Controller('/stores')
@UseGuards(AuthGuard('jwt'))
export class PostStoreController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @ApiBody({
    schema: {
      properties: {
        name: { example: 'Brazil Store' },
        email: { example: 'paris@brazilstore.com' },
        address: { example: 'Av. Gustave Eiffel, CP: 75001 - Paris, France' },
      },
    },
  })
  async postStore(
    @Body(new ZodValidationPipe(postStoreBodySchema))
    body: PostStoreBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, email, address } = body

    const storeWithSameName = await this.prisma.store.findFirst({
      where: {
        name,
      },
    })

    if (storeWithSameName) {
      throw new ConflictException('There is already a store using this name.')
    }

    await this.prisma.store.create({
      data: {
        name,
        email,
        address,
        users: {
          connect: {
            id: user.sub,
          },
        },
      },
    })
  }
}
