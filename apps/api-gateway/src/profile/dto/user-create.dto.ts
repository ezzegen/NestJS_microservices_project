import { IsNumber, IsEmail, IsString, Length, Max, Min } from 'class-validator';

export class UserCreateDto {
  readonly id: number;

  @IsString({ message: 'Always string!' })
  @IsEmail({}, { message: 'Incorrect email address' })
  readonly email: string;

  @IsString({ message: 'Always string!' })
  @Length(
    4,
    30,
    { message: 'Count of symbols in the password min 4, max 30' },
  )
  readonly password: string;

  @IsString({ message: 'Always string!' })
  @Length(
    4,
    30,
    { message: 'Count of symbols in the password min 4, max 30' },
  )
  readonly name: string;

  @IsString({ message: 'Always string!' })
  @Length(
    4,
    30,
    { message: 'Count of symbols in the password min 4, max 30' },
  )
  readonly surname: string;

  @IsNumber({},{ message: 'Always number!' })
  @Min(12)
  @Max(99)
  readonly age: number;

  @IsNumber({}, { message: 'Always number!' })
  @Min(11111111111)
  @Max(99999999999)
  readonly phone: number;
}