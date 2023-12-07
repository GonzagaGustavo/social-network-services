import express from "express";

interface CustomRequest {
  user: { id: number; email: string; name: string } | undefined | null;
}

declare global {
  namespace Express {
    interface Request extends CustomRequest {}
  }
}
