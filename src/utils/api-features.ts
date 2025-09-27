import { Document, Query } from "mongoose";
export class APIFeatures<T extends Document> {
  constructor(
    public query: Query<T[], T>,
    public queryString: Record<string, any>,
  ) {}
  filter() {
    // 1. filtering
    const excludedFilters = ["page", "sort", "limit", "fields"];
    const filters = Object.fromEntries(
      Object.entries(this.queryString).filter(
        ([key]) => !excludedFilters.includes(key),
      ),
    );
    let filterStr = JSON.stringify(filters);
    filterStr = filterStr.replace(/\b(gte|gt|lte|lt)\b/g, (m) => `$${m}`);
    const mongoFilters = JSON.parse(filterStr);
    this.query = this.query.find(mongoFilters);
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = (this.queryString.sort as string).split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const selectedFields = (this.queryString.fields as string)
        .split(",")
        .join(" ");
      this.query = this.query.select(selectedFields).select("-__v");
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  paginate() {
    const pageNum = +this.queryString.page || 1;
    const limitNum = +this.queryString.limit || 10;
    const skip = (pageNum - 1) * limitNum;
    if (pageNum !== -1) this.query = this.query.skip(skip).limit(limitNum);
    return this;
  }
}
