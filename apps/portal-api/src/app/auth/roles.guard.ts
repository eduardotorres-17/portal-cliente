import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Se a rota não exige nenhum cargo específico, libera geral.
    }

    const { user } = context.switchToHttp().getRequest();
    // Verifica se o cargo do usuário está na lista de cargos permitidos da rota
    return requiredRoles.includes(user.role);
  }
}
