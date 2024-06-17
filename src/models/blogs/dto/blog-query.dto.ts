import { ApiProperty } from "@nestjs/swagger";

export class BlogsQuery {
            @ApiProperty({
                        description: '每页条数',
                        default: 10,
                        required: false
            })
            pageSize: number
            
            @ApiProperty({
                        description: '当前页码',
                        default: 1,
                        required: false
            })
            pageNo: number

            @ApiProperty({
                        description: '排序字段',
                        example: 'createAt',
                        default: 'createAt',
                        required: false
            })
            sortField: string
            
            @ApiProperty({
                        description: '排序方式',
                        example: 'descend',
                        default: 'descend',
                        required: false
            })
            sortOrder: string
};