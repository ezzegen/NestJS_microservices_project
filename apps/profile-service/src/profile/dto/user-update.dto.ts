import { IsNumberString, IsString } from 'class-validator';

export class UserUpdateDto {

  @IsString({ message: 'Always string!' })
  readonly property: string;

  @IsNumberString({},{ message: 'String or number!' })
  readonly value: string | number;
}