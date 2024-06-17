import { IJwtPayload } from "src/authentication/interfaces/jwt-payload.interface";
import { Request } from "@nestjs/common";

export interface AuthenticatedRequest extends Request {
     user: IJwtPayload;
};