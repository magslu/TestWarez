import { expect } from "chai";
import pkg from "pactum";
const { spec } = pkg;
import "dotenv/config";
import { baseUrl, userID } from "../helpers/data.js";

describe("Api tests", () => {
  it("get request", async () => {
    const response = await spec()
      .get(`${baseUrl}/BookStore/v1/Books`)
      .inspect();
    const responseB = JSON.stringify(response.body);
    console.log("is dotenv work ?" + " " + process.env.SECRET_PASSWORD); 
    expect(response.statusCode).to.eql(200);
    expect(responseB).to.include("Learning JavaScript Design Patterns"); // include - zawiera
    expect(response.body.books[1].title).to.eql(
      "Learning JavaScript Design Patterns"
    );
    expect(response.body.books[4].author).to.eql("Kyle Simpson"); // eql - porównanie czy
  });
// tworzenie użytkownika
  it.skip("Create a user", async () => { // it.skip() - można użyć aby pominąć wykonywanie bloku
    const response = await spec()
      .post(`${baseUrl}/Account/v1/User`)
      .withBody({
        userName: "user_magda",
        password: process.env.SECRET_PASSWORD,
      })
      .inspect();
    expect(response.statusCode).to.eql(201);
    // userId a62d9719-4f37-437c-a582-a5a7db364f18
  });
});
