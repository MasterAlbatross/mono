const request = require("supertest");
const app = require("../server");
const User = require("../models/user");
const AccessToken = require("../models/accessToken");
const usernameVerification = require("../models/usernameVerification");
const { userOne1, setupDatabase, userTwo2 } = require("./fixtures/userDB");

beforeAll(setupDatabase);

afterAll(async () => {
  await AccessToken.deleteMany();
});

test("Should register a new user", async () => {
  const response = await request(app)
    .post("/register")
    .send({
      email: "tamimhassan506@gmail.com",
      password: "12345678",
      firstName: "tamim",
      lastName: "hassan",
      userType: "rider",
      isActive: true,
    })
    .expect(201);
  // Assert that the database was changed correctly
  const user = await User.findById(response.body.id);
  expect(user).not.toBeNull();
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/login")
    .send({
      username: userTwo2.email,
      password: userTwo2.password,
      client_id: "abcd",
      client_secret: userTwo2.password,
      grant_type: "password",
    })
    .expect(200);
  const accessToken2 = await AccessToken.findOne({ UserId: userTwo2._id });
  expect(accessToken2).not.toBeNull();
});

test("Should not login existing user", async () => {
  const response = await request(app)
    .post("/login")
    .send({
      username: userOne1.email,
      password: "notPassword",
      client_id: "abcd",
      client_secret: userOne1.password,
      grant_type: "password",
    })
    .expect(400);
});

test("Should get all for user for admin user", async () => {
  const accessToken = await AccessToken.findOne({ UserId: userTwo2._id });
  const user = await User.findById(userTwo2._id);
  console.log(user);
  await request(app)
    .get("/users")
    .set("Authorization", `Bearer ${accessToken.accessToken}`)
    .send()
    .expect(200);
});

test("Should create admin or driver for admin user", async () => {
  const accessToken = await AccessToken.findOne({ UserId: userTwo2._id });
  await request(app)
    .post("/users")
    .set("Authorization", `Bearer ${accessToken.accessToken}`)
    .send({
      email: "tamimhassan@gmail.com",
      password: "12345678",
      firstName: "tamim",
      lastName: "hassan",
      userType: "admin",
      isActive: true,
    })
    .expect(201);
});

//First login then we can get accessToken
test("Should update password for user", async () => {
  const accessToken = await AccessToken.findOne({ UserId: userTwo2._id });
  await request(app)
    .patch("/users/update-password")
    .set("Authorization", `Bearer ${accessToken.accessToken}`)
    .send({
      _id: userTwo2._id,
      currentPassword: "12345678",
      newPassword: "123456789",
    })
    .expect(200);
});

test("Should update profile for user", async () => {
  const accessToken = await AccessToken.findOne({ UserId: userTwo2._id });
  await request(app)
    .patch("/users/update-profile")
    .set("Authorization", `Bearer ${accessToken.accessToken}`)
    .send({
      _id: userTwo2._id,
      firstName: "Tamim1",
      lastName: "hassan1",
    })
    .expect(200);
});

test("Should recover password", async () => {
  const response = await request(app)
    .post("/password-recovery-request")
    .send({
      username: userOne1.email,
    })
    .expect(200);
  const userVerification = await usernameVerification.findById(
    response.body.verificationId
  );
  await request(app)
    .post("/password-recovery-verify")
    .send({
      verificationId: userVerification._id,
      password: "asdasdasd",
      verificationCode: userVerification.verificationCode,
    })
    .expect(200);
});

test("Should verify user", async () => {
  const accessToken = await AccessToken.findOne({ UserId: userTwo2._id });
  const response = await request(app)
    .post("/users/username-verification-request")
    .set("Authorization", `Bearer ${accessToken.accessToken}`)
    .send({})
    .expect(200);
  const userVerification = await usernameVerification.findById(
    response.body.verificationId
  );
  await request(app)
    .post("/username-verify")
    .send({
      verificationId: userVerification._id,
      verificationCode: userVerification.verificationCode,
    })
    .expect(200);
});
