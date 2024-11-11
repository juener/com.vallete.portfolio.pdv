import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBody, ApiHeader, ApiParam } from '@nestjs/swagger'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const getUserParamSchema = z.object({
  id: z.string().uuid(),
})

type GetUserParamSchema = z.infer<typeof getUserParamSchema>

@Controller()
@UsePipes(new ZodValidationPipe(getUserParamSchema))
@UseGuards(AuthGuard('jwt'))
export class GetUserController {
  constructor(private prisma: PrismaService) {}

  @Get('/users/:id')
  @ApiParam({
    name: 'id',
    example: {
      id: '12345678-1234-1234-1234-123456789012',
    },
  })
  @ApiHeader({
    name: 'Authorization',
    description:
      'You must get the access_token using the route POST /authenticate.',
    example: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCabcdkpXVCJ9.eyJzdWIiOiI1YmQ4ZThkYi0xNzc1LTQwYjMtYWQ3OC02NTgyMDM2ZGRjMGMiLCJpYXQiOjE3MzEyOTg3MTJ9.RNQcF95OlBmq43UqDUi8rbiSNQUfurCtYFnIGgewZLo',
    },
  })
  async getUser(@Param() { id }: GetUserParamSchema) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    return { user }
  }
}
