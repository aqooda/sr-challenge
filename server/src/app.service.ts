import { HttpService } from '@nestjs/axios';
import { BadGatewayException, BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { getErrorResponse } from './exceptions';
import type { EmailValidationResult, ErrorResponse, PhoneValidationResult } from './types/validation-api-response';

type ValidateType = 'phone' | 'email';

type GetValidationResultType<T extends ValidateType> = T extends 'phone'
  ? PhoneValidationResult
  : EmailValidationResult;

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);
  private phoneResultCache = new Map<string, PhoneValidationResult>();
  private emailResultCache = new Map<string, EmailValidationResult>();

  constructor(private configService: ConfigService, private httpService: HttpService) {}

  getAccessKeyByValidateType(type: ValidateType) {
    return type === 'phone'
      ? this.configService.get('PHONE_VALIDATION_API_ACCESS_KEY')
      : this.configService.get('EMAIL_VALIDATION_API_ACCESS_KEY');
  }

  getEndpointByValidateType(type: ValidateType) {
    return type === 'phone' ? 'validate' : 'check';
  }

  getQueryKeyByValidateType(type: ValidateType) {
    return type === 'phone' ? 'number' : 'email';
  }

  async getValidationResult<T extends ValidateType>(
    validateType: T,
    value: string,
  ): Promise<GetValidationResultType<T>> {
    const cachedResult = validateType === 'phone' ? this.phoneResultCache.get(value) : this.emailResultCache.get(value);

    return (cachedResult as GetValidationResultType<T>) ?? this.submitValidationRequest(validateType, value);
  }

  storeResultToCache<T extends ValidateType>(validateType: T, key: string, result: GetValidationResultType<T>) {
    if (validateType === 'phone') {
      this.phoneResultCache.set(key, result as PhoneValidationResult);
    } else {
      this.emailResultCache.set(key, result as EmailValidationResult);
    }
  }

  async submitValidationRequest<T extends ValidateType>(validateType: T, value: string) {
    const apiEndpoint = `${this.configService.get('VALIDATION_API_URL')}/${this.getEndpointByValidateType(
      validateType,
    )}`;
    const params: Record<string, string> = {
      [this.getQueryKeyByValidateType(validateType)]: value,
      access_key: this.getAccessKeyByValidateType(validateType),
    };

    try {
      this.logger.log(`Submitting request to: ${apiEndpoint}, Query params: ${params.toString()}`);

      const response = await lastValueFrom(
        this.httpService.get<GetValidationResultType<T> | ErrorResponse>(apiEndpoint, { params }),
      );

      if ('success' in response.data) {
        this.logger.error(`Failed to request: ${apiEndpoint}, Reason: ${response.data.error.info}`);

        throw new BadRequestException(getErrorResponse('EXTERNAL_API_ERROR'), response.data.error.info);
      }

      this.logger.log(`Succeed to request: ${apiEndpoint}, Data: ${response.data.toString()}`);
      this.storeResultToCache(validateType, value, response.data);

      return response.data;
    } catch (err) {
      if (err.response) {
        this.logger.log(`Failed to request: ${apiEndpoint}, Reason: ${err.message}`);

        throw new BadGatewayException(getErrorResponse('EXTERNAL_API_ERROR'));
      }

      throw err;
    }
  }

  async validate({ phone, email }: Partial<Record<ValidateType, string>>) {
    const [phoneResult, emailResult] = await Promise.all([
      phone && this.getValidationResult('phone', phone),
      email && this.getValidationResult('email', email),
    ]);

    return {
      phone: phoneResult ?? null,
      email: emailResult ?? null,
    };
  }
}
