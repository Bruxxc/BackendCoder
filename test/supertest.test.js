import chai from "chai";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
const expect = chai.expect;
const requester= supertest('http://localhost:8080/');
let testProductId="";
let testCartId="";
describe("TESTING", ()=>{
    beforeEach(function(){
        this.timeout(5000);
    })
////////PRODUCTS
    describe("PRODUCTS", ()=>{

        it("GET", async () => {
            const response = await requester.get("api/products");
            const { statusCode, _body } = response;
            if (statusCode==500) {
              throw _body.error;
            }
            expect(statusCode).to.equal(200);
            expect(_body.payload).to.be.an.instanceof(Array);
        });

        it("CREATE_PRODUCT", async () => {
            const testProduct = {
                title: "TEST title",
                description: "TEST desc",
                category: "TEST",
                price: 100,
                thumbnail: "TEST",
                code: 7777,
                stock: 10,
            };
            const response = await requester.post("api/products").send(testProduct);
            const { statusCode, _body } = response;
            testProductId=_body.id;
            if (statusCode==500) {
                throw _body.error;
            }
            expect(statusCode).to.equal(201);
            expect(_body.status).to.equal("success");
        });

        it("GET_BY_ID", async () => {
            const response = await requester.get(`api/products/${testProductId}`);
            const { statusCode, _body } = response;
            if (statusCode==500) {
              throw _body.error;
            }
            expect(statusCode).to.equal(200);
            expect(_body.data).to.be.an.instanceof(Array);
        });

        it("UPDATE_PRODUCT", async () => {
            const testUpdate = {
                title: "TEST title 2",
                description: "TEST desc 2",
                category: "TEST 2",
                price: 200,
                thumbnail: "TEST 2",
                code: 8888,
                stock: 20,
            };
            const response = await requester.put(`api/products/${testProductId}`).send(testUpdate);
            const { statusCode, _body } = response;
            if (statusCode==500) {
                throw _body.error;
            }
            expect(statusCode).to.equal(200);
            expect(_body.status).to.equal("success");
        });

        it("DELETE_PRODUCT", async () => {
            const response = await requester.delete(`api/products/${testProductId}`);
            const { statusCode, _body } = response;
            if (statusCode==500) {
                throw _body.error;
            }
            expect(statusCode).to.equal(200);
            expect(_body.status).to.equal("success");
        });
    });
////////CARTS
    describe("CARTS", () => {
        it("GET", async () => {
            const response = await requester.get("api/carts");
            const { statusCode, _body } = response;
            if (statusCode==500) {
                throw _body.error;
            }
            expect(statusCode).to.equal(200);
            expect(_body.data).to.be.an.instanceof(Array);
        });

        it("CREATE_CART", async () => {
            const response = await requester.post("api/carts/");
            const { statusCode, _body } = response;
            if (statusCode==500) {
                throw _body.error;
            }
            testCartId=_body.id;
            expect(statusCode).to.equal(201);
            expect(_body.status).to.equal("success");
        });

        it("UPDATE_CART", async () => {
            const testUpdate = {products:["64d69311de8f8888cd9899e6","64fce1bb2b4575a464a1c5db"]};
            const response = await requester.put(`api/carts/${testCartId}`).send(testUpdate);
            const { statusCode, _body } = response;
            if (statusCode==500) {
                throw _body.error;
            }
            expect(statusCode).to.equal(200);
            expect(_body.status).to.equal("success");
        });

        it("EMPTY_CART", async ()=>{
            const response = await requester.delete(`api/carts/${testCartId}`);
            const { statusCode, _body } = response;
            if (statusCode==500) {
                throw _body.error;
            }
            expect(statusCode).to.equal(200);
            expect(_body.status).to.equal("success");
        });
    });
////////SESSIONS
    describe("SESSIONS", ()=>{
        const testUser = {
            email: faker.internet.email(),
            firstName: "NOMBRE",
            lastName: "APELLIDO",
            userName: faker.internet.userName(),
            age: 100,
            password: "TESTING",
        };
        let cookieName="";
        let cookieValue="";
        it("REGISTER", async () => {
            const response = await requester.post("views/sessions/register").send(testUser);
            const { statusCode, _body } = response;
            if (statusCode==500) {
                throw _body.error;
            }
            expect(statusCode).to.equal(201);
            expect(_body.status).to.equal("success");
        });

        it("LOGIN", async ()=>{
            const response = await requester.post("views/sessions/login").send({email: testUser.email,password: testUser.password});
            const cookie = response.headers["set-cookie"][0];
            expect(cookie).to.be.ok;
            console.log("COOKIE:",cookie);
            cookieName = cookie.split("=")[0];
            cookieValue = cookie.split("=")[1];
            expect(cookieName).to.be.ok.and.eql("connect.sid");
            expect(cookieValue).to.be.ok;
        });
    });
})