import { IsEmail, IsString, Length} from 'class-validator';

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
}