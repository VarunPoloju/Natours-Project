class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // ==========================================FILTER====================
  filter() {
    // 1A) FILTERING
    // console.log(req.query);
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // ======================================SORTING==================
  sort() {
    // if there is a sort in query of the url then this will execute
    // like if in url localhost:3000/api/v1/tours?sort=-price if u see like this it will sort price in
    // descending ordr , remoe minus it will be ascending order
    if (this.queryString.sort) {
      // if the price is same while sorting then u need to go for other criteria like ratingsAverage or whatever
      // localhost:3000/api/v1/tours?sort=-price,-ratingsAverage like this
      const sortBy = req.query.sort.split(',').join(' ');
      // console.log(sortBy);
      this.query = this.query.sort(sortBy);
    }
    // if user don't specify any kind of sort then this will execute
    else {
      this.query = this.query.sort('-CreatedAt');
    }
    return this;
  }

  limitFields() {
    // 3) FIELD LIMITING
    if (this.queryString.fields) {
      const fields = req.query.fields.split(',').join(' ');
      // it is selecting only particular fields like name,price etc --> it's called as projecting
      // ex:localhost:3000/api/v1/tours?fields=name,duration,price,difficulty
      this.query = this.query.select('name duration price difficulty');
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // 4) PAGINATION
    // page=2&limit=10  --> 1-10 page 1 ,, 11-20 page 2 ,, 21-30  page3
    // query = query.skip(10).limit(10);
    //skip(10) means it should skip 10 results in page 1 and show 10 rem 10 results i.e limit(10) means it should show 10  results for that page

    // setting default page as 1
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
