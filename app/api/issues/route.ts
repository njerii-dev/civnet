import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(request: NextRequest) {
  if (request.method === "GET") {
    try {
      // Get all issues sorted by newest first
      const issues = await prisma.issue.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          citizen: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          respondedBy: {
            select: {
              id: true,
              name: true,
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  role: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      return NextResponse.json(issues, { status: 200 });
    } catch (error) {
      console.error("Get issues error:", error);
      return NextResponse.json(
        { error: "Failed to fetch issues" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export const GET = requireAuth((request: NextRequest) =>
  handler(request)
);
