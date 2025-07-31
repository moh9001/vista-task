import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Role } from "@prisma/client";

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async createProject(
    data: { title: string; description?: string },
    userId: number
  ) {
    return this.prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        ownerId: userId,
      },
    });
  }

  async getProjects() {
    return this.prisma.project.findMany({
      include: { owner: { select: { id: true, name: true } } }, 
    });
  }

  async getProjectById(id: number) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException("Project not found");
    return project;
  }

  async updateProject(
    id: number,
    data: { title?: string; description?: string },
    userId: number,
    userRole: Role
  ) {
    const project = await this.getProjectById(id);
    if (project.ownerId !== userId && userRole !== Role.ADMIN)
      throw new ForbiddenException("Unauthorized to update this project");
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async deleteProject(id: number, userId: number, userRole: Role) {
    const project = await this.getProjectById(id);
    if (project.ownerId !== userId && userRole !== Role.ADMIN)
      throw new ForbiddenException("Unauthorized to delete this project");
    return this.prisma.project.delete({ where: { id } });
  }
}
