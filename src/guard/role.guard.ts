
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
@Injectable()
export class RoleGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest<Request>()
      const user = (request as any).user
      if(!user){
        throw new UnauthorizedException('Unauthorized')
      }
      if(user.role !== 'admin'){
        throw new ForbiddenException('Forbidden')
      }
      return true
    }

}