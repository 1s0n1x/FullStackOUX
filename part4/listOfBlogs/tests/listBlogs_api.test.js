const { test, after } = require(`node:test`);
const assert = require(`node:assert`);
const mongoose = require(`mongoose`);
const supertest = require(`supertest`);

const app = require(`../app`);


const api = supertest(app);

test('Get list of blogs from API (JSON)', async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect('Content-Type', /application\/json/)
});
test('Each blog must have an "id" property defined', async () => {
    const response = await api
        .get("/api/blogs")
        .expect(200)
        .expect('Content-Type', /application\/json/);

    response.body.forEach(blog => {
        assert.ok(blog.id, 'The blog ID should be returned as the "id" property');
    });
});
test('Register blog and check registration.', async () => {
    let blogBefore = await api
        .get("/api/blogs")
        .expect(200)
        .expect('Content-Type', /application\/json/);

    await api
        .post("/api/blogs")
        .send({
            title: "Life of 1s0n1x",
            author: "1s0n1x Development",
            url: "https://localhost:3000"
        })
    await api
        .post("/api/blogs")
        .send({
            title: "Life of Hyram",
            author: "1s0n1x Development",
            url: "https://localhost:3000"
        })

    let blogAfter = await api
        .get("/api/blogs")
        .expect(200)
        .expect('Content-Type', /application\/json/);

    assert.deepStrictEqual(blogAfter.body.length, blogBefore.body.length + 2);

});
test('Check if likes are set to 0 if not defined', async () => {
    const response = await api
        .post("/api/blogs")
        .send({
            title: "Request for dummies",
            author: "1s0n1x Development",
            url: "https://localhost:3000"
        })
        .expect(201)
        .expect('Content-Type', /application\/json/);

        assert.ok(response.body.likes === 0, 'The "Likes" being indefinite should be set to 0');
});
test('Check to see if requests contain title and URL', async () => {
    //Case #1: Title is not defined
    await api
        .post("/api/blogs")
        .send({
            author: "1s0n1x Development",
            url: "https://localhost:3000"
        })
        .expect(400)
        .expect('Content-Type', /application\/json/);

    //Case #2: URL is not defined
    await api
        .post("/api/blogs")
        .send({
            title: "Request for dummies",
            author: "1s0n1x Development"
        })
        .expect(400)
        .expect('Content-Type', /application\/json/);
});


after(async () => {
    await mongoose.connection.close()
});
