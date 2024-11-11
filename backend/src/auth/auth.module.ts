import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Env } from 'src/env'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(config: ConfigService<Env, true>) {
        const jwtSecret = config.get('JWT_SECRET', { infer: true })
        return {
          secret: jwtSecret,
        }
      },
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
