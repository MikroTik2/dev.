import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

import { IPagination } from "@/common/interfaces/pagination.interface";

export const Pagination = createParamDecorator((data, ctx: ExecutionContext): IPagination => {
            const req: Request = ctx.switchToHttp().getRequest();

            const params: IPagination = {
                        skip: 0,
                        limit: 10,
                        sort: [],
            };

            params.skip = req.query.skip ? parseInt(req.query.skip.toString(), 10) : 0;
            params.limit = req.query.limit ? parseInt(req.query.limit.toString(), 10) : 10;

            if (req.query.sort) {
                        const sortBy = typeof req.query.sort === 'string' ? [req.query.sort] : (req.query.sort as string[]);

                        params.sort = sortBy.map((item: string) => {
                                    const [field, order] = item.split(':');
                                    
                                    return {
                                                field: field.trim(),
                                                by: order.trim().toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
                                    };
                        });
            };

            return params;
});
