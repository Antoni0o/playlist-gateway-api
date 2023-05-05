// import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
// import { ApiResponse, ApiTags } from '@nestjs/swagger';
// import { CreateUserService } from './create-user.service';
// import { UserResponseDto } from '../dto/user-response.dto';
// import { BadRequestSwaggerReturn } from 'src/common/helpers/swagger/bad-request.swagger.error';
// import { InternalServerErrorSwaggerReturn } from 'src/common/helpers/swagger/internal-server.swagger.error';
// import { NotFoundSwaggerReturn } from 'src/common/helpers/swagger/not-found.swagger.error';
// import { CreateUserDto } from '../dto/create-user.dto';

// @Controller('users/create')
// @ApiTags('users')
// export class CreateUserController {
//   constructor(private readonly service: CreateUserService) {}

//   @ApiResponse({
//     status: 200,
//     description: 'User created successfully',
//     type: UserResponseDto,
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Cannot create User. Invalid Params',
//     type: BadRequestSwaggerReturn,
//   })
//   @ApiResponse({
//     status: 500,
//     description: 'Cannot create User. Internal Server Error',
//     type: InternalServerErrorSwaggerReturn,
//   })
//   @Post()
//   @HttpCode(HttpStatus.CREATED)
//   async create(@Body() createUserData: CreateUserDto) {
//     // to-do
//   }

//   @ApiResponse({
//     status: 200,
//     description: 'User created successfully',
//     type: UserResponseDto,
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Cannot validate User. Invalid Params',
//     type: BadRequestSwaggerReturn,
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Cannot validate User. Not Found',
//     type: NotFoundSwaggerReturn,
//   })
//   @ApiResponse({
//     status: 500,
//     description: 'Cannot validate User. Internal Server Error',
//     type: InternalServerErrorSwaggerReturn,
//   })
//   @Post()
//   @HttpCode(HttpStatus.OK)
//   async validate() {
//     // to-do
//   }
// }
