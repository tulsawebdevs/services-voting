describe("Proposals API", () => {
  test("should return all proposals", async () => {
    const res = await fetch("http://localhost:3000/proposals");
    const data = await res.json();
    expect(res.status).toEqual(200);
    // expect(data).toEqual({ message: "Paginated list of proposals" });
  });

  test("should create a new proposal", async () => {
    const res = await fetch("http://localhost:3000/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    expect(res.status).toEqual(201);
    expect(data).toEqual({ message: "Proposal created" });
  });

  test("should return a specific proposal", async () => {
    const res = await fetch("http://localhost:3000/proposals/1");
    const data = await res.json();
    expect(res.status).toEqual(200);
    expect(data).toEqual({ message: "Proposal with ID 1" });
  });

  test("should update a specific proposal", async () => {
    const res = await fetch("http://localhost:3000/proposals/1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    expect(res.status).toEqual(200);
    expect(data).toEqual({ message: "Proposal with ID 1 updated" });
  });

  test("should delete a specific proposal", async () => {
    const res = await fetch("http://localhost:3000/proposals/1", {
      method: "DELETE",
    });
    expect(res.status).toEqual(204);
  });
});
