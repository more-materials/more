import type { Express } from "express";
import { createServer, type Server } from "http";
import { api } from "@shared/routes";
import { z } from "zod";
import fetch from "node-fetch";
import { FirebaseAdmin } from "./lib/firebaseAdmin"; // import types

export async function registerRoutes(
  httpServer: Server,
  app: Express,
  firebase: FirebaseAdmin // <- receive Firebase admin objects
): Promise<Server> {
  const { adminDb, adminAuth, adminStorage } = firebase;

  // Departments
  app.get(api.departments.list.path, async (req, res) => {
    const snapshot = await adminDb.collection("departments").get();
    const departments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(departments);
  });

  app.post(api.departments.create.path, async (req, res) => {
    const deptData = api.departments.create.input.parse(req.body);
    const docRef = await adminDb.collection("departments").add(deptData);
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  });

  app.delete(api.departments.delete.path, async (req, res) => {
    await adminDb.collection("departments").doc(String(req.params.id)).delete();
    res.sendStatus(204);
  });

  // Courses
  app.get(api.courses.list.path, async (req, res) => {
    const snapshot = await adminDb.collection("courses").get();
    const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(courses);
  });

  app.post(api.courses.create.path, async (req, res) => {
    const courseData = api.courses.create.input.parse(req.body);
    const docRef = await adminDb.collection("courses").add(courseData);
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  });

  app.delete(api.courses.delete.path, async (req, res) => {
    await adminDb.collection("courses").doc(String(req.params.id)).delete();
    res.sendStatus(204);
  });

  // Classes
  app.get(api.classes.list.path, async (req, res) => {
    const snapshot = await adminDb.collection("classes").get();
    const classes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(classes);
  });

  app.post(api.classes.create.path, async (req, res) => {
    const clsData = api.classes.create.input.parse(req.body);
    const docRef = await adminDb.collection("classes").add(clsData);
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  });

  app.delete(api.classes.delete.path, async (req, res) => {
    await adminDb.collection("classes").doc(String(req.params.id)).delete();
    res.sendStatus(204);
  });

  // Content
  app.get(api.content.list.path, async (req, res) => {
    const classId = req.query.classId ? String(req.query.classId) : undefined;
    let query = adminDb.collection("content");
    if (classId) query = query.where("classId", "==", classId);
    const snapshot = await query.get();
    const contents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(contents);
  });

  app.post(api.content.create.path, async (req, res) => {
    const itemData = api.content.create.input.parse(req.body);
    const docRef = await adminDb.collection("content").add(itemData);
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  });

  app.post(api.content.verify.path, async (req, res) => {
    const doc = await adminDb.collection("content").doc(String(req.params.id)).get();
    const item = doc.data();
    if (!item) return res.status(404).json({ message: "Not found" });
    if (!item.isLocked || item.password === req.body.password)
      return res.json({ success: true, url: item.url });
    res.status(403).json({ message: "Invalid" });
  });

  // Subscription APIs (external fetch)
  app.post(api.subscription.check.path, async (req, res) => {
    const r = await fetch(
      `https://api.zetubridge.co.ke/verify-access?email=${req.body.email}&device_id=${req.body.deviceId}`
    );
    res.json(await r.json());
  });

  app.post(api.subscription.initiate.path, async (req, res) => {
    const r = await fetch("https://api.zetubridge.co.ke/initiate-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    res.json(await r.json());
  });

  app.get(api.subscription.plans.path, async (req, res) => {
    const r = await fetch("https://api.zetubridge.co.ke/plans");
    res.json(await r.json());
  });

  return httpServer;
}
