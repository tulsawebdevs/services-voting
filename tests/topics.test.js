describe("Topics API", () => {
  test("GET /topics", async () => {
    const response = await fetch("http://localhost:3000/topics");
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      list: [
        {
          name: expect.any(String),
          email: expect.any(String),
          topic: expect.any(String),
          summary: expect.any(String),
          category: expect.any(String),
        },
      ],
    });
  });
});
