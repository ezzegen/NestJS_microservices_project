import { IsNumber, IsString, Length, Min } from 'class-validator';

export class RoleAddDto {
  @IsString({ message: 'Always string!' })
  @Length(
    4,
    15,
    { message: 'Count of symbols in the password min 4, max 30' },
  )
  readonly value: string;

  @IsNumber({}, { message: 'Always number!' })
  @Min(1)
  readonly userId: number;
}