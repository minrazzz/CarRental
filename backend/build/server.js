var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// server.js
var import_dotenv3 = __toESM(require("../node_modules/dotenv/lib/main.js"));

// src/app.js
var import_cors = __toESM(require("../node_modules/cors/lib/index.js"));
var import_express5 = __toESM(require("../node_modules/express/index.js"));
var import_morgan = __toESM(require("../node_modules/morgan/index.js"));

// src/controllers/booking.controller.js
var import_dayjs = __toESM(require("../node_modules/dayjs/dayjs.min.js"));
var import_localizedFormat = __toESM(require("../node_modules/dayjs/plugin/localizedFormat.js"));
var import_express_async_handler = __toESM(require("../node_modules/express-async-handler/index.js"));
var import_http_errors = __toESM(require("../node_modules/http-errors/index.js"));
var import_http_status_codes = require("../node_modules/http-status-codes/build/cjs/index.js");
var import_stripe = __toESM(require("../node_modules/stripe/lib/stripe.js"));

// src/models/booking.model.js
var import_mongoose = require("../node_modules/mongoose/index.js");
var bookingSchema = new import_mongoose.Schema({
  user: {
    type: import_mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  car: {
    type: import_mongoose.Schema.Types.ObjectId,
    ref: "Car"
  },
  totalPrice: Number,
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ["booked", "cancelled"],
    default: "booked"
  },
  pickupLocation: {
    lng: Number,
    lat: Number
  },
  dropoffLocation: {
    lng: Number,
    lat: Number
  }
}, { timestamps: true });
bookingSchema.pre(/^find/, function(next) {
  this.populate({ path: "user", select: "-password" });
  this.populate("car");
  next();
});
var BookingModel = (0, import_mongoose.model)("Booking", bookingSchema);

// src/models/car.model.js
var import_mongoose2 = require("../node_modules/mongoose/index.js");
var import_url_minify = __toESM(require("../node_modules/url-minify/dist/lib.min.js"));
var carSchema = new import_mongoose2.Schema({
  name: String,
  image: String,
  description: String,
  model: String,
  numberOfSeats: Number,
  price: Number,
  isBooked: {
    type: Boolean,
    default: false
  },
  bookedFrom: Date,
  bookedUntill: Date
});
carSchema.pre("save", async function(next) {
  const { shortUrl } = await (0, import_url_minify.default)(this.image, { provider: "tinyurl" });
  this.image = shortUrl;
  next();
});
var CarModel = (0, import_mongoose2.model)("Car", carSchema);

// src/models/transaction.model.js
var import_mongoose3 = require("../node_modules/mongoose/index.js");
var transactionSchema = new import_mongoose3.Schema({
  id: String,
  currency: String,
  customer_email: String,
  amount_total: Number,
  payment_status: String
});
var transactionModel = (0, import_mongoose3.model)("Transaction", transactionSchema);

// src/models/user.model.js
var import_bcryptjs = require("../node_modules/bcryptjs/index.js");
var import_mongoose4 = require("../node_modules/mongoose/index.js");
var userSchema = new import_mongoose4.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    lowercase: true,
    index: { unique: true, sparse: true }
  },
  phoneNumber: String,
  password: {
    type: String,
    select: false
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  resetPasswordToken: {
    type: String
  }
});
userSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    const hashedPassword = await (0, import_bcryptjs.hash)(this.password, 12);
    this.password = hashedPassword;
  }
  next();
});
userSchema.methods.isValidPassword = async function(password) {
  return (0, import_bcryptjs.compare)(password, this.password);
};
var UserModel = (0, import_mongoose4.model)("User", userSchema);

// src/controllers/booking.controller.js
import_dayjs.default.extend(import_localizedFormat.default);
var stripeInstance = () => new import_stripe.default(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27"
});
var isCarAvailableForBooking = (car, startDate) => {
  if (car.isBooked) {
    return new Date(startDate) > new Date(car.bookedUntill);
  }
  return true;
};
var findAll = (0, import_express_async_handler.default)(async (req, res, next) => {
  const bookings = await BookingModel.find({ user: req.user._id });
  res.json(bookings);
});
var cancelBooking = (0, import_express_async_handler.default)(async (req, res, next) => {
  const { bookingId } = req.params;
  const booking = await BookingModel.findById(bookingId);
  if (!booking)
    return next((0, import_http_errors.default)(import_http_status_codes.StatusCodes.NOT_FOUND, "Booking not found"));
  const car = await CarModel.findById(booking.car._id);
  if (!car)
    return next((0, import_http_errors.default)(import_http_status_codes.StatusCodes.NOT_FOUND, "Car not found"));
  booking.status = "cancelled";
  car.isBooked = false;
  car.bookedFrom = null;
  car.bookedUntill = null;
  await Promise.all([booking.save(), car.save()]);
  res.json({ message: "Booking cancelled" });
});
var getCheckoutSession = (0, import_express_async_handler.default)(async (req, res, next) => {
  const car = await CarModel.findById(req.params.carId);
  if (!isCarAvailableForBooking(car, req.body.startDate)) {
    return next((0, import_http_errors.default)(import_http_status_codes.StatusCodes.BAD_REQUEST, `Car is unavailable for booking from ${(0, import_dayjs.default)(car.bookedFrom).format("LL")} to ${(0, import_dayjs.default)(car.bookedUntill).format("LL")}`));
  }
  if (!car)
    return next((0, import_http_errors.default)(import_http_status_codes.StatusCodes.NOT_FOUND, "The car you are trying to book does not exist"));
  const checkoutSession = await stripeInstance().checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `http://localhost:3000/profile?success=true&carName=${car.name}`,
    cancel_url: `http://localhost:3000/cars/${req.params.carId}`,
    customer_email: req.user.email,
    client_reference_id: req.params.carId,
    metadata: {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      pickupLocation: JSON.stringify(req.body.pickupLocation),
      dropoffLocation: JSON.stringify(req.body.dropoffLocation)
    },
    line_items: [
      {
        name: car.name,
        description: car.description,
        amount: car.price * 100,
        currency: "usd",
        quantity: 1,
        images: [car.image]
      }
    ]
  });
  res.json(checkoutSession);
});
var webhooks = (0, import_express_async_handler.default)(async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  const event = stripeInstance().webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const carId = session.client_reference_id;
    const user = await UserModel.findOne({ email: session.customer_email });
    const totalPrice = session.amount_total / 100;
    const { startDate, endDate } = session.metadata;
    const pickupLocation = JSON.parse(session.metadata.pickupLocation);
    const dropoffLocation = JSON.parse(session.metadata.dropoffLocation);
    await transactionModel.create(session);
    const car = await CarModel.findById(carId);
    car.isBooked = true;
    car.bookedFrom = startDate;
    car.bookedUntill = endDate;
    await car.save();
    await BookingModel.create({
      car: carId,
      user: user._id,
      totalPrice,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation
    });
    res.status(import_http_status_codes.StatusCodes.OK).end();
  }
});

// src/middlewares/global-error-handler.js
var globalErrorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong";
  res.status(statusCode).json({ message });
};

// src/routes/booking.routes.js
var import_express = require("../node_modules/express/index.js");

// src/middlewares/authenticated.js
var import_express_async_handler2 = __toESM(require("../node_modules/express-async-handler/index.js"));
var import_http_errors2 = __toESM(require("../node_modules/http-errors/index.js"));
var import_http_status_codes2 = require("../node_modules/http-status-codes/build/cjs/index.js");

// src/utils/jwt-service.js
var import_jsonwebtoken = __toESM(require("../node_modules/jsonwebtoken/index.js"));
var JwtService = class {
  signToken(id) {
    return import_jsonwebtoken.default.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  }
  verifyToken(token) {
    return import_jsonwebtoken.default.verify(token, process.env.JWT_SECRET);
  }
};
var jwtService = new JwtService();

// src/middlewares/authenticated.js
var authenticated = (0, import_express_async_handler2.default)(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader && authorizationHeader.startsWith("Bearer")) {
    const [, token] = authorizationHeader.split(" ");
    const { id } = jwtService.verifyToken(token);
    const user = await UserModel.findById(id);
    if (!user)
      return next((0, import_http_errors2.default)(import_http_status_codes2.StatusCodes.UNAUTHORIZED, 'User doesn"t exist or has been deleted'));
    req.user = user;
    return next();
  }
  return res.json({ message: "Not authenticated" });
});

// src/routes/booking.routes.js
var bookingRouter = (0, import_express.Router)();
bookingRouter.get("/", authenticated, findAll);
bookingRouter.post("/checkout-session/:carId", authenticated, getCheckoutSession);
bookingRouter.get("/cancel/:bookingId", authenticated, cancelBooking);

// src/routes/car.routes.js
var import_express2 = require("../node_modules/express/index.js");

// src/controllers/car.controller.js
var import_express_async_handler3 = __toESM(require("../node_modules/express-async-handler/index.js"));
var import_http_errors3 = __toESM(require("../node_modules/http-errors/index.js"));
var import_http_status_codes3 = require("../node_modules/http-status-codes/build/cjs/index.js");
var addCar = (0, import_express_async_handler3.default)(async (req, res) => {
  const car = await CarModel.create(req.body);
  res.status(import_http_status_codes3.StatusCodes.CREATED).json(car);
});
var findAll2 = (0, import_express_async_handler3.default)(async (req, res, next) => {
  const cars = await CarModel.find();
  res.json(cars);
});
var findOneById = (0, import_express_async_handler3.default)(async (req, res, next) => {
  const car = await CarModel.findById(req.params.id);
  res.json(car);
});
var updateCar = (0, import_express_async_handler3.default)(async (req, res, next) => {
  const { name, model: model5, numberOfSeats, price, image, description } = req.body;
  const car = await CarModel.findByIdAndUpdate(req.params.id);
  if (!car)
    return next((0, import_http_errors3.default)(import_http_status_codes3.StatusCodes.NOT_FOUND, "Car not found"));
  if (name)
    car.name = name;
  if (model5)
    car.model = model5;
  if (numberOfSeats)
    car.numberOfSeats = numberOfSeats;
  if (price)
    car.price = price;
  if (image)
    car.image = image;
  if (description)
    car.description = description;
  await car.save();
  res.status(import_http_status_codes3.StatusCodes.OK).send("Car information updated successfully");
});
var deleteCar = (0, import_express_async_handler3.default)(async (req, res, next) => {
  await CarModel.findByIdAndDelete(req.params.id);
  res.status(import_http_status_codes3.StatusCodes.OK).send("Car deleted successfully");
});

// src/middlewares/admin-only.js
var import_http_status_codes4 = require("../node_modules/http-status-codes/build/cjs/index.js");
var adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(import_http_status_codes4.StatusCodes.UNAUTHORIZED).send({ message: "You are not authorized to make this request" });
  }
  next();
};

// src/routes/car.routes.js
var carRouter = (0, import_express2.Router)();
carRouter.get("/", findAll2);
carRouter.get("/:id", findOneById);
carRouter.use(authenticated, adminOnly);
carRouter.post("/", addCar);
carRouter.patch("/:id", updateCar);
carRouter.delete("/:id", deleteCar);

// src/routes/transaction.routes.js
var import_express3 = require("../node_modules/express/index.js");

// src/controllers/transaction.controller.js
var import_express_async_handler4 = __toESM(require("../node_modules/express-async-handler/index.js"));
var findAll3 = (0, import_express_async_handler4.default)(async (req, res, next) => {
  const transactions = await transactionModel.find();
  res.json(transactions);
});

// src/routes/transaction.routes.js
var transactionRouter = (0, import_express3.Router)();
transactionRouter.use(authenticated, adminOnly);
transactionRouter.get("/", findAll3);
var transaction_routes_default = transactionRouter;

// src/routes/user.routes.js
var import_express4 = require("../node_modules/express/index.js");

// src/controllers/auth.controller.js
var import_bcryptjs2 = require("../node_modules/bcryptjs/index.js");
var import_crypto = require("crypto");
var import_express_async_handler5 = __toESM(require("../node_modules/express-async-handler/index.js"));
var import_http_errors4 = __toESM(require("../node_modules/http-errors/index.js"));
var import_http_status_codes5 = require("../node_modules/http-status-codes/build/cjs/index.js");

// src/utils/email.js
var import_dotenv = __toESM(require("../node_modules/dotenv/lib/main.js"));
var import_html_to_text = require("../node_modules/html-to-text/index.js");
var import_nodemailer = __toESM(require("../node_modules/nodemailer/lib/nodemailer.js"));
var import_path = require("path");
var import_pug = require("../node_modules/pug/lib/index.js");
import_dotenv.default.config({ path: (0, import_path.join)(process.cwd(), ".env") });
var Email = class {
  constructor(user, url) {
    this.url = url;
    this.to = user.email;
    this.from = `Sushovan Rental Service <${process.env.EMAIL_FROM}>`;
    this.firstName = user.firstName;
  }
  createTransport() {
    return import_nodemailer.default.createTransport({
      service: "SendGrid",
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
  }
  async send(templatePath, subject) {
    const html = (0, import_pug.renderFile)((0, import_path.join)(process.cwd(), `src/views/${templatePath}`), {
      firstName: this.firstName,
      from: this.from,
      to: this.to,
      url: this.url,
      subject
    });
    try {
      await this.createTransport().sendMail({
        to: this.to,
        from: this.from,
        subject,
        text: (0, import_html_to_text.htmlToText)(html),
        html
      });
    } catch (error) {
      throw new Error(error.response);
    }
  }
  async forgotPassword() {
    await this.send("email/forgotPassword.pug", "Password Reset");
  }
};

// src/controllers/auth.controller.js
var signup = (0, import_express_async_handler5.default)(async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, password, role } = req.body;
  const user = await UserModel.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    role
  });
  const accessToken = jwtService.signToken(user._id);
  res.status(import_http_status_codes5.StatusCodes.CREATED).json({ accessToken });
});
var login = (0, import_express_async_handler5.default)(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email }).select("+password");
  if (user && await user.isValidPassword(password)) {
    return res.status(import_http_status_codes5.StatusCodes.OK).json({ accessToken: jwtService.signToken(user._id) });
  }
  res.status(import_http_status_codes5.StatusCodes.UNAUTHORIZED).json({ message: "Invalid email or password" });
});
var requestPasswordReset = (0, import_express_async_handler5.default)(async (req, res, next) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user)
    return next((0, import_http_errors4.default)(import_http_status_codes5.StatusCodes.NOT_FOUND, "User with this email does not exist"));
  if (user.resetPasswordToken)
    return next((0, import_http_errors4.default)(import_http_status_codes5.StatusCodes.BAD_REQUEST, "Password reset request already sent"));
  const passwordResetToken = (0, import_crypto.randomUUID)();
  user.resetPasswordToken = passwordResetToken;
  await user.save({ validateModifiedOnly: true });
  const emailTransport = new Email(user, `http://localhost:3000/reset-password?token=${passwordResetToken}`);
  await emailTransport.forgotPassword();
  res.status(import_http_status_codes5.StatusCodes.OK).json({ message: "Please check your email for password reset link" });
});
var resetPassword = (0, import_express_async_handler5.default)(async (req, res, next) => {
  const { password } = req.body;
  const { resetPasswordToken } = req.params;
  const user = await UserModel.findOne({ resetPasswordToken }).select("+password");
  if (!user)
    return next((0, import_http_errors4.default)(import_http_status_codes5.StatusCodes.NOT_FOUND, "Invalid password reset token"));
  if (await (0, import_bcryptjs2.compare)(password, user.password)) {
    return next((0, import_http_errors4.default)(import_http_status_codes5.StatusCodes.BAD_REQUEST, "New password cannot be same as old password"));
  }
  user.password = password;
  user.resetPasswordToken = void 0;
  await user.save({ validateModifiedOnly: true });
  res.status(import_http_status_codes5.StatusCodes.OK).json({ message: "Password reset successfully" });
});

// src/controllers/user.controller.js
var import_express_async_handler6 = __toESM(require("../node_modules/express-async-handler/index.js"));
var import_http_errors5 = __toESM(require("../node_modules/http-errors/index.js"));
var import_http_status_codes6 = require("../node_modules/http-status-codes/build/cjs/index.js");
var profile = (0, import_express_async_handler6.default)(async (req, res, next) => {
  return res.json(req.user);
});
var updateProfile = (0, import_express_async_handler6.default)(async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber } = req.body;
  const user = await UserModel.findById(req.user._id);
  if (!user)
    return next((0, import_http_errors5.default)(import_http_status_codes6.StatusCodes.UNAUTHORIZED, "User not found"));
  if (firstName && firstName !== user.firstName)
    user.firstName = firstName;
  if (lastName && lastName !== user.lastName)
    user.lastName = lastName;
  if (email && email !== user.email)
    user.email = email;
  if (phoneNumber && phoneNumber !== user.phoneNumber)
    user.phoneNumber = phoneNumber;
  await user.save();
  return res.json(user);
});
var findAll4 = (0, import_express_async_handler6.default)(async (req, res, next) => {
  const users = await UserModel.find();
  res.json(users);
});
var deleteUser = (0, import_express_async_handler6.default)(async (req, res, next) => {
  const { id } = req.params;
  await UserModel.findByIdAndDelete(id);
  res.status(import_http_status_codes6.StatusCodes.OK).send(`User with id ${id} deleted`);
});
var updateUser = (0, import_express_async_handler6.default)(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(import_http_status_codes6.StatusCodes.OK).send(`User with id ${req.params.id} updated`);
});

// src/routes/user.routes.js
var userRouter = (0, import_express4.Router)();
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/request-password-reset", requestPasswordReset);
userRouter.post("/reset-password/:resetPasswordToken", resetPassword);
userRouter.use(authenticated);
userRouter.get("/profile", profile);
userRouter.post("/profile", updateProfile);
userRouter.use(adminOnly);
userRouter.get("/", findAll4);
userRouter.delete("/:id", deleteUser);
userRouter.patch("/:id", updateUser);

// src/app.js
var app = (0, import_express5.default)();
app.use((0, import_cors.default)({
  origin: ["http://localhost:3000"],
  credentials: true
}));
app.post("/api/bookings/webhooks", import_express5.default.raw({ type: "*/*" }), webhooks);
app.use(import_express5.default.json());
if (process.env.NODE_ENV === "development") {
  app.use((0, import_morgan.default)("dev"));
}
app.use("/api/users", userRouter);
app.use("/api/cars", carRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/transactions", transaction_routes_default);
app.use(globalErrorHandler);

// src/utils/db-connect.js
var import_dotenv2 = __toESM(require("../node_modules/dotenv/lib/main.js"));
var import_mongoose5 = __toESM(require("../node_modules/mongoose/index.js"));
import_dotenv2.default.config();
var dbConnect = async () => {
  try {
    await import_mongoose5.default.connect(process.env.MONGODB_URI, {
      dbName: "car-rental"
    });
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.log(error.message);
  }
};

// server.js
var PORT = process.env.PORT || 4e3;
app.listen(PORT, () => {
  import_dotenv3.default.config();
  dbConnect();
  console.log(`Server is running on port ${PORT}`);
});
