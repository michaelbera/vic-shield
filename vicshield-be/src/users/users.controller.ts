import { Controller, Body, Patch, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('kyc')
  create(@Body() createUserDto: { address: string; fileHash: string }) {
    return this.usersService.kyc(createUserDto);
  }

  @Get(':address')
  getUser(@Param('address') address: string) {
    return this.usersService.getUser(address);
  }
}
