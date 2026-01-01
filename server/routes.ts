import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import fetch from "node-fetch";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.get(api.departments.list.path, async (req, res) => res.json(await storage.getDepartments()));
  app.post(api.departments.create.path, async (req, res) => {
    const dept = await storage.createDepartment(api.departments.create.input.parse(req.body));
    res.status(201).json(dept);
  });
  app.delete(api.departments.delete.path, async (req, res) => {
    await storage.deleteDepartment(Number(req.params.id));
    res.sendStatus(204);
  });

  app.get(api.courses.list.path, async (req, res) => res.json(await storage.getCourses()));
  app.post(api.courses.create.path, async (req, res) => {
    const course = await storage.createCourse(api.courses.create.input.parse(req.body));
    res.status(201).json(course);
  });
  app.delete(api.courses.delete.path, async (req, res) => {
    await storage.deleteCourse(Number(req.params.id));
    res.sendStatus(204);
  });

  app.get(api.classes.list.path, async (req, res) => res.json(await storage.getClasses()));
  app.post(api.classes.create.path, async (req, res) => {
    const cls = await storage.createClass(api.classes.create.input.parse(req.body));
    res.status(201).json(cls);
  });
  app.delete(api.classes.delete.path, async (req, res) => {
    await storage.deleteClass(Number(req.params.id));
    res.sendStatus(204);
  });

  app.get(api.content.list.path, async (req, res) => res.json(await storage.getContent()));
  app.post(api.content.create.path, async (req, res) => {
    const item = await storage.createContent(api.content.create.input.parse(req.body));
    res.status(201).json(item);
  });
  app.post(api.content.verify.path, async (req, res) => {
    const item = await storage.getContentById(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Not found" });
    if (!item.isLocked || item.password === req.body.password) return res.json({ success: true, url: item.url });
    res.status(403).json({ message: "Invalid" });
  });

  app.post(api.subscription.check.path, async (req, res) => {
    const r = await fetch(`https://api.zetubridge.co.ke/verify-access?email=${req.body.email}&device_id=${req.body.deviceId}`);
    res.json(await r.json());
  });
  app.post(api.subscription.initiate.path, async (req, res) => {
    const r = await fetch("https://api.zetubridge.co.ke/initiate-payment", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    res.json(await r.json());
  });
  app.get(api.subscription.plans.path, async (req, res) => {
    const r = await fetch("https://api.zetubridge.co.ke/plans");
    res.json(await r.json());
  });

  return httpServer;
}
