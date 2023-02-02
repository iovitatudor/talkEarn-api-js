import { IsNotEmpty } from 'class-validator';

export class ParameterCreateBulkDto {
  @IsNotEmpty()
  langId: number;

  @IsNotEmpty()
  parameters: Array<any>;
}
