import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyAuth(request);

    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const issue = await prisma.issue.findUnique({
      where: { id },
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

    if (!issue) {
      return NextResponse.json(
        { error: "Issue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(issue, { status: 200 });
  } catch (error) {
    console.error("Get issue error:", error);
    return NextResponse.json(
      { error: "Failed to fetch issue" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyAuth(request);

    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only admins can update issues
    if (auth.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { status, adminResponse } = await request.json();

    // Validation
    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const validStatuses = ["SUBMITTED", "IN_PROGRESS", "RESOLVED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Update issue
    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: {
        status,
        adminResponse: adminResponse || undefined,
        respondedById: auth.id,
        resolvedAt: status === "RESOLVED" ? new Date() : undefined,
      },
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
        },
      },
    });

    return NextResponse.json(
      { message: "Issue updated successfully", issue: updatedIssue },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update issue error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Issue not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update issue" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
