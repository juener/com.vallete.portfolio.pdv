import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { LoginController } from './controllers/auth/login.controller'
import { GetUsersController } from './controllers/users/get-users.controller'
import { PostUserController } from './controllers/users/post-user.controller'
import { PutUserController } from './controllers/users/put-users.controller'
import { PostStoreController } from './controllers/stores/post-store.controller'
import { envSchema } from './env'
import { PrismaService } from './prisma/prisma.service'
import { GetUserController } from './controllers/users/get-user.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    LoginController,
    GetUserController,
    GetUsersController,
    PostUserController,
    PutUserController,
    PostStoreController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
