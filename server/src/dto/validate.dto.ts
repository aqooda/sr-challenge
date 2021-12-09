import { IsDefined, isEmpty, isNotEmpty, IsString, ValidateIf } from 'class-validator';

export class ValidateDto {
  @ValidateIf(({ email, phone }) => isEmpty(email) || isNotEmpty(phone))
  @IsDefined()
  @IsString()
  phone: string;

  @ValidateIf(({ email, phone }) => isEmpty(phone) || isNotEmpty(email))
  @IsDefined()
  @IsString()
  email: string;
}
