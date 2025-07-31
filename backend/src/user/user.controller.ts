import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Role } from "@prisma/client";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(
    @Body() data: { name: string; email: string; password: string; role?: Role }
  ) {
    return this.userService.createUser(data);
  }

  @Get()
  async findAll() {
    return this.userService.getUsers();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.userService.getUserById(+id);
  }

  @Put(":id")
  @UseGuards(AuthGuard("jwt")) 
  async update(
    @Param("id") id: string,
    @Body()
    data: { name?: string; email?: string; password?: string; role?: Role },
    @Req() req
  ) {
    return this.userService.updateUser(+id, data, req.user?.id, req.user?.role);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt")) 
  async delete(@Param("id") id: string, @Req() req) {
    return this.userService.deleteUser(+id, req.user?.role);
  }
}
