import { IsNotEmpty, IsString } from 'class-validator';

export class UploadGameDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  gameExtension: string;

  @IsString()
  @IsNotEmpty()
  gameContentType: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  thumbnailExtension: string;

  @IsString()
  @IsNotEmpty()
  thumbnailContentType: string;

  @IsString()
  @IsNotEmpty()
  devId: number;
}
