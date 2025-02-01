import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { SessionController } from './controllers/auth/post-session.controller'
import { GetUsersController } from './controllers/users/get-users.controller'
import { PostUserController } from './controllers/users/post-user.controller'
import { PutUserController } from './controllers/users/put-user.controller'
import { PostStoreController } from './controllers/stores/post-store.controller'
import { envSchema } from './env'
import { PrismaService } from './prisma/prisma.service'
import { GetUserController } from './controllers/users/get-user.controller'
import { GetStoresController } from './controllers/stores/get-stores-controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    SessionController,
    GetUserController,
    GetUsersController,
    PostUserController,
    PutUserController,
    GetStoresController,
    PostStoreController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
