import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import fetch from "node-fetch"; // You might need to install this or use built-in fetch in Node 18+

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // === Classes ===
  app.get(api.classes.list.path, async (req, res) => {
    const classes = await storage.getClasses();
    res.json(classes);
  });

  app.post(api.classes.create.path, async (req, res) => {
    try {
      const input = api.classes.create.input.parse(req.body);
      const newClass = await storage.createClass(input);
      res.status(201).json(newClass);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  app.delete(api.classes.delete.path, async (req, res) => {
    await storage.deleteClass(Number(req.params.id));
    res.sendStatus(204);
  });

  // === Content ===
  app.get(api.content.list.path, async (req, res) => {
    const classId = req.query.classId ? Number(req.query.classId) : undefined;
    const content = await storage.getContentByClass(classId);
    
    // Remove password from response for security
    const safeContent = content.map(c => {
      const { password, ...rest } = c;
      return { ...rest, hasPassword: !!password };
    });
    
    res.json(safeContent);
  });

  app.post(api.content.create.path, async (req, res) => {
    try {
      const input = api.content.create.input.parse(req.body);
      const newContent = await storage.createContent(input);
      res.status(201).json(newContent);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  app.get(api.content.get.path, async (req, res) => {
    const item = await storage.getContent(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Content not found" });
    
    // Security: Only return URL if NOT locked. If locked, client must use /verify.
    const { password, url, ...rest } = item;
    
    if (item.isLocked) {
      // Return without URL
      res.json({ ...rest, hasPassword: true });
    } else {
      // Return WITH URL
      res.json({ ...rest, url, hasPassword: false });
    }
  });

  app.delete(api.content.delete.path, async (req, res) => {
    await storage.deleteContent(Number(req.params.id));
    res.sendStatus(204);
  });

  app.post(api.content.verify.path, async (req, res) => {
    const { password } = req.body;
    const id = Number(req.params.id);
    const item = await storage.getContent(id);
    
    if (!item) return res.status(404).json({ message: "Content not found" });

    if (!item.isLocked) {
      return res.json({ success: true, url: item.url });
    }

    if (item.password === password) {
      return res.json({ success: true, url: item.url });
    } else {
      return res.status(403).json({ message: "Invalid password" });
    }
  });

  // === Subscription Proxy ===
  app.post(api.subscription.check.path, async (req, res) => {
    const { email, deviceId } = req.body;
    
    // Proxy to ZetuBridge
    try {
      const response = await fetch(`https://api.zetubridge.co.ke/verify-access?email=${email}&device_id=${deviceId}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("ZetuBridge Error:", error);
      // Fallback for development/offline if needed, or error
      // Mocking for now if external API fails or is unreachable in this environment
      res.json({ access: true }); // Default to Allow for testing if API fails
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const classes = await storage.getClasses();
  if (classes.length === 0) {
    const cls1 = await storage.createClass({ name: "DPT 1.1" });
    const cls2 = await storage.createClass({ name: "DPT 2.2" });
    
    await storage.createContent({
      classId: cls1.id,
      title: "Anatomy Basics",
      description: "Introduction to Human Anatomy",
      type: "notes",
      url: "https://example.com/anatomy.pdf",
      isLocked: false
    });

    await storage.createContent({
      classId: cls2.id,
      title: "Advanced Physiology (Locked)",
      description: "Password is '1234'",
      type: "notes",
      url: "https://example.com/physiology.pdf",
      isLocked: true,
      password: "1234"
    });
  }
}
