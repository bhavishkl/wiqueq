// apps/server/src/core/configuration/configuration.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Utility } from '@server/helpers/utility';
import { ConfigurationServiceObject } from './configuration.service.object';

@Injectable()
export class ConfigurationService {
  constructor(private manager: ConfigService) {}

  get(key: string, valueDefault?: string): string {
    let value = this.manager.get<string>(key);

    if (!Utility.isDefined(value)) {
      value = valueDefault;
    }

    return value;
  }

  getPort(): number {
    let value = this.manager.get<number>(ConfigurationServiceObject.Key.PORT);

    if (!Utility.isDefined(value)) {
      value = 3099;
    }

    return value;
  }

  getNumber(key: string, valueDefault?: number): number {
    let value = this.manager.get<number>(key);

    if (!Utility.isDefined(value)) {
      value = valueDefault;
    }

    return value;
  }

  getBoolean(key: string, valueDefault?: boolean): boolean {
    let value = this.manager.get<boolean>(key);

    if (!Utility.isDefined(value)) {
      value = valueDefault;
    }

    return value;
  }

  getEnvironment(): ConfigurationServiceObject.Environment {
    const value = this.get(
      ConfigurationServiceObject.Key.ENVIRONMENT,
      ConfigurationServiceObject.Environment.DEVELOPMENT,
    );

    return value as ConfigurationServiceObject.Environment;
  }

  getAuthenticationTokenMethod(): ConfigurationServiceObject.AuthenticationTokenMethod {
    const value = this.manager.get<string>(
      ConfigurationServiceObject.Key.AUTHENTICATION_TOKEN_METHOD,
      ConfigurationServiceObject.AuthenticationTokenMethod.COOKIES,
    );

    return value as ConfigurationServiceObject.AuthenticationTokenMethod;
  }

  getClientBaseUrl(): string {
    const value = this.manager.get<string>(
      ConfigurationServiceObject.Key.CLIENT_BASE_URL,
    );

    const valueClean = Utility.removeTrailingSlash(value);

    return valueClean;
  }

  getBaseUrl(): string {
    const port = this.getPort();

    let value = this.manager.get<string>(ConfigurationServiceObject.Key.BASE_URL);

    if (!Utility.isDefined(value)) {
      value = `http://localhost:${port}`;
    }

    const valueClean = Utility.removeTrailingSlash(value);

    return valueClean;
  }

  isEnvironmentDevelopment(): boolean {
    return (
      this.getEnvironment() ===
      ConfigurationServiceObject.Environment.DEVELOPMENT
    );
  }

  isEnvironmentProduction(): boolean {
    return (
      this.getEnvironment() ===
      ConfigurationServiceObject.Environment.PRODUCTION
    );
  }

  getJwtSecret(): string {
    const secret = this.get('JWT_SECRET', 'default_jwt_secret');
    console.log(`JWT Secret: ${secret}`); // Debug log
    return secret;
  }
  
}
