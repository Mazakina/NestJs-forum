import { Injectable } from '@nestjs/common'
import { EnvSchemaType } from './env'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<EnvSchemaType, true>) {}

  get<T extends keyof EnvSchemaType>(key: T) {
    return this.configService.get(key, { infer: true })
  }
}
