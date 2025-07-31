import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("projects")
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  @UseGuards(AuthGuard("jwt")) // Authenticated users only
  async create(
    @Body() data: { title: string; description?: string },
    @Req() req
  ) {
    return this.projectService.createProject(data, req.user.id);
  }

  @Get()
  async findAll() {
    return this.projectService.getProjects();
  }

  @Put(":id")
  @UseGuards(AuthGuard("jwt")) // Owner or admin only (checked in service)
  async update(
    @Param("id") id: string,
    @Body() data: { title?: string; description?: string },
    @Req() req
  ) {
    return this.projectService.updateProject(
      +id,
      data,
      req.user.id,
      req.user.role
    );
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt")) // Owner or admin only
  async delete(@Param("id") id: string, @Req() req) {
    return this.projectService.deleteProject(+id, req.user.id, req.user.role);
  }
}
