import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import type { Env } from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })

  const configService: ConfigService<Env, true> = app.get(ConfigService)
  const port = configService.get('APP_PORT')

  await app.listen(3333)
}
bootstrap()
