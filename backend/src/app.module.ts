import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UserController } from './controllers/user.controller'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { AuthenticationController } from './controllers/authentication.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [UserController, AuthenticationController],
  providers: [PrismaService],
})
export class AppModule {}
