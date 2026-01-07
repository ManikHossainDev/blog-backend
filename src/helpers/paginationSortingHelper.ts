import { SortOrder } from './../../generated/prisma/internal/prismaNamespaceBrowser';
type IOptions = {
  page?: number | undefined;
  limit?: number | undefined;
  SortOrder?: string;
 sortBy?: string;
}

const paginationSortingHelper = (options: IOptions) => {
   console.log(options)
   return options;
}
export default paginationSortingHelper;