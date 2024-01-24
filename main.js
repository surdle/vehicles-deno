import { Hono } from "https://deno.land/x/hono@v3.11.7/mod.ts";
import { cors } from "https://deno.land/x/hono/middleware.ts";
import { getVehicles } from "./services/getVehicles.js";

const app = new Hono();

app.use("/api/*", cors());

app.get("/api/", async (c) => {
  const vehicles = await getVehicles();

  if (c.req.query("make") !== undefined) {
    const make = c.req.query("make");
    const result = vehicles.filter((vehicle) => vehicle.make === make);
    return c.json({ result });
  }

  if (c.req.query("model") !== undefined) {
    const model = c.req.query("model");
    const result = vehicles.filter((vehicle) => vehicle.model === model);
    return c.json({ result });
  }

  if (c.req.query("year") !== undefined) {
    const year = parseInt(c.req.query("year"));
    const result = vehicles.filter((vehicle) => vehicle.year === year);
    return c.json({ result });
  }

  return c.json({ vehicles });
});

app.get("/api/makes", async (c) => {
  const vehicles = await getVehicles();

  const makes = vehicles.map((vehicle) => vehicle.make);

  const uniqueMakes = [...new Set(makes)];

  return c.json({ uniqueMakes });
});

app.get("/api/years", async (c) => {
  if (c.req.query("make") === undefined) {
    return c.json({ error: "Please provide a make" });
  }

  const vehicles = await getVehicles();

  const makes = vehicles.map((vehicle) => vehicle.make);

  const uniqueMakes = [...new Set(makes)];

  const make = c.req.query("make");

  if (!uniqueMakes.includes(make)) {
    return c.json({ error: "Please provide a valid make" });
  }

  const filteredVehicles = vehicles.filter((vehicle) => vehicle.make === make);

  const years = filteredVehicles.map((vehicle) => vehicle.year);

  const uniqueYears = [...new Set(years)];

  return c.json({ uniqueYears });
});

app.get("/api/models", async (c) => {
  if (c.req.query("make") === undefined) {
    return c.json({ error: "Please provide a make" });
  }

  if (c.req.query("year") === undefined) {
    return c.json({ error: "Please provide a year" });
  }

  const vehicles = await getVehicles();

  const makes = vehicles.map((vehicle) => vehicle.make);

  const uniqueMakes = [...new Set(makes)];

  const make = c.req.query("make");

  if (!uniqueMakes.includes(make)) {
    return c.json({ error: "Please provide a valid make" });
  }

  const filteredVehicles = vehicles.filter((vehicle) => vehicle.make === make);

  const years = filteredVehicles.map((vehicle) => vehicle.year);

  const uniqueYears = [...new Set(years)];

  const year = parseInt(c.req.query("year"));

  if (!uniqueYears.includes(year)) {
    return c.json({ error: "Please provide a valid year" });
  }

  const filteredVehicles2 = filteredVehicles.filter((vehicle) =>
    vehicle.year === year
  );

  const models = filteredVehicles2.map((vehicle) => vehicle.model);

  const uniqueModels = [...new Set(models)];

  return c.json({ uniqueModels });
});

Deno.serve(app.fetch);
