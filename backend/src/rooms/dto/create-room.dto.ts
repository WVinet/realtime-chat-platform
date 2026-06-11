import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

enum RoomType {
  MOVIE = 'MOVIE',
  GAME = 'GAME',
}

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  externalId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsEnum(RoomType)
  type!: RoomType;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
