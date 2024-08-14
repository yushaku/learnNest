import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class Pagination {
  @ApiProperty()
  @IsOptional()
  page: number = 1

  @ApiProperty()
  @IsOptional()
  perPage: number = 20
}

export class LoginDTO {
  @ApiProperty({ required: true })
  @IsString()
  email: string

  @ApiProperty({ required: true })
  @IsString()
  password: string
}

export class RegisterDTO extends LoginDTO {
  @ApiProperty({ required: true })
  @IsString()
  inviteCode: string
}
