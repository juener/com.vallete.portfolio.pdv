import { PrismaService } from '@/prisma/prisma.service'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBody, ApiResponse } from '@nestjs/swagger'
import { CurrentUser } from '../users/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'

const paramsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
})

type ParamsSchema = z.infer<typeof paramsSchema>

@Controller('/stores')
@UseGuards(AuthGuard('jwt'))
export class GetStoresController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getStores(
    @Query(new ZodValidationPipe(paramsSchema)) params: ParamsSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const page = params.page
    const perPage = 20

    const stores = await this.prisma.store.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      where: {
        users: {
          every: { id: user.sub },
        },
      },
    })

    return { stores, page, perPage }
  }
}
