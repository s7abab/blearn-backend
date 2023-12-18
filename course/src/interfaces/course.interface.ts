interface ICourseFilters {
    page: number;
    priceFilter?: 'low' | 'high' | undefined;
    sortByEnrollments?: boolean;
    searchKeyword:string
  }