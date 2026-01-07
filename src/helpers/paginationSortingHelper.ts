import { SortOrder } from './../../generated/prisma/internal/prismaNamespaceBrowser';
type IOptions = {
  page?: number | undefined;
  limit?: number | undefined;
  SortOrder?: string;
 sortBy?: string;
}

type IOptionsResult = {
  page: number;
  limit: number;
    skip: number;   
    sortBy: string;
    sortOrder: string;
}

const paginationSortingHelper = (options: IOptions): IOptionsResult => {
   const page:number =  Number(options.page) || 1;
   const limit:number =  Number(options.limit) || 10;
   const skip:number = (page - 1) * limit;
 
   const sortBy:string = options.sortBy || "createdAt";
   const sortOrder: string = options.SortOrder || "desc";

   return { page, limit, skip, sortBy, sortOrder };
}
export default paginationSortingHelper;