import { PrismaService } from '@/prisma/prisma.service'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader } from '@nestjs/swagger'

@Controller('/users')
@UseGuards(AuthGuard('jwt'))
export class GetUsersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiHeader({
    name: 'Authorization',
    description:
      'You must get the access_token using the route POST /authenticate.',
    example: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCabcdkpXVCJ9.eyJzdWIiOiI1YmQ4ZThkYi0xNzc1LTQwYjMtYWQ3OC02NTgyMDM2ZGRjMGMiLCJpYXQiOjE3MzEyOTg3MTJ9.RNQcF95OlBmq43UqDUi8rbiSNQUfurCtYFnIGgewZLo',
    },
  })
  async getUsers() {
    const users = await this.prisma.user.findMany({})

    return { users }
  }
}
