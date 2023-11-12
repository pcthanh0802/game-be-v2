import { IsNotEmpty, IsString } from 'class-validator';

export class UploadGameDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  fileExtension: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  contentType: string;
}
