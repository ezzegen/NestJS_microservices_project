import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate} from 'class-validator';

import {ValidationException} from '../exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any>{
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const obj = plainToClass(metadata.metatype, value); // get request body for validation
    const errors = await validate(obj); // array of errors after validations

    if (errors.length) {
      let messages = errors.map(err => {
        return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
      })
      throw new ValidationException(messages);
    }
    return value;
    }
  }