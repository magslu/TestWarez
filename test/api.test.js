import { expect, use } from "chai";
import pkg from "pactum";
const { spec } = pkg;
import "dotenv/config";
import { baseUrl, userID, user, password } from "../helpers/data.js";

let token_response; // let - zmienna, którą można nadpisać
describe("Api tests", () => {
  it.skip("get request", async () => {
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
  it.skip("Create a user", async () => {
    // it.skip() - można użyć aby pominąć wykonywanie bloku
    const response = await spec()
      .post(`${baseUrl}/Account/v1/User`)
      .withBody({
        userName: user,
        password: password,
      })
      .inspect();
    expect(response.statusCode).to.eql(201);
  });
  // generowanie tokenu
  it.only("Generate token", async () => {
    const response = await spec()
      .post(`${baseUrl}/Account/v1/GenerateToken`)
      .withBody({
        userName: user,
        password: password,
      })
      .inspect();
    token_response = response.body.token;
    console.log(token_response);
    expect(response.statusCode).to.eql(200);
    expect(response.body.result).to.eql("User authorized successfully.");
  });

  it("check token", async () => {
    console.log("another it back " + token_response);
  });
  // dodanie książki z obecnej bazy książek
  it.only("Add a book", async () => {
    const response = await spec()
      .post(`${baseUrl}/BookStore/v1/Books`)
      .withBearerToken(token_response)
      .withBody({
        userId: userID,
        collectionOfIsbns: [{ isbn: "9781449331818" }],
      })
      .inspect();
    expect(response.statusCode).to.eql(201);
  });

  it.only("Check books in user", async () => {
    const response = await spec()
      .get(`${baseUrl}/Account/v1/User/${userID}`)
      .inspect()
      .withBearerToken(token_response);
    expect(response.statusCode).to.eql(200);
    expect(response.body.books[0].title).to.eql("Learning JavaScript Design Patterns");
  });

  it.only("Delete all books", async () => {
    const response = await spec()
      .delete(`${baseUrl}/BookStore/v1/Books?UserId=${userID}`)
      .withBearerToken(token_response)
      .withBody({
        isbn: "9781449331818",
        userId: userID,
      })
      .inspect();
    expect(response.statusCode).to.eql(204);
  });

  it.only("Check books in user", async () => {
    const response = await spec()
      .get(`${baseUrl}/Account/v1/User/${userID}`)
      .inspect()
      .withBearerToken(token_response);
    expect(response.statusCode).to.eql(200);
    expect(response.body.books).to.eql([]);
  });
});
