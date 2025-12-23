
const usersData = await Bun.file("data/users.json").json();
const ordersData = await Bun.file("data/orders.json").json();

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // CORS headers
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle OPTIONS for CORS
    if (req.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    // GET /users/:userId - Get user details by userId
    if (path.startsWith("/users/") && req.method === "GET") {
      const userId = path.split("/users/")[1];
      
      const user = usersData.users.find((u: any) => u.userId === userId);
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: "User not found" }),
          { status: 404, headers }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data: user }),
        { status: 200, headers }
      );
    }

    // GET /orders/:userId - Get all orders for a specific user
    if (path.startsWith("/orders/") && req.method === "GET") {
      const userId = path.split("/orders/")[1];
      
      // Check if user exists
      const user = usersData.users.find((u: any) => u.userId === userId);
      if (!user) {
        return new Response(
          JSON.stringify({ error: "User not found" }),
          { status: 404, headers }
        );
      }

      // Get all orders for this user
      const userOrders = ordersData.orders.filter((o: any) => o.userId === userId);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: {
            userId,
            totalOrders: userOrders.length,
            orders: userOrders
          }
        }),
        { status: 200, headers }
      );
    }

    // GET /users - Get all users
    if (path === "/users" && req.method === "GET") {
      return new Response(
        JSON.stringify({ success: true, data: usersData.users }),
        { status: 200, headers }
      );
    }

    // GET /orders - Get all orders
    if (path === "/orders" && req.method === "GET") {
      return new Response(
        JSON.stringify({ success: true, data: ordersData.orders }),
        { status: 200, headers }
      );
    }

    // GET / - API info
    if (path === "/" && req.method === "GET") {
      return new Response(
        JSON.stringify({
          message: "D2C Skincare Backend API",
          version: "1.0.0",
          endpoints: {
            "/users": "GET - Get all users",
            "/users/:userId": "GET - Get user details by userId",
            "/orders": "GET - Get all orders",
            "/orders/:userId": "GET - Get all orders for a specific user"
          }
        }),
        { status: 200, headers }
      );
    }

    // 404 - Route not found
    return new Response(
      JSON.stringify({ error: "Route not found" }),
      { status: 404, headers }
    );
  },
});

console.log(`🚀 Server running at http://localhost:${server.port}`);
console.log("\n📚 Available endpoints:");
console.log("  GET  /users              - Get all users");
console.log("  GET  /users/:userId      - Get user details by userId");
console.log("  GET  /orders             - Get all orders");
console.log("  GET  /orders/:userId     - Get all orders for a specific user");
console.log("\n💡 Example:");
console.log(`  curl http://localhost:${server.port}/users/550e8400-e29b-41d4-a716-446655440001`);
console.log(`  curl http://localhost:${server.port}/orders/550e8400-e29b-41d4-a716-446655440001`);
